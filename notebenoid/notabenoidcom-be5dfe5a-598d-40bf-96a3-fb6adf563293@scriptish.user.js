// ==UserScript==
// @id             notabenoid.com-be5dfe5a-598d-40bf-96a3-fb6adf563293@scriptish
// @name           notabenoid already voted color
// @version        1.3.1
// @history        1.3.1 unwrap вместо библиотеки jQuery
// @history        1.3 Удалена автомаркировка переводов и изменена структура запроса голосов.
// @history        1.2 Заменена библиотека jQuery на родную с сайта для совместимости
// @history        1.1 Добавил notabenoid.org
// @history        1.0.2 Обновил библиотеку и создание
// @history        1.0.2 Теперь запросы выполняются по добавленной кнопке "Мои голоса"
// @history        1.0.0 Релиз
// @namespace      http://userscripts.org/scripts/show/181183
// @author         Black_Sun
// @description    Создаёт кнопку по нажатию на которую подсвечиваются строки где вы уже голосовали
// @include        http://notabenoid.com/*/*
// @include        http://notabenoid.ru/*/*
// @include        http://notabenoid.org/*/*
// @updateURL https://openuserjs.org/install/Black_Sun/notabenoid_already_voted_color.user.js
// @Download https://openuserjs.org/install/Black_Sun/notabenoid_already_voted_color.user.js
// @unwrap
// @run-at         document-end
// ==/UserScript==

$(function(){
	/*$('tr[id^="c_"]').each(function(i){
		$(this).prepend('<span>'+Math.round(i+1)+'</span>')
	});*/
	$('#tb-main>div').append('<button id="myvotes" class="btn" title="Выделить элементы где я голосовал">Мои голоса</button>')
	$('#myvotes').on('click',function(){myvotes()})
})
function myvotes(){
	var nick=$('#header-submenu').find('strong').eq(0).text()
	$('#Tr').find('div[id^="t"]').each(function(){
		var self=$(this);
		$.get(location.href+'/rating_explain?id='+self.attr('id').substring(1),function(data){
			var obj=$.parseJSON(data)
			$.each(obj,function(i){
				if(obj[i].login==nick){self.attr('style','background:rgba(0, 204, 0, 0.10)')}
			})
		})
	})
}

