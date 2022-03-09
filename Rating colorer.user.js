// ==UserScript==
// @name         Rating colorer
// @namespace    http://tampermonkey.net/
// @version      0.6.3
// @description  try to take over the world!
// @author       You
// @grant        GM_addStyle
// @grant        unwrap
// @grant        GM_registerMenuCommand
// @match        *://market.yandex.ru/*
// @exclude      /^https:\/\/market\.yandex\.ru\/(my|compare).*$/
// @exclude https://market.yandex.ru/
// @require https://raw.githubusercontent.com/Black-Sunlight/lib-files/master/jquery.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @downloadURL https://github.com/Black-Sunlight/userscripts/raw/master/Rating%20colorer.user.js
// @updateURL https://github.com/Black-Sunlight/userscripts/raw/master/Rating%20colorer.user.js
// @grant        unsafeWindow
// @grant        window.close
// @grant        GM.xmlHttpRequest
// ==/UserScript==
GM_registerMenuCommand("Переинициализировать скрипт", function() {
	bodyscript()
});

'use strict';
/*jshint multistr: true */
function bodyscript(){
	  var ratinglabel='a[data-zone-name^="rating"]',
	      titlelabel='h3[data-zone-name^="title"]',
		  elemblock='article[data-zone-name^="snippet-"]';
	//h3[data-zone-name^="title"]
	console.log('Script initialized')
	GM_addStyle('#mainhide{position:fixed;display:grid;left:10px;top:300px;column-gap: 8px;row-gap: 10px;grid-template:\
[start] "header header header" 20px [row2]\
[row2] "content content content" 20px [row3]\
[row3] "footer footer footer" 20px [row4]\
[row4] "resize resize resize" 20px [row-end] / 70px 70px auto}\
#mainhide input[type=\"checkbox\"]{display:none}\
#mainhide2 button{padding:5px 5px;margin: 7px 11px;}\
#howmuch{text-align: center;}\
#f45{margin-left:38px!important}\
')
	//<button id="f50d">5.0</button>\
	$('html').eq(0).append('<div id="mainhide">\
<input id="howmuch" style="grid-area: header;" type="text" title="Выделить только то где отзывов больше чем указано тут" value=0 />\
<input type="checkbox" id="hideothers" title="Отметьте этот чекбокс и вместо выделения просто буду скрыты все остальные" />\
<button id="f455" style="grid-area: content;">Скрыть</button>\
<button id="rest" style="grid-area: footer;" title="Восстановить все скрытые позиции">Restore</button>\
');
	$('div[data-apiary-widget-name="@MarketNode/RecommendedOffers"]').append('<div id="pricehist"><button id="prload">Динамика цен</button></div>')
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
		$(elemblock).find(titlelabel).each(function(i){
			/*if(curpo<rangepo){
				$(elemblock).eq(i).hide()
			} else {*/
			console.log($(this).next().text().search('и ещё '))
			if($(this).next().attr('data-zone-name')=='rating' || $(this).next().text().search('и ещё ')==0){
				var otzh=$("#howmuch").val();
				var otzch=$(ratinglabel).eq(i).find('span').eq(1).text().split(' ')
				console.log(otzch[0])
				if(parseInt(otzch[0])<otzh || otzch[0] == ''){$(elemblock).eq(i).hide()}
			} else {$(elemblock).eq(i).hide()}
			//}
		});
	});
	$('#prload').on('click',function(){
		var domaintocheck=location.origin+location.pathname+"/prices"
		console.log(domaintocheck)
		GM.xmlHttpRequest({
								method: "GET",
								url: domaintocheck,
								headers: {
									"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
									"Accept": "text/html"            // If not specified, browser defaults will be used.
								},
								onload: function(response) {
									var doc = new DOMParser().parseFromString(response.responseText, "text/html");
									$('#pricehist').html("<a href='"+domaintocheck+"' target=_blank>Открыть страницу динамики цен</a><br/>"+doc.getElementsByClassName('tamef')[0].innerHTML);
								}
		})
	});
	/*$('#f50d').on('click',function(){
		$(elemblock).find(ratinglabel).each(function(i){
			if($(this).next().find('span').eq(0).text()!="5.0"){
				$(elemblock).eq(i).hide()
			} else if($(this).find('span').eq(0).text()=="5.0"){
				var otzh=$("#howmuch").val();
				var otzch=$(this).next().find('span').eq(1).text().split(' ')
				if(parseInt(otzch[0])<otzh || otzch[0] == ''){$(elemblock).eq(i).hide()}
			}
		});
	});
	$('#f4045').on('click',function(){
		$(elemblock).find(ratinglabel).each(function(i){
			var curpo=parseFloat($(this).next().find('span').eq(0).text())
			if(curpo<4.0 || curpo>4.5){
				$(elemblock).eq(i).hide()
				var otz=$("#howmuch").val();
				var otzc=$(this).next().find('span').eq(1).text().split(' ')
				if(parseInt(otzc[0])<otz || otzc[0] == ''){$(elemblock).eq(i).hide()}
				//$(this).closest('div[data-autotest-id^="product-snippet"]').css({background:'#deffe2'})
			}
		});
	});
	$( "#mainhide" ).resizable({
		maxHeight: 110,
		maxWidth: 250,
		minHeight: 110,
		minWidth: 210
	});*/
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
