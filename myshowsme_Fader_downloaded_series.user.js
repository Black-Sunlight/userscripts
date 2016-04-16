// ==UserScript==
// @name        Myshows.me fader selected series
// @description На странице профиля myshows.me/profile создаёт дополнительный чекбокс, при его переключении серия становится немного прозрачной. Скрипт сделан для удобства подбора для просмотра. Так же прячет баннер.
// @namespace   https://openuserjs.org/scripts/Black_Sun/Myshows.me_fader_selected_series
// @include     http://myshows.ru/profile/
// @include     https://myshows.me/profile/
// @version     2.0.4
// @history 	2.0.3 Small fixes
// @history 	2.0 Cookie problems fixed
// @history 	1.1 Include mistake
// @unwrap
// @updateURL https://raw.githubusercontent.com/Black-Sunlight/userscripts/master/myshowsme_Fader_downloaded_series.user.js
// @downloadURL https://openuserjs.org/install/Black_Sun/Myshows.me_fader_selected_series.user.js
// @grant       none
// ==/UserScript==
$('#bannerProWide').hide()

function go(){
	var numberOfChecked = 0,a='';
	$('#countseri').remove();
	$('input[name^="serialscount"]').parent().remove();
	$('h2.fsHeader').each(function(i){
		var $that=$(this)
		var id=$(this).attr('id');
		$(this).before('<span style="background:#C0FDBD;color:#0EA206;position:relative;left:530px;top:20px;z-index:5;padding:5px"><input name="serialscount" type="checkbox" id="block'+id+'" style="vertical-align: -1px"/><label for="block'+id+'" style="padding:5px">Отмечено</label></span>')
		$("#block"+id).on('change',function(){
			if($(this).prop('checked')==true){
				setCookie('serie'+i,id,1)
				$that.attr('style','opacity:.4')
				$that.next('div.seasonBlock').attr('style','opacity:.4')
				} else {
				setCookie('serie'+i,id,0)
				$that.attr('style','opacity:1')
				$that.next('div.seasonBlock').attr('style','opacity:1')
			}
			numberOfChecked=$("input[name^='serialscount']:checkbox:checked").length
			$('#countseri').html('Всего отмечено <b style="font-size:18px">'+numberOfChecked+'</b> серий')
			
		});
		a=getCookie('serie'+i)
		if($("#block"+a).length>0){
			$("#block"+a).prop('checked', true).change();
			} else {
			setCookie('serie'+i,id,0)
		}
		
	})
	
	var numb=$("input[name^='serialscount']").length
	for (var w=0;w<=numb;w++){
		a=getCookie('serie'+w)
		a=getCookie('serie'+w+1)
		if($("#block"+a).length==0){setCookie('serie'+w,a,0)}
		if(a==b){setCookie('serie'+w,a,0);setCookie('serie'+(w+1)*1,a,0)}
	}
	$('#new-shows-empty').before('<div id="countseri" style="background:#C0FDBD;color:#0EA206;width: 165px;padding: 5px;text-align:center">Всего отмечено <b style="font-size:18px">'+numberOfChecked+'</b> серий</div>');
}
function checker(){
	var a='';
	$("input[name^='serialscount']").each(function(i){
		a=getCookie('serie'+i)
		if($('#'+a).length>0){
			return;
		}
		else
		{
			$('#block'+a).closest('span').remove();
			setCookie('serie'+i,a,0)
			go();
		}
	})
}
go();
setInterval(function(){checker()},5000)
function getCookie(b){b+="=";for(var d=document.cookie.split(";"),c=0;c<d.length;c++){for(var a=d[c];" "==a.charAt(0);)a=a.substring(1);if(0==a.indexOf(b))return a.substring(b.length,a.length)}return""}function setCookie(b,d,c){var a=new Date;a.setDate(a.getDate()+c);document.cookie=b+"="+escape(d)+(null==c?"":";expires="+a.toUTCString())};