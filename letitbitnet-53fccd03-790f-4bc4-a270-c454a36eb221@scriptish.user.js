// ==UserScript==
// @id             letitbit.net-53fccd03-790f-4bc4-a270-c454a36eb221@scriptish
// @name           Letitbit to captcha 
// @version        2.0
// @history        2.0 Переписал скрипт целиком, теперь ссылка появляется сразу без ожидания, если она есть, уменьшил и модифицировал скрипт ReklatsMasters, некоторая структура сохранена, некоторая переделана, ждём других сриптов от ReklatsMasters.
// @history        1.5.12.1 Добавлены ссылка автоматического обновления на случай не подхвата при установке оного.
// @history        1.5.12 Обход новых изменений
// @history        1.5.11.2 Изменено: jquery библиотека, связано со взломом сайта jquery 
// @history        1.5.11 Не удалось убрать открытие окна, выставил его закрытие при открытии, закрытие работает не везде.
// @history        1.5.10 Добавил тестовый вариант удаления открывающегося окна с рекламой
// @history        1.5.9 Летитбит вставил страница проверки на страницу скачивания, обход.
// @history        1.5.8 Новая страница
// @history        1.5.7 Добавил окончательно вывод каптчи, добавил обработку ENTER на форме ввода каптчи, добавил корректную обработку клика по кнопке send при наличии ENTER.
// @history        1.5.6 Исправил мелкий баг, при котором невозможно скачать файл.
// @history        1.5.5 И сразу очередной апдейт на автофокус на поле ввода каптчи.
// @history        1.5.4 Попытка вывести каптчу
// @history        1.5.3 Немного убавил время ожидания и сразу открыл каптчу на странице.
// @history        1.5.2 Видео зачем-то перенесли на страницу скачивания, убрал.
// @history        1.5.1 Попытка убрать нофикатор о скаймонке
// @history        1.5 Добавлена информация о происходящем.
// @history        1.4 Новый тип генерации input
// @history        1.3 Убрано автоскачивание, подправлены некоторые баги, код теперь не зашифрован.
// @history        1.2 Добавления функция автоскачивание, но пока что для её вкл\выкл нужно менять строчку кода
// @history        1.1 Поддержка skymonk страницы
// @history        1.0 Версия пропуска страниц до каптчи (в некоторых странах нет каптчи, просто сразу ссылка)
// @namespace      http://userscripts.org/scripts/show/157017
// @author         Black_Sun
// @description    Выводит сразу ссылку на скачивание, огромное спасибо спасибо ReklatsMasters.
// @include        http://letitbit.net/download*
// @include        http://*.letitbit.net/download*
// @include        http://vip-file.com/download*
// @include        http://*.vip-file.com/download*
// @include        http://shareflare.net/download*
// @include        http://*.shareflare.net/download*
// @updateURL https://openuserjs.org/install/Black_Sun/Letitbit_to_captcha.user.js
// @Download https://openuserjs.org/install/Black_Sun/Letitbit_to_captcha.user.js
// @require https://openuserjs.org/src/libs/Black_Sun/md5.js
// @run-at         document-end
// ==/UserScript==

function e(t) {
	var e = hex_md5(Math.random().toString()),
	n = {
		action: "LINK_GET_DIRECT",
		link: t,
		appid: e,
		version: 3,
		free_link: 1,
		sh: r(t, e),
		sp: 50
	};
	return Object.keys(n).map(function(t) {
		return t + "=" + n[t]
	}).join("&")
}


function r(lnk, hex) {
	var e = [];
	return e.push("kAY54boSH+"), e.push(lnk.split("/").slice(0, -1).join("/") + "/"), e.push(hex), e.push(50), e.push("gUnS60oleO^"), hex_md5(hex_md5(e.join("|")))
}

function i() {
	var lnk = document.getElementById("link_for_downloader").value;
	GM_xmlhttpRequest({
		method: "POST",
		url: "http://api.letitbit.net/internal/index4.php",
		data: e(lnk),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": ""
		},
		onload: function(t) {
			var answer = t.responseText.split("\n");
			if(answer[0].toLowerCase()=="ok"){
				document.getElementById('not_pbc_content').innerHTML='<a id="premium_button" class="btn big wide clink lid-download-premium" type="button" style="background-position:-300px 0;" href="'+answer[2]+'" >Скачать файл</a><br><br><br><input value="'+answer[2]+'" onclick="this.select()" type="text" style="width:100%"></input>'
			}
		},
		onerror: function() {
			console.error("error")
		}
	})
}

window.addEventListener("DOMContentLoaded", i, !1)