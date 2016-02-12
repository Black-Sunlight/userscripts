// ==UserScript==
// @name        Myshows.me fader selected series
// @description На странице профиля myshows.me/profile создаёт дополнительный чекбокс, при его переключении серия становится немного прозрачной. Скрипт сделан для удобства подбора для просмотра. Так же прячет баннер.
// @namespace   https://openuserjs.org/scripts/Black_Sun/Myshows.me_fader_selected_series
// @include     https://myshows.me/profile
// @include     http://myshows.me/profile
// @version     1.0
// @unwrap
// @updateURL https://openuserjs.org/install/Black_Sun/Myshows.me_fader_selected_series.user.js
// @Download https://openuserjs.org/install/Black_Sun/Myshows.me_fader_selected_series.user.js
// @grant       none
// ==/UserScript==
$('#bannerProWide').hide()

var numberOfChecked = 0,a='';
$('h2.fsHeader').each(function(i){
    var $that=$(this)
	$(this).before('<span style="background:#C0FDBD;color:#0EA206;position:relative;left:530px;top:20px;z-index:5;padding:5px"><input name="serialscount" type="checkbox" id="d'+i+'" style="vertical-align: -1px"/><label for="d'+i+'" style="padding:5px">Отмечено</label></span>')
	$("#d"+i).on('change',function(){
		if($(this).prop('checked')==true){
		    setCookie('serie'+i,i,null)
			$that.attr('style','opacity:.4')
			$that.next('div.seasonBlock').attr('style','opacity:.4')
			} else {
			setCookie('serie'+i,i,0)
			$that.attr('style','opacity:1')
			$that.next('div.seasonBlock').attr('style','opacity:1')
		}
		numberOfChecked=$("input[name^='serialscount']:checkbox:checked").length
		$('#countseri').html('Всего отмечено <b style="font-size:18px">'+numberOfChecked+'</b> серий')
		
	});
	a=getCookie('serie'+i)
	if($("#d"+a).length>0){
	   $("#d"+a).prop('checked', true).change();
		} else {
		setCookie('serie'+a,a,0)
		}
	
})
for (var w=0;w<=10;w++){
	a=getCookie('serie'+w)
	if($("#d"+a).length==0){setCookie('serie'+a,a,0)}
	}
$('#new-shows-empty').before('<div id="countseri" style="background:#C0FDBD;color:#0EA206;width: 165px;padding: 5px;text-align:center">Всего отмечено <b style="font-size:18px">'+numberOfChecked+'</b> серий</div>');

function getCookie(b){b+="=";for(var d=document.cookie.split(";"),c=0;c<d.length;c++){for(var a=d[c];" "==a.charAt(0);)a=a.substring(1);if(0==a.indexOf(b))return a.substring(b.length,a.length)}return""}function setCookie(b,d,c){var a=new Date;a.setDate(a.getDate()+c);document.cookie=b+"="+escape(d)+(null==c?"":";expires="+a.toUTCString())};