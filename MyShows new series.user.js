// ==UserScript==
// @name         MyShows new series
// @namespace    https://myshows.me
// @version      0.22
// @include        https://myshows.me/profile
// @include        https://myshows.me/profile/
// @unwrap
// @grant        GM.xmlHttpRequest
// @connect coldfilm.ws
// @connect myshows.me
// @connect self
// @author Black_Sun
// @license MIT
// @copyright 2019, Black_Sun (https://openuserjs.org/users/Black_Sun)
// ==/UserScript==
(function($) {
	'use strict';
	$(function(){
		$('#close_likewiki_plate').click();
		$('ul._breadcrumbs').eq(0).after('<div id="newseries" class="seasonBlockBody" style="display:inline-block"><button id="loadnew">Загрузить список выхода серий</button></div>');
		//$('#newseries').after('<select id="pageselector" style="display: inline-block;width: 150px;margin-left: 10px;"><option value=1 default>Первая страница</option><option value=2>Вторая страница</option><option value=3>Третья страница</option></select>');
		$('#loadnew').on('click',function(){
			$.get("https://myshows.me",function(data){
				$("#newseries").html($("div.seasonBlockBody",data).html());
			});
		});
		$('.showHeaderName').each(function(i){
			var that=$(this);
			$(this).after('<span style="cursor: pointer;font-size:14px;padding-right:8px" id="loader2'+i+'" title="Проверить наличие переведённой серии на coldfilm">Проверить серии[coldfilm]</span><select id="pageselector'+i+'" style="display: inline-block;width: 100px;font-size: 14px;" title="Выбор страницы для загрузки"><option value=0 selected="selected" >Авто</option><option value=1>Первая</option><option value=2>Вторая</option><option value=3>Третья</option><option value=4>Четвёртая</option><option value=5>Пятая</option></select>');
			$(this).parent().after('<span id="torrentlink2'+i+'" style="display: none;width: 100%;height: 50px;overflow-y: visible;overflow-x: hidden;"></span>');
			$('#loader2'+i).on('click',function(){
				$(this).hide().after("<img id='loadg2"+i+"' src='"+loading+"' style='width: 32px;' />");
				$('#torrentlink2'+i).hide().html('');
				var name=that.find('a').eq(0).text();
				name=name.replace(/(\«[^\.\»])*?([а-яА-Я]{1,})*?([\.\«\»])/ig,'$2');
				if(name.search(/Звездные врата\: Истоки/ig)!=-1){name=name.replace(/Истоки/ig,'Начало');}
				if(name.search(/Звездный/ig)!=-1){name=name.replace(/Звездный/ig,'Звёздный');}
				var season=that.closest('h2').next().find('b.fsBig').eq(0).text();
				var serie=that.closest('h2').next().find('td.bss_seri').eq(0).text().split('x')[1];
				//var subname=that.find('.subHeader').eq(0).html('<a id="lnktosite'+i+'" target="_blank">'+that.find('.subHeader').eq(0).text()+'</a>')
				var fullname=name.trim()+' '+season;
				var newslnk,newstitle,curlink,loadstat=false,q,lnk,found=false;
				var sell=$('#pageselector'+i).val();
				if (sell==0){multiload()}else{singleload()}
				function multiload(){
					if(found==false){
						$("#loadg2"+i).show();
						for (var z=1;z<7;z++){
							sell=z;
							GM.xmlHttpRequest({
								method: "GET",
								url: "http://coldfilm.ws/news/?page"+sell,
								headers: {
									"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
									"Accept": "text/html"            // If not specified, browser defaults will be used.
								},
								onload: function(response) {
									$("#loadg2"+i).show();
									var doc = new DOMParser().parseFromString(response.responseText, "text/html");
									var el=doc.getElementsByClassName('kino-h');
									for (var k = 0; k < el.length;k++){
										if(el[k].getAttribute('title').toLowerCase().search(fullname.toLowerCase())!=-1){
											loadstat=true;
											//newslnk=doc.getElementsByClassName('carou-inner')[k].getAttribute("data-link");
											newslnk=el[k].getAttribute("href");
											/*$('#lnktosite'+i).attr('href',"http://coldfilm.ws"+newslnk);
											$('#lnktosite'+i).attr('style',"color: darkred;font-size: larger;");
											$('#lnktosite'+i).attr('title',"Смотреть на сайте");*/
											$("#loader2"+i).hide();
											found=true;
											GM.xmlHttpRequest({
												method: "GET",
												url: "http://coldfilm.ws"+newslnk,
												headers: {
													"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
													"Accept": "text/html"            // If not specified, browser defaults will be used.
												},
												onload: function(responser) {
													var docr = new DOMParser().parseFromString(responser.responseText, "text/html");
													//var ah=document.getElementsByClassName('player-box')[0].getElementsByTagName('a')[0];
													var ah=$('.player-box',docr).find('a').eq(0);
													//newstitle=$('h1.kino-h',docr).eq(0).text();
													newstitle=$('.player-box',docr).find('i').eq(0).text();
													curlink=responser.finalUrl
													if(ah.attr('href')!=undefined){
														lnk=ah.attr('href');
														q=lnk.replace(/(.*)(1080|720|400)[ррPР]?(.*)/ig,'$2');
														$('#torrentlink2'+i).show('block').append('<span style="display:block">'+newstitle+'<a href="'+lnk+'" target="_blank" title="Скачать '+newstitle+'"> Скачать '+q+'p</a> | <a href='+curlink+' target="_blank" title="Смотреть '+newstitle+'">Смотреть на сайте</a></span>');
														$("#loadg2"+i).hide();
													} else {
														$("#loadg2"+i).hide();
														$('#torrentlink2'+i).show('block').append('<img style="width:42px" src="'+imgnotexist+'" title="Серия '+newstitle+' ещё не переведена[coldfilm]" />');
													}
													
													$("#loader2"+i).show().text("Проверить серии[coldfilm]");
													loadstat=false;
												}
											});
										} else {
											if (loadstat == false){
												$("#loadg2"+i).hide();
												$("#loader2"+i).show().text("Серий не найдено[coldfilm]");
											}
										}
									}
								}
							});
						}
					}
				}

				function singleload(){
					GM.xmlHttpRequest({
						method: "GET",
						url: "http://coldfilm.ws/news/?page"+sell,
						headers: {
							"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
							"Accept": "text/html"            // If not specified, browser defaults will be used.
						},
						onload: function(response) {
							var doc = new DOMParser().parseFromString(response.responseText, "text/html");
							var el=doc.getElementsByClassName('kino-h');
							for (var k = 0; k < el.length;k++){
								if(el[k].getAttribute('title').toLowerCase().search(fullname.toLowerCase())!=-1){
									loadstat=true;
									//newslnk=doc.getElementsByClassName('carou-inner')[k].getAttribute("data-link");
									newslnk=el[k].getAttribute("href");
									/*$('#lnktosite'+i).attr('href',"http://coldfilm.ws"+newslnk);
									$('#lnktosite'+i).attr('style',"color: darkred;font-size: larger;");
									$('#lnktosite'+i).attr('title',"Смотреть серию на сайте");*/
									$("#loader2"+i).hide();
									GM.xmlHttpRequest({
										method: "GET",
										url: "http://coldfilm.ws"+newslnk,
										headers: {
											"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
											"Accept": "text/html"            // If not specified, browser defaults will be used.
										},
										onload: function(responser) {
											var docr = new DOMParser().parseFromString(responser.responseText, "text/html");
											//var ah=document.getElementsByClassName('player-box')[0].getElementsByTagName('a')[0];
											var ah=$('.player-box',docr).find('a').eq(0);
											newstitle=$('h1.kino-h',docr).eq(0).text();
											curlink=responser.finalUrl
											if(ah.attr('href')!=undefined){
												lnk=ah.attr('href');
												q=lnk.replace(/(.*)(1080|720|400)[ррPР]?(.*)/ig,'$2');
												$('#torrentlink2'+i).show('block').append('<span style="display:block">'+newstitle+'<a href="'+lnk+'" target="_blank" title="Скачать '+newstitle+'"> Скачать '+q+'p</a> | <a href='+curlink+' target="_blank" title="Смотреть '+newstitle+'">Смотреть на сайте</a></span>');
											} else {
												$('#torrentlink2'+i).show('block').append('<img style="width:42px" src="'+imgnotexist+'" title="Серия '+newstitle+' ещё не переведена[coldfilm]" />');
											}
											$("#loadg2"+i).hide();
											$("#loader2"+i).show().text("Проверить свежую[coldfilm]");
											loadstat=false;
										}
									});
								} else {
									if (loadstat == false){
										$("#loadg2"+i).hide();
										$("#loader2"+i).show().text("Серии ещё нет[coldfilm]");
									}
								}
							}
						}
					});
				}

			});
		});

		/*$('#loader'+i).on('click',function(){
				$(this).hide().after("<img id='loadg"+i+"' src='"+loading+"' style='width: 32px;' />");
				$('#torrentlink'+i).html('&nbsp;');
				var name=that.find('a').eq(0).text();
				name=name.replace(/(\«[^\.\»])*?([а-яА-Я]{1,})*?([\.\«\»])/ig,'$2');
				if(name.search(/Звездные врата\: Истоки/ig)!=-1){name=name.replace(/Истоки/ig,'Начало');}
				var season=that.closest('h2').next().find('b.fsBig').eq(0).text();
				var serie=that.closest('h2').next().find('td.bss_seri').eq(0).text().split('x')[1];
				var fullname=name+' '+season;
				var newslnk,newstitle,loadstat=false,q,lnk;
				GM.xmlHttpRequest({
					method: "GET",
					url: "http://aleshafilm.com/news/",
					headers: {
						"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
						"Accept": "text/html"            // If not specified, browser defaults will be used.
					},
					onload: function(response) {
						var doc = new DOMParser().parseFromString(response.responseText, "text/html");
						var el=doc.getElementsByClassName('tcarusel-item');
						for (var k = 0; k < el.length;k++){
							if(el[k].getElementsByTagName('a')[0].innerHTML.toLowerCase().search(fullname.toLowerCase())!=-1){
								loadstat=true;
								newslnk=el[k].getElementsByClassName('ps-link')[k].getAttribute("data-link");
								$("#loader"+i).hide();
								GM.xmlHttpRequest({
									method: "GET",
									url: newslnk,
									headers: {
										"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
										"Accept": "text/html"            // If not specified, browser defaults will be used.
									},
									onload: function(responser) {
										var docr = new DOMParser().parseFromString(responser.responseText, "text/html");
										//var ah=document.getElementsByClassName('player-box')[0].getElementsByTagName('a')[0];
										var ah=$('.mov-desc-text',docr).find('a').eq(0);
										newstitle=$('header.full-title',docr).eq(0).text();
										if(ah.attr('href')!=undefined){
											lnk=ah.attr('href');
											q=lnk.replace(/(.*)(1080|720|400)[ррPР]?(.*)/ig,'$2');
											$('#torrentlink'+i).append('<a href="'+lnk+'" target="_blank" title="Скачать '+newstitle+'">'+q+'p</a>');
										} else {
											$('#torrentlink'+i).append('<img style="width:42px" src="'+imgnotexist+'" title="Серия '+newstitle+' ещё не переведена[aleshafilm]" />');
										}
										$("#loadg"+i).hide();
										$("#loader"+i).show().text("Проверить свежую[aleshafilm]");
										loadstat=false;
									}
								});
							} else {
							if (loadstat == false){
							$("#loadg"+i).hide();
							$("#loader"+i).show().text("Серии ещё нет[aleshafilm]");
							}
							}
						}
					}
				});
		});*/
		var imgtorrent="data:image/png;base64,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";
		var imgnotexist="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAbwElEQVR4nO17aZQcxZXudyMis7KWru6u3hd1q6VWa21JCCEJYUDm2SxmMQaGMWY8bH4ygvHMYMzMMDbDgACzPGE2H2PP8IyxzZgjMIuNACEWCSFkbWizpBZSq2n1vqm6uvbKjHg/MiurqtUCzOJfL86Jk5VVmRH3fneJG/dGEf5Kbf32D/XnNhyeNTSWmjMyPFybHB0p45AhaWZ0xrnUPXrE4/MPGiWh9tJgcN/5ixsPXHDalOQXTRd9UQNv3NEhfrHmwJKevoHzo31dZ0eGhuZEx2J6xgIsaFDCgGIawLhNiJJgygRXaegCKPZrZpFX7PSWVaxtmj3nlX+6dMHm2VPKzc+bzs8dgO89+GbL/vbu744c+eDvB7q7y1NSh2mUwfIETWjakGJyBIJGFKcINB6HYGkiMgEwSKWTpQyyVJApFmKZVLkWC5d7VUKvLBFdobKSJ+cuXfrEfdef0fF50fu5AfC/71278EDb4ZXdB/adPRaJM7OoHpZREpeU7lA+0U4lwS54AknFNAkwCRBABIBsIvIoIQIABVImIzOhUzRWy1PmFH10qDkkkkZtyHh61qlL7nj4pnPbPyvdnxmAf3zwjZbte9t/3L1n+yVjSYJZMgWSoUv52V6UlbYrLZAGCQliUoEABea+rArJIMrdEpHMYaQkQTIyE7qIjDXroyPzS63R8ub64l8su+CcH37/spMin5b+Tw3A65vaxCPP7/nnD7ZtWTnUN2BkymZCcupSxdoWFaroUtwwAQ6AQIqgFBigbKazIKhxg7oAEECQ5F4BMJJgJBkpMGSEGDtWbwwNnlHLI+bs1mkrfnnvNX/8qwFwyyNvTd64ve2ZI1s2LkoWT4WlF4VVAJtURVW74r40iAHKkbaCzbxSzr1zzYLhEqFyKpC7ShCBHOaJIMGYJE5gTEmmUkI/Njy3dOTol2bV+x67bvkVt56/ZPJf5Cj/YgC+vfKVZTu3bF/de/BgebpyHiTP7FW1ZZuUURIFhD2kAlPSYVYqlmNcOZJXE2uAQxFlQSDYvoKRBJEkRgBjkhhJcDIZJ8mYgkhFSvx9R7/W4k8fPOcb51z6g28uCn8hAFx+24tX73jr7f8ajmSEWTIlKf3m26qq7iCY14QtVKakYihg3ulZxpXLuOMLHBRUvjoQANjSzwJhg5AHAJPEyCTOJBMkhUoKX//RZVNxDMu+svic/1xx3tDnCsClP3pp+Y431v3sWNpglrcyIiu0Naqkug+kS5VVd6lyXRV0l3lGxIQQ0HUdnDFYlsXS6TRM04SUrkpIFwhygZBgZJsFI0mMSXBmEmeSODOZIMm5ZL6hrgVTU32VZ1+47MwfXrNs5HMB4NJ/f+E7295Y9/NRK8BMIzSkavx/VEWVYQUhoaiQ8XzmZZZxxQCCJjgrLSnF9OlNmDeznAV9Ah/2J7Fr11EcPXoU0WgMlrTyqbOl7vgCEEkXCEamA4IkzkwSXDLBTM4lC4wcnd9iDoorrvr6Odd9bW76MwHw7Ttf/sp7r7/xylCcC9NbMaRqAy+pQEVYQQAStrpLxSBllunxGgAoMME5q6ysxLlfPQn/9JUgm+q3I4AxS+HJPRZ+s3oP2tvbkUgmoQrNQbr+gJjtEB0tyJkDtzVB4yYTzBRCsqKhjoWtfLTzpaduvYroxGzyj2J+xX2vtry3ccvagf6wzyyaFFHV3j+oosqRAuYtKSAVh1IcUnFIaX9Wihy15wSQz+tls2ZNp5u/UcVbi8lpIA8jrhtKDA4mS2t8iZKWKr10Vp23uD6ke4u9Qk+lLZlMSwkoZgdHikEpcuAhuGsGkb2QEEDMsoqKe+Ph0dP+9Pbm+O6tr+06EY/iRD888dxm/Re/37q6//DhErNqQVqF8OoJmHckL3OSl4W2T4xBMMZ8hgeGBpbJZPRwOFwdjUark8lkpTBN3/KFAFB1HB1KKQyNmdGOweTIu22RrjU7w12jSZkmJZ2Ygmw+FEwAQhEgCTCJm+Hq5jcP9O677eY7nty46varJ4waT6gBmfpz7ty/Yd1lqaoFkN7MelVVf0iRLo9jfrz6KwcIKAapCAqMFIgTY3Pr9LIZpcnW+HDvomg0OimdTpdIKbUT0QDYEvV7uF4X8hQvmRac9Lenls+cWeP1dw6lxoajmQxsLVBkR9R2MGH7CyiuZdJe7zD6ur5+aPe6Zz4xAN+555WF29dv+GVEVDLJ2SHVUPcemNeEYhMzbwMgbIYL7J+gwGZWsdL/uKRqycUL/K1eypTgM0SgnBFNrjBCF50cmtZU4fFsOxwdTJsqqwsEkCKQAtld6d6omYjOvGjZV3ve/9Nrh8aPd5wJpNMZfHn5Ez8JDw4LWV4TVzW+DeC+tFKE4718AfMMStpe344DmIAp/uErxXMvO2NKs6ZNbG1KKQyEU/HuwbF4d++gGY0nZCoW1r2a0n0iHWhqbGBTp06F1+sdDwT7amvJjJObAvV3vdi1cdOh2IAimEQQyoKtAYxgcZYOl0/e0jG879bu4dirdWX+gnGOk8Tf3fHHi95+/oUXI4EWWD75pqpr2q1Il7DAIJWAJe1r1ualc69kQeBT608H7/zbxqWt02qCEzF9sDs28tr2gc61OwYGOvvjEyc+lMXY2OGgPra/+pSp3vplp53sO//88+Hz+Qoey1hS/vzNgc2/eW/kIDEmSTCTuDBJ5ybTual5hFk29uHc0/xjjz7xyPfXFACZfxMejeLhX69/tr9roNL0lg6ouqoNEL4MJGNOoMMdW+eF677Mqb5UrLkkUf7gtS1nTmusKqBUKYUdh0b7fvSr/Tsefv7wwZ3tY2PRpLQEF8QFJ84Fcc6JMUaMGCmQVJ6ypBmcOdRpNrW/u2XX2Au/fawknRjT5syZAyFEVhvolCn+SQQk3++IDQNQ9i6bJBEpcKakPzDkGe0/+/DO1393QgAGg2ec9f7bb9+SKJ4GWYT1KK7qU+CAQpZh7jBsA6FknjnY8cDMUKx61XWzv1RTWVbg3IYj6fjKp9u2r3ru8KHBiExpukaCc3DGwIjAiBgjIkakGGPgnEEIjQQXBICkUkoFGsbiRfM73t/8Flv30lOhWbNmoarKXjmICPMbffWpjIru6UqEiUg5S6IEI0VcM0V6bMq1l/3NO++8+cKxCQEINC17sPfIhzNMf/mQqq18B9xrOY6P3PXdVnNe4A8cm6/xjoX+z7UzTq+pKi8w+J2HRweue/D9zfu7klFN08EY2et53lqe93jed4oIRJxzJbggKSUpMClL5wyOJuTYa888Ul1RXkbTp093QThpsr9+X3eiu+tYOg4iZW+gSBJnSvp8Ea33SMP+99e9k53MTU7c/+TG6v5DbReYxQ2AofZB+Ew7gZG1a+RL29nR5Wzeh6jv7isav1RfU1nAfMaU8sHfH94XyzCTcwZXa1y7AMatHKwgaQIFKMmIAI/ugRCCQSlYFaf2xGq/vnnlXffI1atXu09rnNh/XFy7rNTLDUjFlJQMlmTKkkgxb2RM8y/Op8+d6L0Pjl0w2t8rpF5iqrLgQZAT5yvknJsb28tskOP2G5YZC2e3TDYwrmmCsUdvaF06uyEQLNgGu3uEvB2i21UhKMg9rwkNmqYxKAVZtmAgM+nCHfff/wDWrl3rzhnyi8At51UtUI6WKqmYshSzJBAmw7fqp89VHgfAQE/PNzK8CAqpTmUUxx3p53v2/O1snlaALa0Zbr74rPnV45nPtmK/pj/03ZlLZjUEAoVMOwBC5TOdd59VAud5+3smuMhqApOVS7ussgWHVq5ciQ8++MCd88zpRS0LJ3tDSto8KCmZtBQL+8o7du89fFYBAJveb9cjvV1nWf5KwGAdYJpZwCjcLE5O+g6R3Irp15/fMkfTcj5vIJyKP/Xyng53U+OA8PCK2UtmNxYFcu/DBTEb6zvg5JucA0TWNGwQNE0DYwwAmNl4yb6E5YneccedsCx7N8kYsWu+VD4/qznK1gSkNH9kFHpLAQCr13fMDff1GMoohQoaXU4uL181WZ70C4i8YEZmxvTmRj07oFQKK3/btvOxtZG9j//+/XYppQtC0Cf0h1bMXjS7sSiYx0xO2oUmgDzgkdMAVxOg67oNENOkWX/O3ra2A3juuefc+eZP8jZMq/QEs5qspGKWYmZG89YUAHBkMLoolc5AKTMCX3HESWvlO7qciubZLFlJcfmXm5vz1f2dvcNdm/aPjhARntyQOPDo6h2HjgPhhtkLW5uKAoUpMWfsgq+yYBSA4PoEAoHbsQCT5af0KU9Z5Fe/+hUymYyrBV+fXzxFZTVJKkgJpJkoLwBgdDQ6zyIDiuSQ4rqZAyBPA+AS40poQVW0furketfrm5aUq549dEAI4eb9nn43eWjV09sPZlXTBkHTf7JizsLWpmDweMaz9/krxTgQ3FVEQXNWBSjACs3v6O8fwJtvvum+umiKb0r2fWV3KK75kmkzB0Bm7Fi90gOAQBjEc4QU2GFuUuc9dsHiuob8ZMPm/cd6uobTSRSKFs/+KdV+36+3HTDNXMK2yCf0n9wwZ0FrUzCAEzbFkJ87zILg/gxGRCDGAChYFYt6QChYEepK9FCplxtZs1EKLGZCbtn1QdAFwIyN1SvNB2gsbFdtsnyOS9tmk5kKgMyw+c0V5fk/P/tOd6fgIs975158cVu6865fbjuQdtQzC8JDN7YunDc1GDjOF4yb9LgMcp5GcMcZwhNKKq04umXLFliWBXJ2xqc0+codXhmUQgY8feRIXyAHQCpRqZgGCBYFUSED+XaH3HLUEIiH8iO+0VgmvWHvyIitEeOed955ZWe6847/3rYvlcql6QJeIR5c0bpw3tTiQMGkKp9jVagF44TDnOUAAOCtDCeTSRw+fNhNrU0p10vyUSROpsrE4QIAkA5iAGdpJyplBYjnSSWr8KfMqg3kq//+zrEhNeE2XxWMt25vuue2X2zdm0ymCkG4oXXhSdOKg8e/+hH3zpcO6PadXhwHgM7OTveJsoDwZaknpxbp8fmlC4DNMgc4SxeyMKEJAAqoLzMKbHf/0bFwPiEf1dYfMPtufXzr7ngi6S4PAa8Qq65vXXAcCB/fWMFWQvjTRITBwUFkBRQwuLtMgwCDk3HygpkjzstwkkoSx6cHTpy4qQkVbso/7E9EsxN+knTPpoPWwL/8dOvuaCzhguB3QFjgglAAZuH+4ERUOsWUVCrl3FJhyZEIfo9ItzRWpd1BOWdDJE1ASmEPSPLjuAj4PAWbnp6RZDKvyveJ2tZ2a+jmx7bsjkTjhSCsaF2wsKVkvCbkgolC4qSCcr8jZTKAXOnnUux2TYExAlemWzpjACB0fYCkCbKUYW9Cx02dV7ZWzpUXhixIpKT85Kzn2s4P1dBNj2zZGY7EXAZ9hhAPXD9nwcLppZ/AHAj5ITez4gYR4Pf7oZTtH8ZSMpmVPmMEg8k+93kA0ItKushKAJb0uZ6SKG+nTrmrMykRFUCg3MXjE+Y78x7b24WRf3x4647h8JgbKPgMIR747uwFi2bkgTBBNQAESKWkQ7Rk6WMBIkJZWZmrBcMxKwqyiyhCEAJk9hYAUFRRtYubcZCpSuwYNzuhS6V0r85XsZRVUHIqC+q6yhIyEac5hidU5bZehL/30LYdgyORAhDuX54PAo2jxX7fktIpnwGGGgtyLtDU1OSO3TmSiRAjMM5gsIxRRumDBQDUV5bs1oUCSQpBySzK0plE5qOdvYZjZkEis6JIGFLKXDkrn8dsmXsc0zlJ2v3wAIvc+ND2HX1Doy64Xg8X9y+fvWDxzNKS4963M2W2CRDBk+oO+nQYoVApGhsbAdhaue1oYoAYSSaYrFFjlWcunr25AIAlMyq2Ffk9khSVk0wLF918M3CBIAlA9oUz0XwAptcZQQB2hTenQYUa4dI+wfdO/3CYRW78yY4d3f3HCkC4b/msBUtnh0pcWpz3TEtKcjx/aeZwvdfrxeLFi8E5BxFhKGqGh+MqyTiTQjCENKvroq8tdWlnAPDt8+YMlFdX7WCJSJDikRIiBeeISlYDcsw7UtvdGSsoPbdUUTWIYElLFkoJWSBlzpdMAEJe6wqz6A0P7dx2tHfE1TKvzsU9181YsHRWyNYEskN2S1qOh1eoZL0NXq8PZ5xxBrKg7OlOdWSlb+jEKhDfnj+X68jKG5vWaKkRsGiqgaBgl6DhOhK7OgvX1nZ2xMIZM7fPndFUHagyIkFLSiioPCllGT0RCBP3vgiPrnh417Yj3cMFIPz42ukLT58TChEBGct0zhER6tmh+mIv+crLy7B06VKXwTfaYu1MMCk0LusQrl40uXzdhADMmdG4uki3QBmaQiojiFz7t0vQxArMIGVJc393wl1OPB4PLjrJ20xEMC0rV9fPgpBbTXJH5Mbng51Hslo2GBXxGx7Zs+VQ52A8+7Ohc3HXVdMXnjarxE53EUnBJJvmPTrL8Hpx3nnnwePxAAB6RjND77TH+5jgUtc5avX0oWuuOn9gQgBWXrd0b1199SYRj9RTPBwkKPdwUoEZ5H1ev2+0M3+wr53WXBsSowGpFKysRxwPgjsGXG+b8zf597YARhIifsNj+za3HRlw7dbQmbj7qpZFy+aVhYiRPKnogxnFBvnKy8px1ln/y5mOsGbv2G4S3BQal2UiGZzuzbw8Dm4UrOVN8+b/3EgNMjaamEUkYdeBswcRkAOD2Vrw4vaRzlgytxxOaZrMLpufmU8ESMuEVPJ4TcB4IE7YXec7mhLJG392YPOfD/e75wENnYt7r5655PKT2YyW4LEWj8eDCy+8AF6vAaWA/khm5DfbRg9wjUvdELJZj0Zv/8GVWz4SgPNPbf5dTbm3gyfScygTNezCSlYLnNMYeSc0xlLSfGXXsQP5Y/zN+aeHTq/qnKWIpCWtCUAAjmdyfM8DBwCIybGMlrzx8bbNuw72uGGsR2PiB1ecMmvy5MmYM2cOWltbnahQ4YlNxzZJxkyhC1mpJUtajNRvxzMPjKsMrX7qMWvZ5f8w2ntg3+UZ7kuqQLAbRAoKlO2U3Y/bGz/a3xU/dtHJoakejQnADkErfOlQV3dPsi8eOKaUJACKMUYA2aO4hzrglrELejYaI5JgTNmri5TJjDJf2zHYPb9RL6utCHoBgHOOlpYWTG1uBncOXm8+Ej/w03fDO4RHs/wBTZ3kGR5+7NYr/udjAQCA3/zfn+3duGnXJeEoZsuAvh+akc5SCgUCKbsO78S9yYyU8ZQVXdoSbMwuGDU1NSiyeqsjkXC6O+obUSCSSimnXkc2k1mGnQ296weYtGEm5SSmpWVZdrRPJE2IzN62jvjcWtlQUW4npDjn4NxmZThmhb///MAai/GUx6eZzd5o0WJ/4r431v4+9okAePzRB+RZV960fahtz/Ik/LoqCnQo4hJuxmF8JA7s745HZtd7A5PKPKU2nYTGxkYErP4qwxo22kd9/VLZGEhHR4mQBQM56TNlh6xcEud2kkxKKDswU8RILq4ebD61uv/kzg87qKysDKWlpS7t8bRK/uuL/S/1xhDRvJpV7pfexZ6RV+751yt3TMT8hAAAwK63nuk+9dxvBYc+7L7Y8ug9ylc04nhox0qVAsGh3m7r9432nDkjWFPqZF8YYzYIPFZSp/XUxUwtMhjXYgTK5pVJqWwk6xguI0WMKcbsJdfNEhLJySWJ0gun9i9uLh6bzAjU0NCAuXPnupJPmdL88drhNdt7M726oZmBIh0niYHe/77tW0+ciPkTAgAA3/v3e985+kHbOZFR8xQZ8HygNCMJ2CEiZYEgKPsoNMiSSm1si3SfPqOoOugV3qwm1NXVobw0oFewnobp5alyRTw9GOdxZQc8OVNwPzvnTACpccnnVSeqzm0Oz1tcOzbbJyyvrutYvHgxFi1a5J4PSGZk+p61Qy9vOJLu0gyR8QV0OU8b9J7b4LnzpRd/95Fnhz9y73rTY2/Vb3jp5a1HeU0yNWnSC5L50spSQpmKwZJCWZZ9UsRSzjEZyUJepj92ddNZUyqNyvyxUqkU2tra0Nvbi4wksyciBvqjPDwUo2g0TWkpCRpXLGgoI+STgSq/WVLhy4QYLJHN8DY0NGDmzJluoAMAx+JW9K7XhtZs784MCEOkvX5dzjRGA6d6wnff/m9XdX0Ufx8LAAAsv/v5Je+98e7r/YGG9nRt3ToLHlNZEMqSDKYUkJIpS4r8Y3JeAf32b9QvPHNGUcv4Q4qpVArd3d0YGhpCNGrHNvnZm2yXUoIxhuLiYlRVVaGmpgb59UcAaOtPdd728uC6gQSiwiNMr0+XM4xw+RJ/9O47bvm74w5EfSoAAOA7tz9zxtaN217pLZp0MF1T/6aEx1SWYsqSQpnOeSFLMkgpVO7cIC5fFJpy3ZkVC4t9wjfRuKZpIhaLIZFIwDRNKKXAOYemafB6vfD7/RgPIADE0jL5P1tHN/16W+QA04QpPML0+jU5XQ8HTxLHVt37o2sOTjDdpwcAAK5fufqMP23Y+nyvr74nVVO7TjJvWlqwpW+DwSBzmpAFImgw/Z/Prprz5ZnBGV6d6R8/04lbLCWTb7RFd//XpvDuSIaSXOOm5hHS5xeYwwYCi4rNlT+8+Vsfq/b57RMDAAA3r3qpZcuGLX84kikyEnUNayw9GJGSmLIkU5btF2BJpgpPjgIKrNjL9CtPLWs+bVpgyuQyvZwxYh8/I5BIy/ShwXTP2wdjh17aG21PSUozjUmhCVMzhCwxLKOVBkZOKcUDN990ZfTjR/wMAADAw8/tLFmz+oWH20fUJZGaya9miso7LMWlssCUZR9EIEsJlTs9iuyxGCd3ySqDurF0Wknl1NriktrKQNBbCt3gSqRBZtqk9Mgg4kd7R8NtXeGRrR3RIQswiTHJBJNMcCl0bhpejgYaqWz1xF5b9S/ffNowPp1y/cUAZNvVNz9+8YFDPT/toZKRRFXdRksvikhJsEFwTMA9S+ie/HAqRMQUEyDNB/gqgNJSwC9AqTRwLCwRHQKshCQoSZwk4zbjXLO3tSEeD87URiMtevLRO394befHkPrFAAAADzyzPbjx5Vdu6Y6oGwaM0L5kqGqnJfxxqQqAQPb8YEFpO7ufIMZAJPPysPa/xThJZksdXDCp6QzFlAhOpWNyMos989DK5W9/1DH4T9o++wgAHnhqffU7r729YiDJ/36Q+UYSZbW7TaNoyFJCKgUoh3mVf87IbnZpzv2LnP0HKcYInDNwQdIjlKhID9dWs0TXNL/1+o9u+ubakqD/hLT8pe1zASDb/rCpXX/p2T9cdKRn9NIY9IUjyjOSLK1uzxj+Psl0U4JJu8Cb3QzCzX8wIjAGcAZmqFSgLDVSHRKZoXKW3jOz0v/Cv/3g259J1U/UPlcA8tt7f+7Tn3vu1SWHD364KMGNeZZuNGSI+ZKmZGmJuGIiTURSF0z4PAIaqbBOcshP1tEybu1rnTHp7eu/c/En+uPTZ2lfGAAnar2xjP7n9r6Szt5hQzM85sym2ujs2mDEy//qpPz/BgD/D6kmb8qBDMq7AAAAAElFTkSuQmCC";
		var loading="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjY0cHgiIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwMCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAwOTBmZSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQyIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDAwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjOTBlNmZlIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBkPSJNNjQgLjk4QTYzLjAyIDYzLjAyIDAgMSAxIC45OCA2NCA2My4wMiA2My4wMiAwIDAgMSA2NCAuOTh6bTAgMTUuNzZBNDcuMjYgNDcuMjYgMCAxIDEgMTYuNzQgNjQgNDcuMjYgNDcuMjYgMCAwIDEgNjQgMTYuNzR6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9InVybCgjbGluZWFyLWdyYWRpZW50KSIvPjxwYXRoIGQ9Ik02NC4xMiAxMjUuNTRBNjEuNTQgNjEuNTQgMCAxIDEgMTI1LjY2IDY0YTYxLjU0IDYxLjU0IDAgMCAxLTYxLjU0IDYxLjU0em0wLTEyMS4xQTU5LjU3IDU5LjU3IDAgMSAwIDEyMy43IDY0IDU5LjU3IDU5LjU3IDAgMCAwIDY0LjEgNC40M3pNNjQgMTE1LjU2YTUxLjcgNTEuNyAwIDEgMSA1MS43LTUxLjcgNTEuNyA1MS43IDAgMCAxLTUxLjcgNTEuN3pNNjQgMTQuNGE0OS40OCA0OS40OCAwIDEgMCA0OS40OCA0OS40OEE0OS40OCA0OS40OCAwIDAgMCA2NCAxNC40eiIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSJ1cmwoI2xpbmVhci1ncmFkaWVudDIpIi8+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGZyb209IjAgNjQgNjQiIHRvPSIzNjAgNjQgNjQiIGR1cj0iMzIwMG1zIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPjwvZz48L3N2Zz4=";
	});
})(jQuery);