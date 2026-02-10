"""
OTP Auto Fill Server - Python сервер для автоматического ввода OTP на Windows ПК
Запуск: python otp_server.py
Доступ с мобилы: http://<IP_ПК>:5000
"""

from flask import Flask, jsonify, render_template_string, request
from flask_cors import CORS
import io
import json
import logging
import os
import subprocess
import sys
import threading
import time
from collections import deque
from datetime import datetime

import pyautogui

try:
    import ctypes
    import win32con
    import win32gui

    WINDOWS_AVAILABLE = True
except ImportError:
    WINDOWS_AVAILABLE = False

if sys.stdout.encoding != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")


class UTF8Formatter(logging.Formatter):
    def format(self, record):
        record.msg = (
            str(record.msg)
            .replace("✅", "[OK]")
            .replace("❌", "[ERROR]")
            .replace("⚠️", "[WARN]")
            .replace("🔐", "[OTP]")
        )
        return super().format(record)


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

file_handler = logging.FileHandler("otp_server.log", encoding="utf-8")
file_handler.setFormatter(UTF8Formatter("%(asctime)s - %(levelname)s - %(message)s"))

console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(UTF8Formatter("%(asctime)s - %(levelname)s - %(message)s"))

logger.addHandler(file_handler)
logger.addHandler(console_handler)

logging.getLogger("werkzeug").setLevel(logging.WARNING)

app = Flask(__name__)
CORS(app)

CONFIG_FILE = "otp_config.json"
CONFIG = {
    "window_title": "VPNCONNECTER",
    "auto_input": True,
    "bat_file": r"C:\Program Files (x86)\Cisco\Cisco AnyConnect Secure Mobility Client\vpnauto-2fa.bat",
    "success_count": 0,
    "fail_count": 0,
    "last_otp": None,
    "last_otp_time": None,
}


class BatOutputBuffer:
    def __init__(self, max_size=1000):
        self.buffer = deque(maxlen=max_size)
        self.new_lines = deque(maxlen=max_size)
        self.lock = threading.Lock()

    def add(self, line, is_error=False):
        ts = datetime.now().strftime("%H:%M:%S")
        prefix = "[ERROR]" if is_error else f"[{ts}]"
        item = f"{prefix} {line}".rstrip()
        with self.lock:
            self.buffer.append(item)
            self.new_lines.append(item)

    def get_new(self):
        with self.lock:
            out = list(self.new_lines)
            self.new_lines.clear()
        return out

    def get_all(self):
        with self.lock:
            return list(self.buffer)

    def clear(self):
        with self.lock:
            self.buffer.clear()
            self.new_lines.clear()


bat_output_buffer = BatOutputBuffer()


def load_config():
    if not os.path.exists(CONFIG_FILE):
        return
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            CONFIG.update(json.load(f))
    except Exception as e:
        logger.error(f"Error loading config: {e}")


def save_config():
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(CONFIG, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Error saving config: {e}")


def find_window_by_title(title):
    if not WINDOWS_AVAILABLE:
        return None
    try:
        return win32gui.FindWindow(None, title)
    except Exception as e:
        logger.error(f"Error finding window: {e}")
        return None


def activate_window(hwnd):
    if not WINDOWS_AVAILABLE:
        return False

    try:
        current_thread = ctypes.windll.kernel32.GetCurrentThreadId()
        target_thread = ctypes.windll.user32.GetWindowThreadProcessId(hwnd, None)

        attached = False
        if current_thread != target_thread:
            ctypes.windll.user32.AttachThreadInput(current_thread, target_thread, True)
            attached = True

        ctypes.windll.user32.ShowWindow(hwnd, win32con.SW_RESTORE)
        time.sleep(0.1)
        ctypes.windll.user32.SetForegroundWindow(hwnd)
        ctypes.windll.user32.SetFocus(hwnd)

        if attached:
            ctypes.windll.user32.AttachThreadInput(current_thread, target_thread, False)

        return True
    except Exception as e:
        logger.error(f"Error activating window: {e}")
        return False


def type_otp(otp_code, delay=0.07):
    try:
        pyautogui.FAILSAFE = False
        for char in otp_code:
            pyautogui.press(char)
            time.sleep(delay)
        pyautogui.press("return")
        return True
    except Exception as e:
        bat_output_buffer.add(f"Ошибка ввода OTP: {e}", is_error=True)
        return False


def send_otp_to_vpn_console(otp_code):
    hwnd = find_window_by_title(CONFIG["window_title"])
    if not hwnd:
        bat_output_buffer.add(f"Окно {CONFIG['window_title']} не найдено", is_error=True)
        return False

    activate_window(hwnd)
    time.sleep(0.3)
    return type_otp(otp_code)


def _decode_line(line_bytes):
    for enc in ("utf-8", "cp866", "cp1251"):
        try:
            return line_bytes.decode(enc).rstrip("\r\n")
        except UnicodeDecodeError:
            continue
    return line_bytes.decode("utf-8", errors="replace").rstrip("\r\n")


def run_bat_with_otp(otp_code):
    bat_path = CONFIG["bat_file"]
    if not os.path.exists(bat_path):
        bat_output_buffer.add(f"BAT файл не найден: {bat_path}", is_error=True)
        return False

    bat_output_buffer.clear()
    bat_output_buffer.add(f"Запуск BAT: {bat_path}")
    bat_output_buffer.add(f"Аргумент OTP: {otp_code}")

    cmd = ["cmd", "/c", bat_path, otp_code]
    working_dir = os.path.dirname(os.path.abspath(bat_path)) or "."

    try:
        process = subprocess.Popen(
            cmd,
            cwd=working_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
    except Exception as e:
        bat_output_buffer.add(f"Не удалось запустить BAT: {e}", is_error=True)
        return False

    def reader(proc):
        try:
            assert proc.stdout is not None
            for raw in iter(proc.stdout.readline, b""):
                if not raw:
                    break
                line = _decode_line(raw)
                bat_output_buffer.add(line)
                logger.info(f"[BAT] {line}")
        except Exception as e:
            bat_output_buffer.add(f"Ошибка чтения вывода BAT: {e}", is_error=True)
        finally:
            code = proc.wait()
            if code == 0:
                bat_output_buffer.add("BAT завершился успешно")
            else:
                bat_output_buffer.add(f"BAT завершился с кодом {code}", is_error=True)

    threading.Thread(target=reader, args=(process,), daemon=True).start()
    return True


def handle_otp(otp_code, run_bat=False):
    success = True

    if run_bat:
        success = run_bat_with_otp(otp_code)

    if success and CONFIG["auto_input"]:
        success = send_otp_to_vpn_console(otp_code)

    if success:
        CONFIG["success_count"] += 1
        CONFIG["last_otp"] = otp_code
        CONFIG["last_otp_time"] = datetime.now().isoformat()
        bat_output_buffer.add(f"OTP обработан: {otp_code}")
    else:
        CONFIG["fail_count"] += 1

    save_config()
    return success


@app.route("/")
def index():
    return render_template_string(HTML_TEMPLATE)


@app.route("/api/otp", methods=["POST"])
def receive_otp():
    try:
        data = request.get_json(silent=True) or {}
        otp_code = (data.get("otp") or "").strip()
        run_bat = bool(data.get("run_bat", False))

        if len(otp_code) != 6 or not otp_code.isdigit():
            return jsonify({"success": False, "message": "OTP должен быть 6 цифр"}), 400

        def worker():
            handle_otp(otp_code, run_bat=run_bat)

        threading.Thread(target=worker, daemon=True).start()
        return jsonify({"success": True, "message": "OTP принят в обработку"})
    except Exception as e:
        logger.error(f"Error processing OTP request: {e}")
        return jsonify({"success": False, "message": f"Ошибка сервера: {e}"}), 500


@app.route("/api/status", methods=["GET"])
def get_status():
    return jsonify(
        {
            "status": "running",
            "success_count": CONFIG["success_count"],
            "fail_count": CONFIG["fail_count"],
            "last_otp": CONFIG["last_otp"],
            "last_otp_time": CONFIG["last_otp_time"],
            "window_title": CONFIG["window_title"],
            "bat_file": CONFIG["bat_file"],
        }
    )


@app.route("/api/config", methods=["GET", "POST"])
def manage_config():
    if request.method == "GET":
        return jsonify(CONFIG)

    try:
        data = request.get_json(silent=True) or {}
        for key in ("window_title", "bat_file", "auto_input"):
            if key in data:
                CONFIG[key] = data[key]
        save_config()
        return jsonify({"success": True, "config": CONFIG})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400


@app.route("/api/bat-output", methods=["GET"])
def get_bat_output():
    return jsonify({"success": True, "output": bat_output_buffer.get_new()})


@app.route("/api/bat-output-all", methods=["GET"])
def get_bat_output_all():
    return jsonify({"success": True, "output": bat_output_buffer.get_all()})


HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Auto Fill</title>
    <style>
        body { font-family: Arial, sans-serif; background:#f2f5f9; margin:0; padding:20px; }
        .container { max-width:900px; margin:0 auto; background:white; border-radius:12px; padding:24px; box-shadow:0 8px 20px rgba(0,0,0,.08); }
        h1 { margin-top:0; color:#1f5f8b; }
        .row { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px; }
        input, button { padding:12px; border-radius:8px; font-size:16px; border:1px solid #cdd6e1; }
        input { flex:1; min-width:220px; }
        button { cursor:pointer; border:none; color:white; font-weight:700; }
        .btn-primary { background:#1f8ef1; }
        .btn-success { background:#2cb67d; }
        .btn-clear { background:#8a94a6; }
        #batConsole { margin-top:15px; background:#141820; color:#d3f9d8; border-radius:8px; padding:14px; height:420px; overflow:auto; white-space:pre-wrap; font-family:Consolas,monospace; }
        .error { color:#ff8787; }
        .ok { color:#8ce99a; }
        .meta { color:#74c0fc; }
        .status { margin-top:10px; color:#475569; font-size:14px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 OTP Auto Fill</h1>

        <div class="row">
            <input id="otpInput" maxlength="6" placeholder="Введите OTP (6 цифр)" inputmode="numeric">
        </div>

        <div class="row">
            <button class="btn-success" onclick="submitOTP(true)">▶ Запустить BAT с введённым кодом</button>
            <button class="btn-primary" onclick="submitOTP(false)">✓ Отправить OTP без запуска BAT</button>
            <button class="btn-clear" onclick="clearOTP()">✕ Очистить</button>
        </div>

        <div class="status" id="statusInfo">Готово</div>

        <h3>📋 Полный вывод BAT</h3>
        <div id="batConsole"></div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('otpInput').addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
            loadAllOutput();
            setInterval(updateConsole, 400);
        });

        async function submitOTP(runBat) {
            const otp = document.getElementById('otpInput').value.trim();
            if (!/^\\d{6}$/.test(otp)) {
                alert('Введите ровно 6 цифр');
                return;
            }

            try {
                const resp = await fetch('/api/otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ otp: otp, run_bat: runBat })
                });
                const data = await resp.json();
                setStatus(data.message, data.success);
                if (data.success) document.getElementById('otpInput').value = '';
            } catch (e) {
                setStatus('Ошибка соединения с сервером', false);
            }
        }

        function clearOTP() {
            document.getElementById('otpInput').value = '';
            document.getElementById('otpInput').focus();
        }

        function appendLines(lines) {
            const c = document.getElementById('batConsole');
            lines.forEach((line) => {
                const el = document.createElement('div');
                if (line.includes('[ERROR]')) el.className = 'error';
                else if (line.includes('успешно') || line.includes('[OK]')) el.className = 'ok';
                else if (line.startsWith('[')) el.className = 'meta';
                el.textContent = line;
                c.appendChild(el);
            });
            c.scrollTop = c.scrollHeight;
        }

        async function loadAllOutput() {
            try {
                const resp = await fetch('/api/bat-output-all');
                const data = await resp.json();
                if (data.output) appendLines(data.output);
            } catch (e) {
                setStatus('Не удалось загрузить историю вывода BAT', false);
            }
        }

        async function updateConsole() {
            try {
                const resp = await fetch('/api/bat-output');
                const data = await resp.json();
                if (Array.isArray(data.output) && data.output.length) {
                    appendLines(data.output);
                }
            } catch (e) {
                // просто игнорируем кратковременные ошибки
            }
        }

        function setStatus(msg, ok) {
            const el = document.getElementById('statusInfo');
            el.textContent = msg;
            el.style.color = ok ? '#2b8a3e' : '#c92a2a';
        }
    </script>
</body>
</html>
"""


def install_dependencies():
    packages = ["flask", "flask-cors", "pyautogui", "pywin32"]
    for package in packages:
        try:
            if package == "pywin32":
                __import__("win32gui")
            else:
                __import__(package.replace("-", "_"))
        except ImportError:
            logger.info(f"Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package, "--quiet"])


if __name__ == "__main__":
    install_dependencies()
    load_config()
    logger.info("OTP Auto Fill Server started: http://<PC_IP>:5000")
    app.run(host="0.0.0.0", port=5000, debug=False, threaded=True)
