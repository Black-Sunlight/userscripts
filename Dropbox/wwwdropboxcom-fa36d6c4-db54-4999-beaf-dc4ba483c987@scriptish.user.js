// ==UserScript==
// @id             www.dropbox.com-fa36d6c4-db54-4999-beaf-dc4ba483c987@scriptish
// @name           dropbox short link
// @version        1.0.1.1
// @history        1.0.1.1 Изменено: jquery библиотека, связано со взломом сайта jquery
// @history        1.0.1 Изменилась ссылка, добавил проверку на https
// @history        1.0.0 Релиз
// @namespace      http://userscripts.org/scripts/show/175092
// @author         Black_Sun
// @description    Добавляет поле с короткой ссылкой (db.tt) на страницу шары.
// @include        https://www.dropbox.com/*
// @require	// @history        4.5.0 
// @run-at         document-end
// ==/UserScript==

$(function(){
var short=$('#share-button').attr('onclick').match(/http(s)?\:\/\/db\.tt\/+[^"||']*/ig)
$('.logo').closest('div').append('<input type="text" style="cursor:normal; left: 50%; position: absolute;top: 10px;margin:0 0 0 -150px" readonly value="'+short+'" size="20" onclick="this.select()" />')
});