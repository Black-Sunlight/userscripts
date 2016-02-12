// ==UserScript==
// @name        Fader downloaded series
// @namespace   Workspace
// @include     https://myshows.me/profile/
// @version     1
// @unwrap
// @updateURL 
// @Download 
// @grant       none
// ==/UserScript==
$('#bannerProWide').hide()

var numberOfChecked = 0,a='';
$('h2.fsHeader').each(function(i){
    var $that=$(this)
	$(this).before('<span style="background:#C0FDBD;color:#0EA206;position:relative;left:530px;top:20px;z-index:5;padding:5px"><input name="serialscount" type="checkbox" id="d'+i+'" style="vertical-align: -1px"/><label for="d'+i+'" style="padding:5px">Серия есть</label></span>')
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
		$('#countseri').html('Всего есть <b style="font-size:18px">'+numberOfChecked+'</b> сериалов')
		
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
$('#new-shows-empty').before('<div id="countseri" style="background:#C0FDBD;color:#0EA206;width: 165px;padding: 5px;text-align:center">Всего есть <b style="font-size:18px">'+numberOfChecked+'</b> сериалов</div>');

function getCookie(b){b+="=";for(var d=document.cookie.split(";"),c=0;c<d.length;c++){for(var a=d[c];" "==a.charAt(0);)a=a.substring(1);if(0==a.indexOf(b))return a.substring(b.length,a.length)}return""}function setCookie(b,d,c){var a=new Date;a.setDate(a.getDate()+c);document.cookie=b+"="+escape(d)+(null==c?"":";expires="+a.toUTCString())};