// ==UserScript==
// @name         Rating colorer
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @grant        GM_addStyle
// @grant        unwrap
// @grant        GM_registerMenuCommand
// @match        *://market.yandex.ru/*
// @exclude      /^https:\/\/market\.yandex\.ru\/(my|compare).*$/
// @exclude https://market.yandex.ru/
// @require https://raw.githubusercontent.com/Black-Sunlight/lib-files/master/jquery.js
// @grant        unsafeWindow
// @grant        window.close
// ==/UserScript==
GM_registerMenuCommand("Переинициализировать скрипт", function() {
bodyscript()
});

    'use strict';
/*jshint multistr: true */
	function bodyscript(){
	var ratinglabel="span._3nFvoU2Uov",
		elemblock='article[data-autotest-id^="product-snippet"]';
	console.log('Script initialized')
	GM_addStyle('#mainhide{position:fixed;display:grid;left:10px;top:300px;column-gap: 8px;row-gap: 10px;grid-template:\
[start] "header header header" 20px [row2]\
[row2] "content1 content2 content3" 20px [row3]\
[row3] "footer footer footer" 20px [row-end] / 100px auto auto}\
#mainhide input[type=\"checkbox\"]{display:none}\
#mainhide2 button{padding:5px 5px;margin: 7px 11px;}\
#howmuch{text-align: center;}\
#f45{margin-left:38px!important}\
#f455{width:100px}')
    $('html').eq(0).append('<div id="mainhide">\
<input id="howmuch" style="grid-area: header;" type="text" title="Выделить только то где отзывов больше чем указано тут" value=0 />\
<input type="checkbox" id="hideothers" title="Отметьте этот чекбокс и вместо выделения просто буду скрыты все остальные" />\
<input id="rgc" type="range" step="0.1" min="4.0" max="4.9" value="4.5">\
<button id="f455">4.5</button>\
<button id="f50d">5.0</button>\
<button id="rest" style="grid-area: footer;" title="Восстановить все скрытые позиции">Restore</button>\
');
/*<button id="f50">5.0</button>\
<button id="clr" title="Убрать фон у всех выделенных позиций">Clear</button></div>');*/
    $("#howmuch").bind('keypress', function(e){
		var keyCode = (e.which)?e.which:event.keyCode
		return !(keyCode>31 && (keyCode<48 || keyCode>57));
	});
   /* $('#clr').on('click',function(){
        $('div[data-autotest-id^="product-snippet"]').each(function(){
            $(this).css({background:'none'});
        });
    });*/
	$('#rgc').on('change mousemove',function(){
        $('#f455').text($('#rgc').val())
    });

    $('#rest').on('click',function(){
        $(elemblock).each(function(){
            $(this).show();
        });
    });
	$('#f455').on('click',function(){
        $('div[data-zone-name^="snippetList"]').find(ratinglabel).each(function(i){
			var curpo=parseFloat($(this).text())
			var rangepo=parseFloat($('#f455').text())
                if(curpo<rangepo){
                     $(elemblock).eq(i).hide()
                } else if(curpo>=rangepo){
                    var otzh=$("#howmuch").val();
                    var otzch=$(ratinglabel).eq(i).closest('a').find('span').eq(0).text().split(' ')
                    if(parseInt(otzch[0])<otzh || otzch[0] == ''){$(elemblock).eq(i).hide()}
                }
        });
    });
    $('#f50d').on('click',function(){
        $('div[data-zone-name^="snippetList"]').find(ratinglabel).each(function(i){
                if($(this).text()!="5.0"){
                    $(elemblock).eq(i).hide()
                } else if($(this).text()=="5.0"){
                    var otzh=$("#howmuch").val();
                    var otzch=$(ratinglabel).eq(i).closest('a').find('span').eq(0).text().split(' ')
                    if(parseInt(otzch[0])<otzh || otzch[0] == ''){$(elemblock).eq(i).hide()}
                }
        });
    });
    $('#f4045').on('click',function(){
       $('div[data-zone-name^="snippetList"]').find(ratinglabel).each(function(i){
			var curpo=parseFloat($(this).text())
                if(curpo<4.0 || curpo>4.5){
					 $(elemblock).eq(i).hide()
					var otz=$("#howmuch").val();
                    var otzc=$(ratinglabel).eq(i).closest('a').find('span').eq(0).text().split(' ')
                    if(parseInt(otzc[0])<otz || otzc[0] == ''){$(elemblock).eq(i).hide()}
                    //$(this).closest('div[data-autotest-id^="product-snippet"]').css({background:'#deffe2'})
                }
        });
    });
	}
	bodyscript()
/*     $('#f50').on('click',function(){
        $('div.layout').find(ratinglabel).each(function(i){
                if($(this).text()=="5.0"){
                    //$(this).closest('div[data-autotest-id^="product-snippet"]').css({background:'#deffe2'})
                    var otz=$("#howmuch").val();
                    var otzc=$(ratinglabel).eq(i).closest('a').find('span').eq(0).text().split(' ')
                    if(parseInt(otzc[0])>=otz){
                        $('div[data-autotest-id^="product-snippet"]').eq(i).css({background:'#dee5ffb0'})
                    }
                }
        });
    }); */
