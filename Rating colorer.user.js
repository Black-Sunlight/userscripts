// ==UserScript==
// @name         Rating colorer
// @namespace    http://tampermonkey.net/
// @version      0.6.6
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
	  var ratinglabel='div[data-baobab-name="rating"]',
	      titlelabel='h3[data-zone-name^="title"]',
		  elemblock='article[data-auto="searchOrganic"]';
	//h3[data-zone-name^="title"]
	console.log('Script initialized')
	GM_addStyle('#mainhide{position:fixed;left:10px;top:20px} \
#mainhide2 button{padding:5px 5px;margin: 7px 11px;}\
#howmuch{text-align: center;}\
.item1{grid-area: a;}\
.item2{grid-area: b;}\
.item3{grid-area: c;}\
.item4{grid-area: d;}\
.wrapper { \
  display: grid;\
  grid-template-columns: repeat(8, 1fr);\
  gap: 10px;\
  grid-auto-rows: 20px;\
  grid-template-areas:\
    "a a a a a a a a"\
    "b b b b c c c c"\
    "d d d d d d d d";\
  align-items: start;}\
')
	//<button id="f50d">5.0</button>\
	$('header').eq(0).append('<div id="mainhide" class="wrapper">\
<input id="howmuch" class="item1" type="text" title="Выделить только то где отзывов больше чем указано тут" value=0 />\
<button id="hideothers" style="display:none" class="item4">Restore</button>\
<button id="f455" class="item2 ds-button ds-button_block ds-button_variant_text ds-button_type_primary ds-button_size_s ds-button_brand_market" style="height:20px!important;padding:0!important">Hide</button>\
<button id="rest" class="item3 ds-button ds-button_block ds-button_variant_text ds-button_type_primary ds-button_size_s ds-button_brand_market" title="Восстановить все скрытые позиции" style="height:20px!important;padding:0!important">Restore All</button>\
');
	var domaintocheck=location.origin+location.pathname+"/prices"
		console.log(domaintocheck)
	/*$('div[data-zone-name="priceSubscribe"]').before('<div id="prh" style="padding-right:5px"><a href="'+domaintocheck+'" target="_blank">Динамика цен</a></div>')
	<button id="f50">5.0</button>\
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
		//$("#howmuch").val(0)
		$(elemblock).each(function(){
			$(this).show();
		});
	});
	function scrollloader(){
	$(elemblock).each(function(){
			/*if(curpo<rangepo){
				$(elemblock).eq(i).hide()
			} else {*/
			//if($(this).next().attr('data-zone-name')=='rating' || $(this).next().text().search('и ещё ')==0){
				var otzh=$("#howmuch").val();

				var otzch=$(this).find(ratinglabel).eq(0).find('span[class*="ds-text_lineClamp"]').eq(0).text().split(' ')
				//console.log($('span[itemprop="name"]').eq(i).text()+' = '+otzch[1])
		        //console.log(parseInt(otzch[1])+' < '+otzh)
				if(parseInt(otzch[1])<otzh || otzch[1] == ''){console.log($(this).find('span[itemprop="name"]').eq(0).text()+' try to hide ');$(this).hide()}
			//} else {$(elemblock).eq(i).hide()}
			//}
		});
	}
	$('#hideothers').on('click',function(){
		window.removeEventListener("scroll",scrollloader)
	});
	$('#f455').on('click',function(){
		//window.addEventListener("scroll",scrollloader)
		scrollloader();
	});

	/*'#prload').on('click',function(){
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
	});*/


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
