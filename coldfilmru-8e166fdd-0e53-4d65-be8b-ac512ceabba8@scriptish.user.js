// ==UserScript==
// @id             coldfilm.ru-8e166fdd-0e53-4d65-be8b-ac512ceabba8@scriptish
// @name           auto calc label for translation
// @version        0.9.9
// @history		   0.9.9 RC1 релиз
// @description    Скрипт выводит на страницу с сериалом различную информацию о выходе, возможны ошибки, поэтому 0.9.9.
// @author         Black_Sun
// @require https://raw.githubusercontent.com/Black-Sunlight/lib-files/master/jquery.js
// @include        http://coldfilm.ru/news/*/*
// @run-at         document-end
// ==/UserScript==
(function(){
	var posted=$('#side_center').find('.dateBar').eq(2).attr('href'),
	posted2=posted.split('/'),
	posted3=posted2[4].split('-'),
	pd=posted3[2]+'.'+posted3[1]+'.'+posted3[0],
	tr=["04","06","09","11"],
	tr1=["01","03","05","07","08","10","12"],
	feb=["02"],
	cd=$('#userminiprof').find('div').text().match(/\d{2}\.\d{2}\.\d{4}/ig);
	if(cd!=pd){
		if(tr.indexOf(posted3[1])!=-1){
			if(posted3[2]=="30"){
				var pdp1='01.'+Math.floor(posted3[1]*1+1)+'.'+posted3[0];	
			}
			else {
				if(posted3[2]*1<10){var pdp1='0'+Math.floor(posted3[2]*1+1)+'.'+posted3[1]+'.'+posted3[0]}
				else{var pdp1=Math.floor(posted3[2]*1+1)+'.'+posted3[1]+'.'+posted3[0]}
			}
		}
		if(tr1.indexOf(posted3[1])!=-1){
			if(posted3[2]=="31" && posted3[1]!="12"){
				var pdp1='01.'+Math.floor(posted3[1]*1+1)+'.'+posted3[0];	
			}
			else if(posted3[2]=="31" && posted3[1]=="12"){
				var pdp1='01.01.'+Math.floor(posted3[0]*1+1);
			}
			else {
				var pdp1=Math.floor(posted3[2]*1+1)+'.'+posted3[1]+'.'+posted3[0];
				
			}
		}
		if(feb.indexOf(posted3[1])!=-1){
			if(posted3[2]=="28"){
				if(isleapyear(posted3[0])){
					var pdp1=Math.floor(posted3[2]*1+1)+'.'+posted3[1]+'.'+posted3[0];
					} else {
					var pdp1='1.'+Math.floor(posted3[1]*1+1)+'.'+posted3[0];	
				}
			}
			else {
				var pdp1=Math.floor(posted3[2]*1+1)+'.'+posted3[1]+'.'+posted3[0];	
			}
		}
		}else{
		var pdp1=cd;
	}
	var down=$('td.eMessage').text(),
	kinostok=$('td.eMessage').html().search(/http\:\/\/kinostok\.tv/ig),
	coldfilm=$('td.eMessage').html().search(/http\:\/\/video\.coldfilm\.ru/ig);
	$('#side_center').find('.eTitle').after('<div class="eTitle" id="info" style="color:darkblue;height:100%"></div>');
	$('#side_center').find('.eTitle').after('<div class="eTitle" id="cd" style="color:darkblue;height:100%"></div>');
	$('#side_center').find('.eTitle').after('<div class="eTitle" id="cw" style="color:darkblue;height:100%"></div>');
	
	if(cd!=pdp1 && down.search(/Скачать/ig)==-1){
		if(kinostok!=-1 || coldfilm!=-1){
			$('#cw').text('Серия вышла, можно посмотреть online');
			}else{
			$('#info').text('Серия должна была выйти '+pdp1+', но что-то пошло не так');
		}
	}
	if(cd==pdp1 && down.search(/Скачать/ig)==-1){
		if(kinostok!=-1 || coldfilm!=-1){
			$('#cw').text('Серия вышла, можно посмотреть online');
			}else{
			$('#info').text('Серия должна выйти сегодня после 21:00 по мск');
		}
	}
	if(kinostok!=-1 || coldfilm!=-1){
		$('#cw').text('Серия вышла, можно посмотреть online');
	}
	if(down.search(/Скачать/ig)!=-1){
		$('#cd').text('Серия вышла, можно качать');
	}
	function isleapyear(year) {
		if(year%4 == 0) {
			if(year%100 == 0) {
				if(year%400 == 0) {
					return true;
				}
				else
				return false;
			}
			else
			return true;
		}
		return false;
	}
	}())	