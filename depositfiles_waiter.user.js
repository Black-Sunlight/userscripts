// ==UserScript==
// @id             depositfiles_waiter
// @name           depositfiles_downloader
// @namespace      https://openuserjs.org/scripts/Black_Sun/depositfiles_downloader
// @version        4.7
// @history        4.7 Модифицировал код под Greasemonkey, т.к. Scriptish автор походу забросил.
// @history        4.6 Совсем убрал jQuery из скрипта и добавил GM_safeHTMLParser, спасибо KOLANICH за наводку
// @history        4.5.0.1 Updated: Новая ссылка для обновления скрипта
// @history        4.5.0 Настало время ввести новую систему версий и дать грант функциям
// @history        4.4 Добавлена поддержка dfiles.ru
// @history        4.3 И сразу 4.3. Добавлено:Информация о просьбе подождать, и лимите подключений.
// @history        4.2 Добавлено: Автоопределение страны ссылки
// @history        4.1 Небольшой фикс
// @history        4.0 Surprise.
// @history        3.0 Переделан скрипт, теперь нажимает, добавлена инфа в табе о секундах, автоскачивание не работает, т.к. там каптча и, да, её нужно вводить :(
// @history        2.8 Фикс под новый вид кода и добавлена инфа о лимите.
// @history        2.7 Обновлены include
// @history        2.6 Обновил код, добавил настройки и их удаления для Firefox(greasemonkey или scriptish) и Chrome(Tempermonkey), для Оперы настройки остались в коде скрипта в начале.
// @history        2.5 Новый стиль в конце получения ссылки, сама кнопка плюс ссылка и поле с ссылкой
// @history        2.4 Добавлено определение превышения лимита скачивания. Для браузера Opera, программы userjsmanager добавлена ссылка обновления скрипта.
// @history        2.3 Добавлена опция индикации работы скрипта, когда вы думаете что скрипт не работает.
// @history        2.2 Убрано предупреждение о начале запроса, так же уменьшено время ожидания в конце, если не будет работать автоскачивание напишите мне об этом.
// @history        2.1 Исправлены некоторые переменные.
// @history        2.0 Добавлена опция автоматического скачивания после появления кнопки, добавлено описание, изменён namespace скрипта.
// @history        1.0 Релиз.
// @author         Black_Sun
// @description    Автоматически или вручную позволяет скачивать файлы без ожидания.
// @include        http://depositfiles.com/*/files/*
// @include        http://depositfiles.com/files/*
// @include        http://dfiles.ru/*/files/*
// @include        http://dfiles.ru/files/*
// @updateURL https://openuserjs.org/install/Black_Sun/depositfiles_downloader.user.js
// @Download https://openuserjs.org/install/Black_Sun/depositfiles_downloader.user.js
// @grant GM_registerMenuCommand
// @grant GM_deleteValue
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// ==/UserScript==
var uli;
if(this.opera){
	var autodownload=true; 
}
else
{
	GM_registerMenuCommand("Удалить настройку автоскачивания", function() {GM_deleteValue("auto")});
	if(GM_getValue('auto')===undefined)
	{
		if(confirm('Первичная настройка скрипта\n для сброса настройки есть пункт меню в командах скрипта\n\nВы хотите использовать автоскачивание?'))
		{
			var autodownload=true;GM_setValue('auto',true);}else{var autodownload=false;GM_setValue('auto',false);
		}
	}
	else if(GM_getValue('auto')!==undefined){var autodownload=GM_getValue('auto')}
}
document.addEventListener("DOMContentLoaded",function(){
	var gate = new FormData();
	gate.append("gateway_result", 1);
	var info=document.querySelector("table.chousetype");
	var divwait = document.createElement('div');
    divwait.innerHTML = 'Пожалуйста подождите, скачивание скоро начнётся.';
	divwait.setAttribute('style','font-size:18px;color:green');
    divwait.id = 'wait';
    info.parentNode.insertBefore(divwait, info);
	var ll=location.href.split('/')[3];
	if(ll.indexOf('files')!=-1){uli='http://dfiles.ru/'+ll+'/'+location.href.split('/')[4]}else{uli=location.href}
	var res = GM_xmlhttpRequest(
	{
		method:"POST",
		data:gate,
		url:uli,
		headers:{
			"User-Agent":"Mozilla/5.0 (Windows; U; Windows NT 5.1; ru; rv:1.8.1.20) DepositFiles/FileManager 0.9.9.206",      
			"Accept":"*/*"
		},
		onload:function(response) 
		{
			if (response.readyState == 4) 
			{
				var doc = new DOMParser().parseFromString(response.responseText, "text/html");
				var ar=doc.getElementsByClassName("repeat")[0];
				var ip=doc.getElementsByClassName("ip")[0];
				var l='';
				if (ar !== undefined) l=ar.getElementsByTagName('a')[0].getAttribute('href');
                if (ip !== undefined)
				{
					document.getElementById("wait").innerHTML = ip.innerHTML;
				}
				else
				{
					document.getElementById("wait").innerHTML = '<div style="background:lightblue;text-align:center;height:30px;"><a href="'+l+'" style="font-size: 20px;">Download</a></div>';
					if(autodownload)location.href=l;
				}
			} 
		}
	});
},false);