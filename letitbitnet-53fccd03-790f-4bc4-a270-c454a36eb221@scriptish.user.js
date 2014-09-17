// ==UserScript==
// @id             letitbit.net-53fccd03-790f-4bc4-a270-c454a36eb221@scriptish
// @name           Letitbit to captcha 
// @version        1.5.11.1
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
// @description    Просто пропуск до каптчи на сайте letitbit.net с автоматической показом картинки каптчи и фокусом на поле ввода и работающим Enter после ввода каптчи.
// @include        http://letitbit.net/*
// @include        http://*.letitbit.net/*
// @include        http://js.paycaptcha.net/*
// @include        http://goclips.tv/download*.php
// @require	http://code.jquery.com/jquery-latest.min.js
// @run-at         document-end
// ==/UserScript==

var a = location.href;
var b = document.getElementById("ifree_form");
$('body').attr('onclick','javascript:void(0);return false;')
if (a.search(/u\d{1,}\.letitbit\.net\/download/ig) != -1) {
	$('body').prepend("<span style='font:24px Arial bold;color:white;background:#044DA4;width:100%;display:block;text-align:center'>Страница скоро инициализируется, ждите, зависит от скорости letitbit'a</span>")
    append(injector)
    b.setAttribute("action", "http://letitbit.net/download3.php");
}

function append(s) {
    document.head.appendChild(document.createElement('script'))
	.innerHTML = s.toString().replace(/^function.*{|}$/g, '');
}

function injector() {
    function check() {
        var inps = document.getElementById("ifree_form").getElementsByTagName('input')
        for (var i = 0; i < inps.length; i++) {
            if (inps[i].getAttribute('name') == "redirect_to_pin") {
                $("#ifree_form").submit()
			}
		}
        setTimeout(check, 1000)
	}
    check()
};
if (a.search(/\/js.paycaptcha.net.*/ig) != -1) {
	window.close();
}
if (a.search(/\/download3.php$/ig) != -1) {
	
    var fcp=$('.vcaptcha_wrapper').find('.mcmp_img').attr('src')
    $(function(){
	$('head').append('<script type="text/javascript">function stopEvent(e) {if(!e) var e = window.event;e.cancelBubble = true;e.returnValue = false;if (e.stopPropagation) {e.stopPropagation();e.preventDefault();}return false;}</script>')
	setTimeout(function(){
	$('#download_form').find('div.payca').find('input').on('click',function(){stopEvent(event)});
	    $('#download_form').find('div.payca').find('input').attr('onclick','stopEvent(event)')
		$('#download_form').find('div.payca').find('div').hide();
		$('#download_form').attr('onsubmit','stopEvent(event)')
		$('#download_form').find('button').attr('onclick','stopEvent(event)')
	},1000)
		$('#captcha').prepend('<img src="'+fcp+'" style="position: absolute;z-index:2000;margin-left:-320px" />').find('div.centered').show()
		$('.video-block,.content-cross,.page-content-wrapper iframe[src*="moevideo"]').hide();
		
		$("#videocaptcha_word").keypress(function( event ) {
			if ( event.which == 13 ) {
				$('.vcaptcha_inputs').find('button').trigger('click');
				$('.vcaptcha_inputs').find('button').trigger('click');
			}
		})
		$('.vcaptcha_inputs').find('button').one('click',function() {
			$('.vcaptcha_inputs').find('button').trigger('click');
		})
		$('#videocaptcha_word').focus();
	});
	if ($("body").hasClass("download4-rebrand")) {
		$('object').remove();
		$('#captcha').removeClass('hide');
		$('#download_content').remove();
		$('#dialog_reminder').remove()
		$('#d3_form').attr('id','deform'); 
		$("#skymonk_checkbox").find('input').eq(0).attr('checked', false)
		$("#captcha").removeClass("hide")
		$("body").css({
			background: "none"
		})
		$(".wrapper-centered>.centered:eq(0), .wrapper-centered>.spec-list:eq(0),#download_content,.lid-downloader-link").hide()
		} else {
		$('#captcha').removeClass('hide');
		$('#download_content').remove();
		$('object').remove();
		$('#dialog_reminder').remove();
		if(document.title=="INCOME TRADER - Торговля бинарными опционами"){
		$('video').remove()
			setTimeout(function(){$('#d3_form').submit()},1000)
			
			}
		//$('#d3_form').attr('id','deform'); 
		$("#free_download_action").removeClass("hide-block")
		$("#skymonk_checkbox").find('input').eq(0).attr('checked', false)
		$(".ui-dialog").remove()
		$("#captcha").removeClass("hide-block")
		$("#links").removeClass("hide-block")
		$("#stopwatch").addClass("hide-block")
	}
}