// ==UserScript==
// @id             coldfilm.ru-6c434ad0-254a-410f-8d3c-c5172404085f@scriptish
// @name           auto-torrent-link
// @version        1.3
// @history        1.3 Добавил ссылки на автообновление, на всякий случай.
// @history        1.2 Исправил перекрытие скриптов сайта и моим, т.о. вернул полную работоспособность сайта + мой скрипт.
// @history        1.1 Добавил mchat в исключения
// @history        1.0 Релиз
// @namespace      https://openuserjs.org/scripts/Black_Sun/auto-torrent-link
// @author         Black_Sun
// @description    Скрипт выводит на главную страницу под сериалом ссылки на торрент для скачивания, как только они появляются в новости. Делает много запросов, поэтому часто страницу не обновлять!
// @include        http://coldfilm.ru/*
// @exclude        http://coldfilm.ru/news/*/*
// @exclude        http://coldfilm.ru/mchat
// @exclude        http://coldfilm.ru/mchat/*
// @updateURL https://openuserjs.org/install/Black_Sun/auto-torrent-link.user.js
// @Download https://openuserjs.org/install/Black_Sun/auto-torrent-link.user.js
// @noframes
// @grant none
// @unwrap
// @run-at         document-end
// ==/UserScript==

$(function(){
	
	$('.entryLink').each(function(i){
		$('.viewn_cont').eq(i).append("<style>#lnks"+i+" a{display:block;color:green}</style><div id='lnks"+i+"' style='display:block;margin:0 auto;text-align:center;color:darkred;font-size:20px'></div>")
		$.get($(this).attr('href'),function(data){
			var ah=$('.eMessage',data).find('a');
			$('#lnks'+i).closest('div.viewn_loop').find('div.viewn_t').attr({
				'onclick':'$(this).parent().find("div.viewn_c").toggle(800)',
				'style':'cursor:pointer'				
				})
			if(ah.attr('href')!="undefined"){$('#lnks'+i).html(ah)}
			if(ah.attr('href')===undefined){
				
				/*$('#lnks'+i).closest('div[id^="entryID"]').remove()*/
				$('#lnks'+i).closest('div.viewn_c').hide()
				$('#lnks'+i).closest('div.viewn_loop').find('h4.viewn_title').append('<span title="Нажмите чтобы свернуть/развернуть" style="color:darkred"> Серия ещё не переведена</span>').find('a').attr('style','color:darkred')
				$('#lnks'+i).text('Серия ещё не переведена')
				
				}
		})
		
	})
});	