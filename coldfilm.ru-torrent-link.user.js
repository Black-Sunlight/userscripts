// ==UserScript==
// @id             coldfilm.ru-6c434ad0-254a-410f-8d3c-c5172404085f@scriptish
// @name           auto-torrent-link
// @version        2.9.1 
// @history        2.9.1 Добавелен домен .info 
// @history        2.9 Фикс только ссылок на торрент файл под новый дизайн coldfilm и небольшой фикс дизайна
// @history        2.8.2 Удаление рекламы добавлено и на другие страницы
// @history        2.8.1 Добавлена удаление websocket не блокируемой рекламы.
// @history        2.8.0 Добавлена поддержка скриптом kinogolos.ru
// @history        2.7.0 Если скрыть много новостей появляется ошибка 400 Request Header Or Cookie Too Large, при появлянии этой ошибки теперь удаляются все куки кроме первой страницы
// @history        2.6.4 RegExp fix
// @history        2.6.3 Описание
// @history        2.6.1 Обновил downloadurl и updateurl и добавил удаление постов содержащих тот назойливый пост на каждой новости
// @history        2.6.0 Теперь куки независимы для каждой страницы, т.е. вы можете скрывать новости на каждой странице и список скрытых будет свой на каждой странице
// @history        2.5.0 Замена структуры кода, теперь по идее должна работать всегда
// @history        2.4 Обновил режим скрипта, теперь он работает даже тогда когда включена защита от слежения и не зависит от скриптов на странице
// @history        2.3 Добавил поле для выбора на сколько скрывать новости c подписью под крестом
// @history        2.2.0 Добавлена кнопка Х справа от названия "Скрытые релизы" при нажатию по которой ВСЕ новости из списка ниже названия возвращаются на место, а список очищается.
// @history        2.1 Принудительно применён стиль https://userstyles.org/styles/120526/cold-film-style-for-my-script
// @history        2.0 Изменено расположение обновляшки, немного изменён стиль, добавлена возможность удалять блоки новостей с сайта до рестарта браузера, удалённые сериалы находятся слева в блоке и их можно оттуда вернуть кликнув по названию.
// @history        1.5 Добавил вывод серий списком, когда в новости несколько серий. Плюс создал стиль для немного другого вида новостей, он тут https://userstyles.org/styles/120526/cold-film-style-for-my-script
// @history        1.4 Из-за возросшей нагрузки на сайт переделал скрипт, теперь надо нажать кнопку рядом с названием для просмотра информации о нужном сериале, кнопку можно нажимать сколько угодно раз в ожидании серии.
// @history        1.3.1 Небольшие правки в тексте. 
// @history        1.3 Добавил проверку на внутренние ссылки на статичные страницы
// @history        1.2.1 Добавил ссылки на автообновление, на всякий случай.
// @history        1.2 Исправил перекрытие скриптов сайта и моим, т.о. вернул полную работоспособность сайта + мой скрипт.
// @history        1.1 Добавил mchat в исключения
// @history        1.0 Релиз.
// @namespace      https://openuserjs.org/scripts/Black_Sun/auto-torrent-link
// @author         Black_Sun
// @license        MIT
// @description Скрипт для coldfilm.ru выводит на главную страницу кнопки, при нажатии на кнопку, под сериалом выводятся ссылки на торрент для скачивания, также позволяет скрывыть новости по желанию на каждой странице с запоминанием скрытия которое настраивается в блоке слева страницы. Код не зашифрован, для знающих всё наглядно и понятно.
// @include        http://coldfilm.ru/*
// @include        http://coldfilm.ru/news/*/*
// @include        http://coldfilm.info/*
// @include        http://coldfilm.info/news/*/*
// @include        http://kinogolos.ru/*
// @include        http://kinogolos.ru/news/*/*
// @exclude        http://kinogolos.ru/mchat
// @exclude        http://kinogolos.ru/mchat/*
// @exclude        http://coldfilm.ru/mchat
// @exclude        http://coldfilm.ru/mchat/*
// @updateURL https://openuserjs.org/meta/Black_Sun/auto-torrent-link.meta.js
// @downloadURL https://openuserjs.org/install/Black_Sun/auto-torrent-link.user.js
// @noframes
// @grant none
// @require http://s76.ucoz.net/src/jquery-1.7.2.js
// @run-at         document-start
// @copyright 2018, Black_Sun (https://openuserjs.org/users/Black_Sun)
// ==/UserScript==

var concrete = {
	poke:function(){
		$('#hided').find('li').on('click',function(){
			$('div#'+$(this).data("id")).show();
			setCookie('del'+$(this).data("i"),1,0)
			$('li[data-id="'+$(this).attr("data-id")+'"]').prev().remove();
			$('li[data-id="'+$(this).attr("data-id")+'"]').remove();
		});
	},
	reclamremove:function(){
		antufuckingreclam=setInterval(function(){
			if($('body').find('a[class^="traforet"]').length>0){
				$('body').find('a[class^="traforet"]').closest('div').remove();
				clearInterval(antufuckingreclam);
			}
		},500)
		setTimeout(function(){
			clearInterval(antufuckingreclam);
		},10000)
	},
	pour:function(site){
		if(!site){var site = 'side_left'}
		var tester=$('body').find('center').eq(1).text();
		if(tester.search(/Request Header Or Cookie Too Large/ig)!=-1){
			$('body').find('h1').eq(0).append('<br />Вы скрыли слишком много новостей, идёт удаление cookie всех, кроме первой страницы, пожалуйста подождите<br />');
			deleteAllCookies();
		}


		var curp=$('div.catPages1').eq(0).find('b.swchItemA').eq(0).text();
		if ($('#'+site).length) {
			if(site=='side_left'){
				$('#'+site).find('.blacknav').eq(0).after('<hr><style>#hided{height: 350px;overflow-y: auto;width: 190px;}.hideli{padding:5px;}.hideli:hover{color:#090;background-color:white;padding:5px;cursor:pointer}.hidename{font-weight:bold;font-size:13px;text-align:center;background-position: -215px bottom!important;color:#0a6e0b;background-size: auto 92%;height: 37px;width: 190px;padding-top:5px;padding-bottom:0px}</style><div class="block_full b_black hidename">Скрытые релизы<span title="Вернуть все новости из списка ниже на место" id="reall" style="float:right;font-size:16px;margin-right:5px;cursor:pointer">X</span></div><div style="width:190px"><select style="width:inherit" title="На сколько скрывать новости с главной странице" id="time"><option value="null" selected>До перезапуска браузера</option><option value="2">2 дня</option><option value="4">4 дня</option><option value="6">6 дней</option><option value="8">8 дней</option><option value="10">10 дней</option></select></div><ul id="hided"></ul>')
			} else {
				$('#'+site).find('.sidebar').eq(0).after('<hr><style>#hided{height: 350px;overflow-y: auto;width: 190px;}.hideli{padding:5px;}.hideli:hover{color:#090;background-color:white;padding:5px;cursor:pointer}.hidename{font-weight:bold;font-size:13px;text-align:center;background-position: -215px bottom!important;color:#0a6e0b;background-size: auto 92%;height: 37px;width: 190px;padding-top:5px;padding-bottom:0px}</style><div class="block_full b_black hidename">Скрытые релизы<span title="Вернуть все новости из списка ниже на место" id="reall" style="float:right;font-size:16px;margin-right:5px;cursor:pointer">X</span></div><div style="width:190px"><select style="width:inherit" title="На сколько скрывать новости с главной странице" id="time"><option value="null" selected>До перезапуска браузера</option><option value="2">2 дня</option><option value="4">4 дня</option><option value="6">6 дней</option><option value="8">8 дней</option><option value="10">10 дней</option></select></div><ul id="hided"></ul>')
			}
			$('#reall').on('click',function(){
				$('#hided').find('li').each(function(){
					$('div#'+$(this).data("id")).show();
					setCookie('del'+$(this).data("i"),1,0)
					$('li[data-id="'+$(this).attr("data-id")+'"]').prev().remove();
					$('li[data-id="'+$(this).attr("data-id")+'"]').remove();
				})
			});
		}
		$('#allEntries').before($('#pagesBlock1').clone())

		if(site=='side_left'){var newses='kino-h'}else{var newses='eTitle'}

		$('.'+newses).each(function(i){
			if($(this).text()=="Просьба снять AdBlock"){$(this).closest("div[id^='entryID']").hide()}
			if(getCookie('del'+curp+'-'+i)){
				var gsid=getCookie('del'+curp+'-'+i).split('_')[0]
				var gname=unescape(getCookie('del'+curp+'-'+i).split('_')[1])
				$('#'+gsid).hide()
				$('#hided').append('<div class="hr_v3" style="margin: 2px 0;"></div><li data-id="'+gsid+'" data-i="'+curp+'-'+i+'" class="hideli" title="Нажмите чтобы показать блок на сайте">'+gname+'</li>')

			}
			if(site=='side_left'){
				$('.kino-lines').eq(i).after("<style>#lnks"+i+" a{display:block;color:green;}#lnks"+i+"{max-height: 385px;overflow-y: auto;width: 365px;}#lnks"+i+" a:hover{display:block;color:#67e267!important;} div[id^='lnks'] br{display:none;}.viewn_title{height:20px!important}div[id^='entryID']{position:relative}a.entryLink{position:absolute;top:70px;font-size:20px;font-style:Tahoma;width:570px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}span[id^='spanload']{position:absolute;top:100px;right:100px;}span[id^='spanload'] img{width:30px}div[id^='lnks']{position:absolute;top:130px;right:0px;}.center{max-width:1500px!important}</style><div id='lnks"+i+"' style='display:block;margin:0 auto;text-align:center;color:darkred;font-size:20px'></div>")
				$('#lnks'+i).after('<span id="spanload'+i+'" title="Нажмите чтобы проверить можно ли скачать серию или нет" style="color:darkred"> <img id="imgload'+i+'" style="cursor:pointer" src="'+lookimg+'" /></span>')
				/*$('#spanload'+i).after('<figure style="position: absolute;right: 45px;width: 153px;top: 200px;cursor:pointer;text-align:center"><p><img src='+redcrossimage+' title="Удалить сериал из списка на странице" id="reddel'+i+'" /></p><figcaption class="reddelinfo"></figcaption></figure>')*/
			} else {
				if($('body').find('div').eq(0).attr('id')!='page'){$('body').find('div').eq(0).hide()}
				var curwidth=Math.round((document.documentElement.clientWidth)-(document.documentElement.clientWidth/100*20))
				var widthcol=Math.round(curwidth-300)
				$('.eMessage').eq(i).append("<style>body{padding-top:0!important}#wrapper{width:"+curwidth+"px!important}#lnks"+i+" a{display:block;color:green;}#lnks"+i+" a:hover{display:block;color:#67e267!important;}#lnks"+i+"{max-height: 385px;overflow-y: auto;width: 365px;}div[id^='lnks'] br{display:none;}#content{width:"+widthcol+"px!important}.eBlock{width:100%!important}.viewn_title{height:20px!important}div[id^='entryID']{position:relative}a.entryLink{position:absolute;top:70px;font-size:20px;font-style:Tahoma;width:570px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}span[id^='spanload']{position:absolute;top:100px;left:100px;}span[id^='spanload'] img{width:30px}div[id^='lnks']{position:absolute;top:130px;left:70px;}</style><div id='lnks"+i+"' style='display:block;margin:0 auto;text-align:center;color:darkred;font-size:20px'></div>")
				$('#lnks'+i).closest('div.eMessage').prepend('<span id="spanload'+i+'" title="Нажмите чтобы проверить можно ли скачать серию или нет" style="color:darkred"> <img id="imgload'+i+'" style="cursor:pointer" src="'+lookimg+'" /></span>')
				$('#spanload'+i).after('<figure style="position: absolute;right: 45px;width: 153px;top: 200px;cursor:pointer;text-align:center"><p><img src='+redcrossimage+' title="Удалить сериал из списка на странице" id="reddel'+i+'" /></p><figcaption class="reddelinfo"></figcaption></figure>')
			}

			var self=$(this)

			$('#reddel'+i).on('click',function(){
				var sid=$(this).closest('div[id^="entryID"]').attr('id')
				if(site=='side_left'){var name=$(this).closest('div[id^="entryID"]').find('a.entryLink').eq(0).text()}
				else{var name=$(this).closest('div[id^="entryID"]').find('div.eTitle').eq(0).text()}
				setCookie('del'+curp+'-'+i,sid+'_'+name,$('#time').val()*1)
				$(this).attr('src',loadingimg)
				$(this).closest('div[id^="entryID"]').hide()
				$(this).attr('src',redcrossimage)
				$('#hided').append('<div class="hr_v3" style="margin: 2px 0;"></div><li data-id="'+sid+'" data-i="'+i+'" class="hideli" title="Нажмите чтобы показать блок на сайте">'+name+'</li>')
				concrete.poke()
			})

			$('#imgload'+i).click(function(){
				if(site=='side_left'){ getter()}else{getter2()}
			})
			function getter(){
				$('#imgload'+i).unbind('click')
				$('#imgload'+i).attr('src',loadingimg)
				$('#lnks'+i).text('Идёт загрузка, пожалуйста подождите...')
				$.get(self.attr('href'),function(data){
					var ah=$('.player-box',data).find('a');
					if(ah.attr('href')!="undefined"){
						var ahtxt=ah.closest('span')
						$('#spanload'+i).attr('style','color:green')
							.parent().parent().find('a').attr('style','color:darkred')
						$('#imgload'+i).attr('src',lookimg).click(function(){getter()});
						$('#lnks'+i).html(ahtxt);
					}
					if(ah.attr('href')===undefined || ah.attr('href').indexOf("coldfilm.ru/index")!=-1){
						/*$('#lnks'+i).closest('div[id^="entryID"]').remove()*/
						//$('#lnks'+i).closest('div.viewn_c').hide()
						$('#spanload'+i).attr('style','color:darkred').parent().parent().find('a').attr('style','color:darkred')
						$('#imgload'+i).click(function(){getter()});
						$('#lnks'+i).text('Серия ещё не выложена')

					}
				})
			}

			function getter2(){
				$('#imgload'+i).unbind('click')
				$('#imgload'+i).attr('src',loadingimg)
				$('#lnks'+i).text('Идёт загрузка, пожалуйста подождите...')
				$.get(self.find('a').eq(0).attr('href'),function(data){
					var ah=$('.eMessage',data).find('a');
					if(ah.attr('href')!="undefined"){
						var ahtxt=ah.closest('span')
						$('#spanload'+i).attr('style','color:green').text(' Серия выложена')
							.append('<img id="imgload'+i+'" style="cursor:pointer" src="'+lookimg+'" />').parent().parent().find('a').attr('style','color:darkred')
						$('#imgload'+i).click(function(){getter2()});
						$('#lnks'+i).html(ahtxt);
					}
					if(ah.attr('href')===undefined || ah.attr('href').indexOf("kinogolos.ru/index")!=-1){
						/*$('#lnks'+i).closest('div[id^="entryID"]').remove()*/
						//$('#lnks'+i).closest('div.viewn_c').hide()
						$('#spanload'+i).attr('style','color:darkred').text(' Серия ещё не выложена ').append('<img id="imgload'+i+'" style="cursor:pointer" src="'+lookimg+'" />').parent().parent().find('a').attr('style','color:darkred')
						$('#imgload'+i).click(function(){getter2()});
						$('#lnks'+i).text('Серия ещё не выложена')

					}
				})
			}
		})
		if(getCookie('sel')){
			$('#time').val(getCookie('sel'))
			if(getCookie('sel')!="null"){$('.reddelinfo').html('Скрыть эту новость на <i>'+$('#time option:selected').text()+'</i>')}
			else {$('.reddelinfo').html('Скрыть эту новость <i>'+$('#time option:selected').text()+'</i>')}
		}
		$('#time').on('change',function(){
			setCookie('sel',$(this).val(),999)
			if($(this).val()!="null"){$('.reddelinfo').html('Скрыть эту новость на <i>'+$('#time option:selected').text()+'</i>')}
			else {$('.reddelinfo').html('Скрыть эту новость <i>'+$('#time option:selected').text()+'</i>')}
		})
		concrete.poke()
		//clearInterval(checkExist);
		//}
	}
}
$(function(){
			$('#owl-carou').find('a.carou-inner').each(function(i){
			var thistitle=$(this).find('i').eq(0).attr('title');
			$(this).removeAttr('href').before('<span id="title'+i+'" style="display:none;position: absolute; left: 0px; top: 30%; background: rgba(0, 0, 0, 0.6); color: white; white-space: nowrap; text-overflow: ellipsis; width: 100%; overflow: hidden; text-align: center;font-size:24px">[Не переведено!]</span><span style="display:block;position:absolute;left:0;top:0;background:rgba(0, 0, 0, 0.6);color:white;white-space: nowrap;text-overflow: ellipsis;width: 100%;overflow: hidden;text-align:center">'+thistitle.replace(" [Смотреть Онлайн]","")+'</span>');
			$(this).click(function(){
				var $this = $(this);
				$this.prev().fadeOut(600);
				$.get($(this).attr('data-link'),function(data){
				$this.prev().fadeIn(600);
				var ah=$('.player-box',data).find('a').eq(0);
				if(ah.attr('href')!=undefined){
					$('#title'+i).hide();
					location.href=ah.attr('href');
				} else {
					$('#title'+i).show();
				}
				/*if(ah.attr('href')===undefined || ah.attr('href').indexOf("coldfilm.ru/index")!=-1){
							$('#spanload'+i).attr('style','color:darkred').parent().parent().find('a').attr('style','color:darkred')
							$('#imgload'+i).click(function(){getter()});
							$('#lnks'+i).text('Серия ещё не выложена')
						}*/
				});
			});
		});
	if(location.href.search(/http\:\/\/coldfilm\.ru\/news\/[a-z0-9]{1,}\/*./ig)==-1){
		concrete.pour();
		concrete.reclamremove();
	}
	if (location.href.search(/http\:\/\/kinogolos\.ru\/news\/[a-z0-9]{1,}\/*./ig)==-1){
		concrete.pour('rightcol');
		concrete.reclamremove();
	}else{
		concrete.reclamremove();
		$('.cMessage').each(function(i){
			if($(this).text().search(/cold\.filmovnik\.ru/ig)!=-1){
				$(this).closest('div[id^="comEnt"]').remove()
			}
		})
	}
});


function deleteAllCookies() {
	var cookies = document.cookie.split(";");

	for (var i = 0; i < cookies.length; i++) {
		if(cookies[i].search(/del[0-9]{1,}\-[0-9]{1,2}/ig)!=-1){
			if(cookies[i].search(/del1\-[0-9]{1,2}/ig)==-1){
				var cookie = cookies[i]
				var eqPos = cookie.indexOf("=");
				var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
				document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
			}
		}
	}
	location.reload();
}
function getCookie(b){b+="=";for(var d=document.cookie.split(";"),c=0;c<d.length;c++){for(var a=d[c];" "==a.charAt(0);)a=a.substring(1);if(0==a.indexOf(b))return a.substring(b.length,a.length)}return""}function setCookie(b,d,c){var a=new Date;a.setDate(a.getDate()+c);document.cookie=b+"="+escape(d)+(null==c?"":";expires="+a.toUTCString())};
var lookimg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAsJJREFUeNqMk8tPE1EUxu+dmU6n04dDKVAaQBowBYq0RDAQGkOC0QRjoujCx14TV8Z/gLB0Z8CNunGJJhJdGd8pkKALSdVoIIISiOE1JWPbofO6cz2jYKR1wUm+nJm53/nlnjvnYkopcmJkZEKCdB10BpRAf+ID6DHo1vDwkIL+E9gBQHHSMQYqA1VH+9rUrvZwFYMxmv2yJk+9+uhRc6rsgAGSKQWwGHdIAEm39bZJxwcS3vqw3yu6GcyxGAUl0ROLH+Tymo3ktexQOj13v7+/VfsXwJimdsMX8oWi0TqfQahtWNQqGralgXSTmvButiebAi6BCzne0h0wur59vqalUdFMuq2bdhYK5YJG5FyRyADaBMCGSehGJNa47nhLARwhRmsR+3Nyzlx0u7DOscTEmGVZBiGLUKKZtqVqNkuFQMTxlgEMYxvxbqysyHqGYVDeK3gE6F90sZiFdcMmNLe6ZWxvbqmd4G0qAxQKyiKmP4nbJa0GRK4AB4i8AsvzHGZMixKT2Hq15EKzk59Nx1t2Boqy/vrTi5d1VUHGV1vB03AF7zkgsrUenmkOiGykRuLFoMd2Z5fnjjneMkAmM3V7ZX4+J8tfLzCsVQmFHvheD3L6rbd0vWJ8Yuxa12lZTFx+23f1Lk7uGSSnjXi8+2IslrgZaYr6U6dOLCSboiyPsHdy5v369Jt0ezH4UGg8rLnODp5DT54/UNezq6k7V2jm7yRijH2hULgnmUxd8vulXvgHLc4iIWQun1dmvjOPBlq7aUNHp4AGTzagp8+W1c2s9huCd+8CQDhIdaAQyLezwwJIrj2CUmI1utccR0JHN0Y9KRa9myaqotAUt9sLgCxISzvae2EwlmsSSFhAaEw3qADDhiKHRG/R0KY5tI8AeAEg487zCkAMzRZ+rGrIz9Nv+wKUQmDERtUcWfJxaPSXAAMAqY5Ou20jwNAAAAAASUVORK5CYII%3D"

var loadingimg="data:image/gif;base64,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%3D%3D"

var redcrossimage=" data:image/png;base64,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"
