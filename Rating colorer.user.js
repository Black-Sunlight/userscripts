// ==UserScript==
// @name         Rating colorer
// @namespace    http://tampermonkey.net/
// @version      0.6.2
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
// ==/UserScript==
GM_registerMenuCommand("Переинициализировать скрипт", function() {
	bodyscript()
});

'use strict';
/*jshint multistr: true */
function bodyscript(){
	var ratinglabel='a[data-zone-name^="rating"]',
		elemblock='article[data-zone-name^="snippet-cell"]';
	console.log('Script initialized')
	GM_addStyle('.ui-resizable {\
position: relative;\
}\
.ui-resizable-handle {\
position: absolute;\
font-size: 0.1px;\
display: block;\
-ms-touch-action: none;\
touch-action: none;\
}\
.ui-resizable-disabled .ui-resizable-handle,\
.ui-resizable-autohide .ui-resizable-handle {\
display: none;\
}\
.ui-resizable-n {\
cursor: n-resize;\
height: 7px;\
width: 100%;\
top: -5px;\
left: 0;\
}\
.ui-resizable-s {\
cursor: s-resize;\
height: 7px;\
width: 100%;\
bottom: -5px;\
left: 0;\
}\
.ui-resizable-e {\
cursor: e-resize;\
width: 7px;\
right: -5px;\
top: 0;\
height: 100%;\
}\
.ui-resizable-w {\
cursor: w-resize;\
width: 7px;\
left: -5px;\
top: 0;\
height: 100%;\
}\
.ui-resizable-se {\
cursor: se-resize;\
width: 12px;\
height: 12px;\
right: 1px;\
bottom: 1px;\
}\
.ui-resizable-sw {\
cursor: sw-resize;\
width: 9px;\
height: 9px;\
left: -5px;\
bottom: -5px;\
}\
.ui-resizable-nw {\
cursor: nw-resize;\
width: 9px;\
height: 9px;\
left: -5px;\
top: -5px;\
}\
.ui-resizable-ne {\
cursor: ne-resize;\
width: 9px;\
height: 9px;\
right: -5px;\
top: -5px;\
}\
.ui-icon {\
width: 16px;\
height: 16px;\
}\
.ui-icon,\
.ui-widget-content .ui-icon {\
background-image: url("data:image/png;base64,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");\
}\
.ui-widget-header .ui-icon {\
background-image: url("data:image/png;base64,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");\
}\
.ui-state-hover .ui-icon,\
.ui-state-focus .ui-icon,\
.ui-button:hover .ui-icon,\
.ui-button:focus .ui-icon {\
background-image: url("https://code.jquery.com/ui/1.12.1/themes/base/images/ui-icons_555555_256x240.png");\
}\
.ui-state-active .ui-icon,\
.ui-button:active .ui-icon {\
background-image: url("https://code.jquery.com/ui/1.12.1/themes/base/images/ui-icons_ffffff_256x240.png");\
}\
.ui-state-highlight .ui-icon,\
.ui-button .ui-state-highlight.ui-icon {\
background-image: url("https://code.jquery.com/ui/1.12.1/themes/base/images/ui-icons_777620_256x240.png");\
}\
.ui-state-error .ui-icon,\
.ui-state-error-text .ui-icon {\
background-image: url("https://code.jquery.com/ui/1.12.1/themes/base/images/ui-icons_cc0000_256x240.png");\
}\
.ui-button .ui-icon {background-image: url("https://code.jquery.com/ui/1.12.1/themes/base/images/ui-icons_777777_256x240.png");}\
.ui-icon-blank { background-position: 16px 16px; }\
.ui-icon-caret-1-n { background-position: 0 0; }\
.ui-icon-caret-1-ne { background-position: -16px 0; }\
.ui-icon-caret-1-e { background-position: -32px 0; }\
.ui-icon-caret-1-se { background-position: -48px 0; }\
.ui-icon-caret-1-s { background-position: -65px 0; }\
.ui-icon-caret-1-sw { background-position: -80px 0; }\
.ui-icon-caret-1-w { background-position: -96px 0; }\
.ui-icon-caret-1-nw { background-position: -112px 0; }\
.ui-icon-caret-2-n-s { background-position: -128px 0; }\
.ui-icon-caret-2-e-w { background-position: -144px 0; }\
.ui-icon-triangle-1-n { background-position: 0 -16px; }\
.ui-icon-triangle-1-ne { background-position: -16px -16px; }\
.ui-icon-triangle-1-e { background-position: -32px -16px; }\
.ui-icon-triangle-1-se { background-position: -48px -16px; }\
.ui-icon-triangle-1-s { background-position: -65px -16px; }\
.ui-icon-triangle-1-sw { background-position: -80px -16px; }\
.ui-icon-triangle-1-w { background-position: -96px -16px; }\
.ui-icon-triangle-1-nw { background-position: -112px -16px; }\
.ui-icon-triangle-2-n-s { background-position: -128px -16px; }\
.ui-icon-triangle-2-e-w { background-position: -144px -16px; }\
.ui-icon-arrow-1-n { background-position: 0 -32px; }\
.ui-icon-arrow-1-ne { background-position: -16px -32px; }\
.ui-icon-arrow-1-e { background-position: -32px -32px; }\
.ui-icon-arrow-1-se { background-position: -48px -32px; }\
.ui-icon-arrow-1-s { background-position: -65px -32px; }\
.ui-icon-arrow-1-sw { background-position: -80px -32px; }\
.ui-icon-arrow-1-w { background-position: -96px -32px; }\
.ui-icon-arrow-1-nw { background-position: -112px -32px; }\
.ui-icon-arrow-2-n-s { background-position: -128px -32px; }\
.ui-icon-arrow-2-ne-sw { background-position: -144px -32px; }\
.ui-icon-arrow-2-e-w { background-position: -160px -32px; }\
.ui-icon-arrow-2-se-nw { background-position: -176px -32px; }\
.ui-icon-arrowstop-1-n { background-position: -192px -32px; }\
.ui-icon-arrowstop-1-e { background-position: -208px -32px; }\
.ui-icon-arrowstop-1-s { background-position: -224px -32px; }\
.ui-icon-arrowstop-1-w { background-position: -240px -32px; }\
.ui-icon-arrowthick-1-n { background-position: 1px -48px; }\
.ui-icon-arrowthick-1-ne { background-position: -16px -48px; }\
.ui-icon-arrowthick-1-e { background-position: -32px -48px; }\
.ui-icon-arrowthick-1-se { background-position: -48px -48px; }\
.ui-icon-arrowthick-1-s { background-position: -64px -48px; }\
.ui-icon-arrowthick-1-sw { background-position: -80px -48px; }\
.ui-icon-arrowthick-1-w { background-position: -96px -48px; }\
.ui-icon-arrowthick-1-nw { background-position: -112px -48px; }\
.ui-icon-arrowthick-2-n-s { background-position: -128px -48px; }\
.ui-icon-arrowthick-2-ne-sw { background-position: -144px -48px; }\
.ui-icon-arrowthick-2-e-w { background-position: -160px -48px; }\
.ui-icon-arrowthick-2-se-nw { background-position: -176px -48px; }\
.ui-icon-arrowthickstop-1-n { background-position: -192px -48px; }\
.ui-icon-arrowthickstop-1-e { background-position: -208px -48px; }\
.ui-icon-arrowthickstop-1-s { background-position: -224px -48px; }\
.ui-icon-arrowthickstop-1-w { background-position: -240px -48px; }\
.ui-icon-arrowreturnthick-1-w { background-position: 0 -64px; }\
.ui-icon-arrowreturnthick-1-n { background-position: -16px -64px; }\
.ui-icon-arrowreturnthick-1-e { background-position: -32px -64px; }\
.ui-icon-arrowreturnthick-1-s { background-position: -48px -64px; }\
.ui-icon-arrowreturn-1-w { background-position: -64px -64px; }\
.ui-icon-arrowreturn-1-n { background-position: -80px -64px; }\
.ui-icon-arrowreturn-1-e { background-position: -96px -64px; }\
.ui-icon-arrowreturn-1-s { background-position: -112px -64px; }\
.ui-icon-arrowrefresh-1-w { background-position: -128px -64px; }\
.ui-icon-arrowrefresh-1-n { background-position: -144px -64px; }\
.ui-icon-arrowrefresh-1-e { background-position: -160px -64px; }\
.ui-icon-arrowrefresh-1-s { background-position: -176px -64px; }\
.ui-icon-arrow-4 { background-position: 0 -80px; }\
.ui-icon-arrow-4-diag { background-position: -16px -80px; }\
.ui-icon-extlink { background-position: -32px -80px; }\
.ui-icon-newwin { background-position: -48px -80px; }\
.ui-icon-refresh { background-position: -64px -80px; }\
.ui-icon-shuffle { background-position: -80px -80px; }\
.ui-icon-transfer-e-w { background-position: -96px -80px; }\
.ui-icon-transferthick-e-w { background-position: -112px -80px; }\
.ui-icon-folder-collapsed { background-position: 0 -96px; }\
.ui-icon-folder-open { background-position: -16px -96px; }\
.ui-icon-document { background-position: -32px -96px; }\
.ui-icon-document-b { background-position: -48px -96px; }\
.ui-icon-note { background-position: -64px -96px; }\
.ui-icon-mail-closed { background-position: -80px -96px; }\
.ui-icon-mail-open { background-position: -96px -96px; }\
.ui-icon-suitcase { background-position: -112px -96px; }\
.ui-icon-comment { background-position: -128px -96px; }\
.ui-icon-person { background-position: -144px -96px; }\
.ui-icon-print { background-position: -160px -96px; }\
.ui-icon-trash { background-position: -176px -96px; }\
.ui-icon-locked { background-position: -192px -96px; }\
.ui-icon-unlocked { background-position: -208px -96px; }\
.ui-icon-bookmark { background-position: -224px -96px; }\
.ui-icon-tag { background-position: -240px -96px; }\
.ui-icon-home { background-position: 0 -112px; }\
.ui-icon-flag { background-position: -16px -112px; }\
.ui-icon-calendar { background-position: -32px -112px; }\
.ui-icon-cart { background-position: -48px -112px; }\
.ui-icon-pencil { background-position: -64px -112px; }\
.ui-icon-clock { background-position: -80px -112px; }\
.ui-icon-disk { background-position: -96px -112px; }\
.ui-icon-calculator { background-position: -112px -112px; }\
.ui-icon-zoomin { background-position: -128px -112px; }\
.ui-icon-zoomout { background-position: -144px -112px; }\
.ui-icon-search { background-position: -160px -112px; }\
.ui-icon-wrench { background-position: -176px -112px; }\
.ui-icon-gear { background-position: -192px -112px; }\
.ui-icon-heart { background-position: -208px -112px; }\
.ui-icon-star { background-position: -224px -112px; }\
.ui-icon-link { background-position: -240px -112px; }\
.ui-icon-cancel { background-position: 0 -128px; }\
.ui-icon-plus { background-position: -16px -128px; }\
.ui-icon-plusthick { background-position: -32px -128px; }\
.ui-icon-minus { background-position: -48px -128px; }\
.ui-icon-minusthick { background-position: -64px -128px; }\
.ui-icon-close { background-position: -80px -128px; }\
.ui-icon-closethick { background-position: -96px -128px; }\
.ui-icon-key { background-position: -112px -128px; }\
.ui-icon-lightbulb { background-position: -128px -128px; }\
.ui-icon-scissors { background-position: -144px -128px; }\
.ui-icon-clipboard { background-position: -160px -128px; }\
.ui-icon-copy { background-position: -176px -128px; }\
.ui-icon-contact { background-position: -192px -128px; }\
.ui-icon-image { background-position: -208px -128px; }\
.ui-icon-video { background-position: -224px -128px; }\
.ui-icon-script { background-position: -240px -128px; }\
.ui-icon-alert { background-position: 0 -144px; }\
.ui-icon-info { background-position: -16px -144px; }\
.ui-icon-notice { background-position: -32px -144px; }\
.ui-icon-help { background-position: -48px -144px; }\
.ui-icon-check { background-position: -64px -144px; }\
.ui-icon-bullet { background-position: -80px -144px; }\
.ui-icon-radio-on { background-position: -96px -144px; }\
.ui-icon-radio-off { background-position: -112px -144px; }\
.ui-icon-pin-w { background-position: -128px -144px; }\
.ui-icon-pin-s { background-position: -144px -144px; }\
.ui-icon-play { background-position: 0 -160px; }\
.ui-icon-pause { background-position: -16px -160px; }\
.ui-icon-seek-next { background-position: -32px -160px; }\
.ui-icon-seek-prev { background-position: -48px -160px; }\
.ui-icon-seek-end { background-position: -64px -160px; }\
.ui-icon-seek-start { background-position: -80px -160px; }\
.ui-icon-seek-first { background-position: -80px -160px; }\
.ui-icon-stop { background-position: -96px -160px; }\
.ui-icon-eject { background-position: -112px -160px; }\
.ui-icon-volume-off { background-position: -128px -160px; }\
.ui-icon-volume-on { background-position: -144px -160px; }\
.ui-icon-power { background-position: 0 -176px; }\
.ui-icon-signal-diag { background-position: -16px -176px; }\
.ui-icon-signal { background-position: -32px -176px; }\
.ui-icon-battery-0 { background-position: -48px -176px; }\
.ui-icon-battery-1 { background-position: -64px -176px; }\
.ui-icon-battery-2 { background-position: -80px -176px; }\
.ui-icon-battery-3 { background-position: -96px -176px; }\
.ui-icon-circle-plus { background-position: 0 -192px; }\
.ui-icon-circle-minus { background-position: -16px -192px; }\
.ui-icon-circle-close { background-position: -32px -192px; }\
.ui-icon-circle-triangle-e { background-position: -48px -192px; }\
.ui-icon-circle-triangle-s { background-position: -64px -192px; }\
.ui-icon-circle-triangle-w { background-position: -80px -192px; }\
.ui-icon-circle-triangle-n { background-position: -96px -192px; }\
.ui-icon-circle-arrow-e { background-position: -112px -192px; }\
.ui-icon-circle-arrow-s { background-position: -128px -192px; }\
.ui-icon-circle-arrow-w { background-position: -144px -192px; }\
.ui-icon-circle-arrow-n { background-position: -160px -192px; }\
.ui-icon-circle-zoomin { background-position: -176px -192px; }\
.ui-icon-circle-zoomout { background-position: -192px -192px; }\
.ui-icon-circle-check { background-position: -208px -192px; }\
.ui-icon-circlesmall-plus { background-position: 0 -208px; }\
.ui-icon-circlesmall-minus { background-position: -16px -208px; }\
.ui-icon-circlesmall-close { background-position: -32px -208px; }\
.ui-icon-squaresmall-plus { background-position: -48px -208px; }\
.ui-icon-squaresmall-minus { background-position: -64px -208px; }\
.ui-icon-squaresmall-close { background-position: -80px -208px; }\
.ui-icon-grip-dotted-vertical { background-position: 0 -224px; }\
.ui-icon-grip-dotted-horizontal { background-position: -16px -224px; }\
.ui-icon-grip-solid-vertical { background-position: -32px -224px; }\
.ui-icon-grip-solid-horizontal { background-position: -48px -224px; }\
.ui-icon-gripsmall-diagonal-se { background-position: -64px -224px; }\
.ui-icon-grip-diagonal-se { background-position: -80px -224px; }\
#mainhide{position:fixed;display:grid;left:10px;top:300px;column-gap: 8px;row-gap: 10px;grid-template:\
[start] "header header header" 20px [row2]\
[row2] "content1 content2 content3" 20px [row3]\
[row3] "footer footer footer" 20px [row4]\
[row4] "resize resize resize" 20px [row-end] / 70px 70px auto}\
#mainhide input[type=\"checkbox\"]{display:none}\
#mainhide2 button{padding:5px 5px;margin: 7px 11px;}\
#howmuch{text-align: center;}\
#f45{margin-left:38px!important}\
')
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
		$(elemblock).find(ratinglabel).each(function(i){
			var curpo=parseFloat($(this).find('span').eq(0).text())
			var rangepo=parseFloat($('#f455').text())
			console.log(curpo+" < "+rangepo)
			if(curpo<rangepo){
				$(elemblock).eq(i).hide()
			} else if(curpo>=rangepo){
				var otzh=$("#howmuch").val();
				var otzch=$(this).find('span').eq(1).text().split(' ')
				if(parseInt(otzch[0])<otzh || otzch[0] == ''){$(elemblock).eq(i).hide()}
			}
		});
	});
	$('#f50d').on('click',function(){
		$(elemblock).find(ratinglabel).each(function(i){
			if($(this).find('span').eq(0).text()!="5.0"){
				$(elemblock).eq(i).hide()
			} else if($(this).find('span').eq(0).text()=="5.0"){
				var otzh=$("#howmuch").val();
				var otzch=$(this).find('span').eq(1).text().split(' ')
				if(parseInt(otzch[0])<otzh || otzch[0] == ''){$(elemblock).eq(i).hide()}
			}
		});
	});
	$('#f4045').on('click',function(){
		$(elemblock).find(ratinglabel).each(function(i){
			var curpo=parseFloat($(this).find('span').eq(0).text())
			if(curpo<4.0 || curpo>4.5){
				$(elemblock).eq(i).hide()
				var otz=$("#howmuch").val();
				var otzc=$(this).find('span').eq(1).text().split(' ')
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
