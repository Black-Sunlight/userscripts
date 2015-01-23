// ==UserScript==
// @id             notabenoid.com-7943d1fc-12d5-42bc-b29e-338c8761e712@scriptish
// @name           notabenoid auto highlight your translations page
// @version        1.1
// @history        1.1 Добавил notabenoid.org
// @history        1.0.1 Область действия ещё одна.
// @history        1.0.0 Релиз
// @namespace      http://userscripts.org/scripts/show/403294
// @author         Black_Sun
// @description    Показывает зелёным цветом положительно оцененные переводы, красным - отрицательно на странице перевода пользователя для конкретного перевода.
// @updateURL https://openuserjs.org/install/Black_Sun/auto_highlight_notabenoid_your_translations_page.user.js
// @Download https://openuserjs.org/install/Black_Sun/auto_highlight_notabenoid_your_translations_page.user.js
// @include        http://notabenoid.com/users/*/translations?*
// @include        http://notabenoid.com/users/*/translations/*
// @include        http://notabenoid.org/users/*/translations?*
// @include        http://notabenoid.org/users/*/translations/*
// @require	   http://raw.github.com/Black-Sunlight/lib-files/master/jquery.js
// @run-at         document-end
// ==/UserScript==

$(function(){
var count=0;
$('.container').find('h2').append('<span id="count" style="color:black;font-size:18px;display:none" title="Количество голосов на этой странице">0</span>')
$('i.rate').each(function(i){
var self=$(this)
var rate=parseInt($('i.rate').eq(i).text())
if(rate>0){
self.closest('div.verse').css({background:'#C4FFC4',color:'#007900'})
count+=1;
}
if(rate<0){
self.closest('div.verse').css({background:'#FFB0B0',color:'#B00000'})
count+=1;
}
});
$('#count').text(count).show()
});