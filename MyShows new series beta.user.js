// ==UserScript==
// @name         MyShows new series for beta
// @namespace    https://beta.myshows.me
// @version      0.29.1
// @include        https://myshows.me/*
// @unwrap
// @grant        GM.xmlHttpRequest
// @connect coldfilm.biz
// @connect baibako.tv
// @connect myshows.me
// @connect self
// @author Black_Sun
// @require https://github.com/Black-Sunlight/lib-files/raw/master/jquery.js
// @downloadURL https://github.com/Black-Sunlight/userscripts/raw/master/MyShows%20new%20series.user.js
// @updateURL https://github.com/Black-Sunlight/userscripts/raw/master/MyShows%20new%20series.user.js
// @license MIT
// @copyright 2019, Black_Sun (https://openuserjs.org/users/Black_Sun)
// @unsafeWindow
// ==/UserScript==

var $j = jQuery.noConflict();

$j(function(){



function main(){
	$j('div.title__primary').first().before('<style>.seasonBlockBody a[href*="myshows"]{vertical-align: -webkit-baseline-middle;}</style><div id="newseries" class="seasonBlockBody" style="display:inline-block;width: 730px;"><button id="loadnew">Загрузить список выхода серий</button></div>');
	$j('div.AdBlock').remove();
	var c=1;
	var domaintocheck="coldfilm.biz";
	var imgdownload="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAE3ElEQVRYheWWXWwUVRTH/+fOfky3u9vtB80KLUWoxPSBICY+0ILWWDTGRGKMATGG+GCMWhIMARrSWMIDRiJ9UHkwIZCGEB+MERMJ0fqR+IEaYviIFUqKLS2hBdrO7uzs7szcuceHpduubOlWy4PxJCeZzJz/ub/7v/fODPB/D5qrIHFsX4yAjeSpVmJeCSAEohSE6GfN9y0In0U2dyQXHMDo2RsSzHtIym1CemHiv5czWBDY508iEHyPNfFuZPPu7IIAJHr2NpLjnhC23USgXFmxSp4GgR46z0H92ciLuwb/FYBxtGu5yGZ/JDsbJ4iZIyFvAk8JZ8gJ4FD5CMrCzZEtu67+I4DJI506Ze3TwrJWg24/YgYH/NAaHoRW/wBID4MzKXgjl6GGLgGuW9gwWvkrykLNkZc6ZCkAvgKxK7fBTKxWHufxaHEDyto2Q6upK1SuWgfvxjCyvR9DXb8KgHMWGeOPCM33GoAP5uXAxEcdAaTMYVhmLYHAYIj7GlD+/JsQZeFZG6i0ifQnH0KNTrtOFVUjFK68v+KVzjldEPkrpR7nVLKWHQfKscFE0B97DuQPgqU7a1JAR3D9s2AiKNfOZdKog/JaSnEgvwQqk36UMxagcvZrdcuhLVoCls6cTbT4UlB1HN7gpdwNVwJpswXAdyUDcDa7TNlZgBkgQiDeAPbcu2kLQtTWQ10+n9dTxlpRim4awHVCyrFzG0kQoGmALB0AmoBynNsAADlZfX4AnmfkAHIz8CZuQrlz2z8VcmIMypl2kDxpzAsAJH5XUgIqt3Gd/rPQ1z0NEtqcTdiTsPvP5QAAQPNBEP4oBWD6FGhaLzQNyrGhHBvOyADsCz+DPXfOzJ77Hu71obyWfRpYiC/nBcCedxZ66Cy7Dth1oCwT5hfH4A4PAJ6cNZ2hizBPHgenrZxOOoBe9tPizp6L8wKId/UoKo/s4UAwPxM5NoLJo+/A+uUrqEwK7Ml8emkTqdOnMHn0ALyb1/MaBIJAebizlMGBIh+jofYnjsjhga3sONMVPj9EZTX89SsgyqPwUgnI4QEoYxyQcupbBQSD0JYuP1T1cHM7QKh4uUvNH2DXRl0Zt07Ia4Mb2LFnkfCdt4M6fMsae6sfarkqWG0iCB/8gc8RCL4R3rTzRskAADC485mAMhPdcuza65w08m/HoiEIVFEJLb7kYM2a9XUinX6BZrTl8kgfgnprZMvuohB3/SW7sr1trTImOpWZ2KDMpIB08+ccfj8oElUiGjspYpX7alat74dpjCOTFgUABCAc7WO9rDW29e07IOb8JwSAgR1PxVm6LWxnV0KpCDSRoIDeD7//h8YDp24AQOLIvjo1PjrMlllkmgREY30IhVqrXt1fAFESQCmRONwl5PjYBTUx1gQusmREoFh1H8ojrTXtB/MQCwYAADe729eoW6Nfq8RkrGgBEUR1bR+FK5prdxwygJlvwgWIRdvf/43D0TYVCBjSMiGtZGGmEnBH/mxSycSeKc2CAgBAvOPwGYrG2ljXDS+dgmcVpjQNyMT42nsGAACLu46foVh1G4fChpe14GVSM9KC9JzRewoAAPX7Pz1DVYvaOFJhSDsDmbUg7TRUqEyyrndP1S3oJiwWV956sslLjO9nO7MG/sAVEave29jd+829Hve/E38BEpKdi/gPz0EAAAAASUVORK5CYII=";
	var imgtorrent="data:image/png;base64,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";
	var imgnotexist="data:image/png;base64,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";
	var loading="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjhweCIgdmlld0JveD0iMCAwIDEyOCAxNiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZmlsbD0iIzk0OTQ5NCIgZD0iTTYuNCw0LjhBMy4yLDMuMiwwLDEsMSwzLjIsOCwzLjIsMy4yLDAsMCwxLDYuNCw0LjhabTEyLjgsMEEzLjIsMy4yLDAsMSwxLDE2LDgsMy4yLDMuMiwwLDAsMSwxOS4yLDQuOFpNMzIsNC44QTMuMiwzLjIsMCwxLDEsMjguOCw4LDMuMiwzLjIsMCwwLDEsMzIsNC44Wm0xMi44LDBBMy4yLDMuMiwwLDEsMSw0MS42LDgsMy4yLDMuMiwwLDAsMSw0NC44LDQuOFptMTIuOCwwQTMuMiwzLjIsMCwxLDEsNTQuNCw4LDMuMiwzLjIsMCwwLDEsNTcuNiw0LjhabTEyLjgsMEEzLjIsMy4yLDAsMSwxLDY3LjIsOCwzLjIsMy4yLDAsMCwxLDcwLjQsNC44Wm0xMi44LDBBMy4yLDMuMiwwLDEsMSw4MCw4LDMuMiwzLjIsMCwwLDEsODMuMiw0LjhaTTk2LDQuOEEzLjIsMy4yLDAsMSwxLDkyLjgsOCwzLjIsMy4yLDAsMCwxLDk2LDQuOFptMTIuOCwwQTMuMiwzLjIsMCwxLDEsMTA1LjYsOCwzLjIsMy4yLDAsMCwxLDEwOC44LDQuOFptMTIuOCwwQTMuMiwzLjIsMCwxLDEsMTE4LjQsOCwzLjIsMy4yLDAsMCwxLDEyMS42LDQuOFoiLz48Zz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNLTQyLjcsMy44NEE0LjE2LDQuMTYsMCwwLDEtMzguNTQsOGE0LjE2LDQuMTYsMCwwLDEtNC4xNiw0LjE2QTQuMTYsNC4xNiwwLDAsMS00Ni44Niw4LDQuMTYsNC4xNiwwLDAsMS00Mi43LDMuODRabTEyLjgtLjY0QTQuOCw0LjgsMCwwLDEtMjUuMSw4YTQuOCw0LjgsMCwwLDEtNC44LDQuOEE0LjgsNC44LDAsMCwxLTM0LjcsOCw0LjgsNC44LDAsMCwxLTI5LjksMy4yWm0xMi44LS42NEE1LjQ0LDUuNDQsMCwwLDEtMTEuNjYsOGE1LjQ0LDUuNDQsMCwwLDEtNS40NCw1LjQ0QTUuNDQsNS40NCwwLDAsMS0yMi41NCw4LDUuNDQsNS40NCwwLDAsMS0xNy4xLDIuNTZaIi8+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJ0cmFuc2xhdGUiIHZhbHVlcz0iMjMgMDszNiAwOzQ5IDA7NjIgMDs3NC41IDA7ODcuNSAwOzEwMCAwOzExMyAwOzEyNS41IDA7MTM4LjUgMDsxNTEuNSAwOzE2NC41IDA7MTc4IDAiIGNhbGNNb2RlPSJkaXNjcmV0ZSIgZHVyPSIxMzAwbXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+PC9nPjwvc3ZnPgo=";

	$j('#loadnew').on('click',function(){
		$j.get("https://myshows.me/my/",function(data){
			$j("#newseries").html($j("div.WatchSoon.MyHome-shows",data).html());
		});
	});
	var listeneradd=function (checker,pos,c){
	$j('.UnwatchedEpisodeItem').each(function(i){
		var that=$j(this).closest('div[id^="s"]');
		var thatnameblock=that.closest('div[id^="s"]').find('.Unwatched-showTitle');
		//var thatnameblock=that.closest('.seasonBlock').prev().find('.showHeaderName');
		if(checker==false){
			$j('.Unwatched-season').eq(pos).next().find('.UnwatchedEpisodeItem').each(function(j){
if(c<=$j('.Unwatched-season').eq(pos).next().find('.UnwatchedEpisodeItem').length){
		$j(this).find('div.episode-col').eq(0).after('<div style="display: inline-block;padding: 0px 5px 0;"><select id="pageselector'+j+'" style="display: inline-block;vertical-align: -webkit-baseline-middle;width: 92px;height: 24px;padding:0;margin-right:8px;" title="Выбор страницы для загрузки"><option value=0 selected="selected" >Авто</option><option value=1>Первая</option><option value=2>Вторая</option><option value=3>Третья</option><option value=4>Четвёртая</option><option value=5>Пятая</option><option value=6>Шестая</option></select><img style="cursor: pointer;font-size:14px;vertical-align: -webkit-baseline-middle;" id="loader2'+j+'" title="Проверить наличие переведённой серии на '+domaintocheck+'" src="'+imgdownload+'"></img></div>');}
				c=c+1;
			})
		}
		if(checker==true){
			$j(this).find('div.episode-col').eq(0).after('<div style="display: inline-block;padding: 0px 5px 0;"><select id="pageselector'+i+'" style="display: inline-block;vertical-align: -webkit-baseline-middle;width: 92px;height: 24px;padding:0;margin-right:8px;" title="Выбор страницы для загрузки"><option value=0 selected="selected" >Авто</option><option value=1>Первая</option><option value=2>Вторая</option><option value=3>Третья</option><option value=4>Четвёртая</option><option value=5>Пятая</option><option value=6>Шестая</option></select><img style="cursor: pointer;font-size:14px;vertical-align: -webkit-baseline-middle;" id="loader2'+i+'" title="Проверить наличие переведённой серии на '+domaintocheck+'" src="'+imgdownload+'"></img></div>');
			$j(this).closest('div[id^="s"]').eq(0).before('<span id="torrentlink2'+i+'" style="display: none;width: 100%;font-size:14px;overflow-y: visible;overflow-x: hidden;"></span>');
		}

		$j('#loader2'+i).on('click',function(){
			$j(this).hide().after("<img id='loadg2"+i+"' src='"+loading+"' style='width: 64x;' />");
			$j('#torrentlink2'+i).hide().html('');
			var name=that.closest('div[id^="s"]').find('.Unwatched-showTitle').find('div').text().replace(/\s{2,}/g, ' ');
			name=name.trim();
			//name=name.replace(/(\«[^\.\»])*?([а-яА-Я\.]{1,})*?([\.\«\»])/ig,'$2');
			//console.log("After replace "+name);
			var swchoose=name.match(/(Звездный|Детство Шелдона)/ig);
			if (swchoose!=null){
				switch (swchoose.toString()){
					case "Звездный":
					name=name.replace(/Звездный/ig,'Звёздный');
					break;
					case "Детство Шелдона":
					name=name.replace(/Детство Шелдона/ig,'Молодой Шелдон');
					break;
					default:
					break;
				}}

			//var curid=thatnameblock.closest('h2').attr('id').split('s')[1];
			var season=that.find('div.Unwatched-showSeasonTitle').eq(0).text().split('Сезон')[1].replace(/\s{2,}/g, ' ');
			season.trim();
			var serie=that.find('div.UnwatchedEpisodeItem-index').eq(i).find('span').text().replace(/\s{2,}/g, ' ');
			serie=serie.trim();
			//var subname=that.find('.subHeader').eq(0).html('<a id="lnktosite'+i+'" target="_blank">'+that.find('.subHeader').eq(0).text()+'</a>')
			var fullname=name.trim()+''+season+'сезон '+serie;
			var newslnk,newstitle,curlink,loadstat=false,q,lnk,found=false;
			var sell=$j('#pageselector'+i).val();


			if (sell==0){
				found=false;
				if(found==false){
					$j("#loadg2"+i).show();
					var watch=req("",i,sell,found);
					watch.start(0);

					//reqsend()
				}
			}else{
				found=false;
				var watch=req("",i,sell,found);
					watch.start("no");
				//reqsend()
			}

			function req(lnk,i,sell,found){
				var newslnk=lnk;

				return {
					start:function(){
						if(sell==0){
							console.log('starting with cycle');
							for (var z=1;z<8;z++){
								sell++;
								watch.urlget(sell);
							}
						} else {
							console.log("starting single");
							watch.urlget();
						}
					},
					urlget:function(){
						GM.xmlHttpRequest({
							method: "GET",
							url: "http://"+domaintocheck+"/news/?page"+sell,
							headers: {
								"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
								"Accept": "text/html"            // If not specified, browser defaults will be used.
							},
							onload: function(response) {
								$j("#loadg2"+i).show();
								var doc = new DOMParser().parseFromString(response.responseText, "text/html");
								var el=doc.getElementsByClassName('kino-h');
								for (var k = 0; k < el.length;k++){
									//console.log('searching '+el[k].getAttribute('title').toLowerCase()+'=='+fullname.toLowerCase())
									if(el[k].getAttribute('title').toLowerCase().search(fullname.toLowerCase())!=-1){
										console.log('search success with '+el[k].getAttribute('title').toLowerCase()+'=='+fullname.toLowerCase())
										loadstat=true;

										newslnk=el[k].getAttribute("href");

										$j("#loader2"+i).hide();
										if(found==false){
											console.log(newslnk+" start to get torrent lnk");
										watch.torrentget();
									}
										found=true;
									} else {
										if (loadstat == false){
											$j("#loadg2"+i).hide();
											$j("#loader2"+i).show().text("Серия не найдена");
										}
									}
								}
							}
						});
					},
					torrentget:function(){
						GM.xmlHttpRequest({
							method: "GET",
							url: "http://"+domaintocheck+newslnk,
							headers: {
								"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
								"Accept": "text/html"            // If not specified, browser defaults will be used.
							},
							onload: function(responser) {
								var docr = new DOMParser().parseFromString(responser.responseText, "text/html");
								newstitle=docr.getElementsByClassName('kino-h')[0].innerText;
								console.log('found name '+newstitle);
								var ah=docr.getElementsByClassName('player-box')[0].getElementsByTagName('a')[0];


								curlink=responser.finalUrl;
								console.log('link found '+ah.getAttribute('href'));
								console.log('compare that '+newstitle+"=="+name+season+"сезон "+serie+" серия [Смотреть Онлайн]");
								loadstat=false;
								writetosite(newstitle,name.trim(),season.trim(),serie.trim(),ah,i,curlink);
							}
						});
					}
				};
			}
		});

		/*function reqsend(){
				GM.xmlHttpRequest({
					method: "GET",
					url: "http://"+domaintocheck+"/news/?page"+sell,
					headers: {
						"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
						"Accept": "text/html"            // If not specified, browser defaults will be used.
					},
					onload: function(response) {
						$j("#loadg2"+i).show();
						var doc = new DOMParser().parseFromString(response.responseText, "text/html");
						var el=doc.getElementsByClassName('kino-h');
						for (var k = 0; k < el.length;k++){
							if(el[k].getAttribute('title').toLowerCase().search(fullname.toLowerCase())!=-1){
								loadstat=true;

								newslnk=el[k].getAttribute("href");

								$j("#loader2"+i).hide();
								found=true;

								GM.xmlHttpRequest({
									method: "GET",
									url: "http://"+domaintocheck+newslnk,
									headers: {
										"User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
										"Accept": "text/html"            // If not specified, browser defaults will be used.
									},
									onload: function(responser) {
										var docr = new DOMParser().parseFromString(responser.responseText, "text/html");

										var ah=docr.getElementsByClassName('player-box')[0].getElementsByTagName('a')[0];

										newstitle=docr.getElementsByClassName('kino-h')[0].innerText;
										curlink=responser.finalUrl
										console.log(ah.getAttribute('href'))
										writetosite(newstitle,name.trim(),season.trim(),serie.trim(),ah,i,curlink)
										loadstat=false;
									}
								});
							} else {
								if (loadstat == false){
									$j("#loadg2"+i).hide();
									$j("#loader2"+i).show().text("Серия не найдена");
								}
							}
						}
					}
				});
			}*/

			function writetosite(newstitle,name,season,serie,ah,i,curlink){
				console.log(newstitle==name+" "+season+" сезон "+serie+" серия [Смотреть Онлайн]");
				console.log("start to inject "+ah.getAttribute('href'));
				if(newstitle==name+" "+season+" сезон "+serie+" серия [Смотреть Онлайн]"){
					if(ah.getAttribute('href')!=undefined){
						var lnk=ah.getAttribute('href');
						console.log(lnk+' found, launch injecting');
						var q=lnk.replace(/(.*)(1080|720|400)[ррPР]?(.*)/ig,'$2');
						$j('#torrentlink2'+i).show('block').append('<span style="display:block">'+newstitle+' <a href="'+lnk+'" target="_blank" title="Скачать '+newstitle+'"><img src="'+imgtorrent+'" style="width:32px" />'+q+'p</a> | <a href='+curlink+' target="_blank" title="Смотреть '+newstitle+'">Смотреть на сайте</a></span>');
						$j("#loadg2"+i).hide();
					} else {
						$j("#loadg2"+i).hide();
						$j('#torrentlink2'+i).show('block').append('<img style="width:42px" src="'+imgnotexist+'" title="Серия '+newstitle+' ещё не переведена" />');
					}}
					$j("#loader2"+i).show().text("Проверить серию");
					$j("#loadg2"+i).hide();
					console.log('Full Done');
				}

			});
		}
listeneradd(true)
	$j('div.Row.Unwatched-season').each(function(i){
		$j(this).on('click',function(){
		listeneradd(false,i,1)
		})
	})

}
	setInterval(function(jQuery){
		if (!$j('#newseries')[0]){main()}
	},1000);
	main();
})