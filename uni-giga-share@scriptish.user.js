// ==UserScript==
// @id             f918bae9-3473-4c12-85de-630d840499f0@scriptish
// @name           unigigashare
// @version        1.0
// @namespace      
// @author         Black_Sun
// @description    Скрипт выводит ссылку на скачивание в верху страницы. Есть настройка автоскачивания (включена по умолчанию), для выключения см. код скрипта.
// @include        http://www.share4web.com/*
// @include        http://www.unibytes.com/*
// @include        http://www.gigabase.com/*
// @require	       http://code.jquery.com/jquery-latest.min.js
// @run-at         document-end
// ==/UserScript==

var autodownload=true; //Для выключения автоскачивания написать false вместо true; и соответственно наоборот для включения.


(function(){
	var loca=location.host
	$('body').prepend('<div id="lnk" style="margin:0 auto;display:block;color:green;font-size:28px;padding:30px;width:100%;background:#D5E7FD;text-align:center">Грузим ссылку</div>');
	switch (loca){
		case "www.unibytes.com":
			getlnk("fdload")
		break;
		case "www.gigabase.com":
			getlnk("dfile")
		break;
		case "www.share4web.com":
			getlnk("getf")
		break;
	}
})()

function getlnk(ident){
	var lnk1=$('.nothx1').attr('href');
	$.get(lnk1,function(tel){
		var lnkfinal=$('a[href*="/'+ident+'/"]',tel)
		$('#lnk').html(lnkfinal)
		if(autodownload)location.href=$('a[href*="/'+ident+'/"]',tel).attr('href');
	})
}