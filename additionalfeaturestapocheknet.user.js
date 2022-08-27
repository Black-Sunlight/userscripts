// ==UserScript==
// @name           additional features tapochek.net
// @version        1.4.1
// @namespace      tapochek.net
// @author         Black_Sun
// @description    На главной странице выводит блок из нескольких разделов.
// @connect imdb.com
// @connect tapochek.net
// @connect kinopoisk.ru
// @connect www.kinopoisk.ru
// @connect self
// @grant GM_registerMenuCommand
// @grant GM_addStyle
// @grant GM_deleteValue
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_getResourceURL
// @grant GM_xmlhttpRequest
// @resource rips https://raw.githubusercontent.com/Black-Sunlight/userscripts/master/images/rips.png
// @resource bd https://raw.githubusercontent.com/Black-Sunlight/userscripts/master/images/bd.png
// @resource games https://raw.githubusercontent.com/Black-Sunlight/userscripts/master/images/games.png
// @match        http://tapochek.net/*
// @match        https://tapochek.net/*
// ==/UserScript==
/*==========================*/
/*
Настройка своих ссылок и всплывашек к ним ниже в 6 переменных, расположение на странице по порядку слева направо,
первые 3 переменные ссылка, вставьте её целиком в кавычки или оставить кавычки пустыми для значения по умолчанию, далее идут 3 переменные текста всплывающих подсказок к ссылкам выше.
*/

var rips_link='',
	bd_link='',
	games_link='',
	ripstext='Новинки (Rips)',
	bdtext='Новинки (Web-DL, HD Rips)',
	gamestext='Горячие новинки';
var imgt='text';/*img or text*/

/* Дальше без необходимых знаний не редактировать */
/*=================================*/
/*jshint multistr: true */
GM_addStyle("#user-menu{top:2%;}\ .topmenu{position:relative;top:14px} \
#user_features{top: -100px; width:850px; left: 310px; height: 32px; position: relative;} \
#user_features a{display:inline-block;margin-right:5px;width:210px;height:140px}\
#user_features img{margin:2px 0px 0px 5px} #user_features a.films:hover{background:#68AFDF;}\
#user_features a.filmsr:hover{background:rgba(222,106,37,.8);}\
#user_features a.games:hover{background:rgba(69,214,20,.4);}\
#user_features a:active img{transform:scale(0.95)}");

GM_registerMenuCommand("Сбросить всплывашки и ссылки", function() {
	GM_deleteValue('ripstext'); GM_deleteValue('bdtext'); GM_deleteValue('gamestext');
	GM_deleteValue('rips_link'); GM_deleteValue('bd_link'); GM_deleteValue('games_link');
	if(confirm('Сброшено, перезагрузить страницу?')){location.reload();}
});

$('div[id^="cluet"]').remove();
/*Текст всплывашек
if(!GM_getValue('rips'))GM_deleteValue('ripstext',$('#forum_5_429').find('.sf_title').eq(2).text());
if(!GM_getValue('bd'))GM_setValue('bdtext',$('#forum_5_429').find('.sf_title').eq(3).find('a').eq(0).text());
if(!GM_getValue('games'))GM_setValue('gamestext',$('#forum_2_18').find('.f_titles').find('a').eq(0).text());
*/
ripstext=ripstext===''?GM_getValue('ripstext'):ripstext;
bdtext=bdtext===''?GM_getValue('bdtext'):bdtext;
gamestext=gamestext===''?GM_getValue('gamestext'):gamestext;
/*=======*/

/*Ссылки*/
if(!GM_getValue('rips_link'))GM_setValue('rips_link',$('#forum_5_429').find('.sf_title').eq(4).find('a').eq(1).attr('href'));
if(!GM_getValue('bd_link'))GM_setValue('bd_link',$('#forum_5_429').find('.sf_title').eq(3).find('a').eq(1).attr('href'));
if(!GM_getValue('games_link'))GM_setValue('games_link',$('#forum_2_18').find('.f_titles').find('a').eq(0).attr('href'));

rips_link=rips_link===''?GM_getValue('rips_link'):rips_link;
bd_link=bd_link===''?GM_getValue('bd_link'):bd_link;
games_link=games_link===''?GM_getValue('games_link'):games_link;
/*=======*/

$('#page_header').find('div.topmenu').eq(0).before('<div id="user_features" style="">\
<a href="'+rips_link+'" class="filmsr" title="'+ripstext+'"><img src="'+GM_getResourceURL("rips")+'"></a>\
<a href="'+bd_link+'" class="films" title="'+bdtext+'"><img src="'+GM_getResourceURL("bd")+'"></a>\
<a href="'+games_link+'" class="games" title="'+gamestext+'"><img src="'+GM_getResourceURL("games")+'"></a></div>');



if(location.href.search(/viewforum\.php\?f=(886|703|430|431|908|909|934)/)!=-1){
	GM_addStyle('.red{box-shadow:inset 0 0 10px 5px rgba(218, 8, 8, 0.15);}\
            .orange{box-shadow:inset 0 0 10px 5px rgba(218, 163, 8, 0.15);}\
			.green{box-shadow:inset 0 0 10px 5px rgba(8, 218, 33, 0.15);}\
			.black{box-shadow:inset 0 0 10px 5px rgba(0, 0, 0, 0.15);}\
            .redbox:hover{background: rgba(218, 8, 8, 0.12);}\
            .orangebox:hover{background: rgba(218, 163, 8, 0.12);}\
			.greenbox:hover{background: rgba(8, 218, 33, 0.12);}\
			.blackbox:hover{background: rgba(0, 0, 0, 0.12);}\
            .greenlink a{color:#00ad14!important}\
            .redlink a{color:#cc1c1c!important}\
            .orangelink a{color:#ad8727!important}\
            .blacklink a{color:black!important}\
			div[id^="imdb"] a{color:#c78c08;text-decoration:none!important}\
			div[id^="imdb"] a:hover{color:#25b51e}\
			div[id^="kinop"] a{color:#c78c08;text-decoration:none!important}\
			div[id^="kinop"] a:hover{color:#25b51e}');
if(imgt=='img'){
	    GM_addStyle('div[id^="imdb"]{float: right;position: relative;top: -12px;margin-bottom: -16px;}');
} else {
		GM_addStyle('div[id^="imdb"]{/*float:right;display:inline-block;box-shadow: inset 0 0 20px 4px #e29d3647;*/position: absolute;right: 0;top: 10px;margin-top: -0.625em;}');
	GM_addStyle('div[id^="kinop"]{/*float:right;display:inline-block;box-shadow: inset 0 0 20px 4px #e29d3647;*/position: absolute;right: 0;top: 26px;margin-top: -0.625em;}div[id^="kinoblock"]{display: inline-block;\
    width: 300px;\
    position: relative;\
    height: 30px;\
    float: right;}');
}
	$('div.torTopic').find('a.torTopic').each(function(i){
		var texthref=$(this).text(),imhref='',imhref2='';
		$(this).closest('div').after('<div id="kinoblock'+i+'"><div id="imdb'+i+'"></div><div id="kinop'+i+'"></div></div>');

		$(this).closest('td').css({position:'relative'});

		/*	$.get($(this).attr('href').replace('./','http://tapochek.net/'),function(data){*/
		if(texthref.search('/')!=-1){
			imhref=texthref.split('/')[0];
			imhref2=texthref.split('/')[1].split('(')[0];
		} else {
			imhref=texthref.split('(')[0];
			imhref2=texthref.split('(')[0];
		}

		if(imhref){
			$('#imdb'+i).html('<a id="button'+i+'" style="cursor:pointer" title="Проверить рейтинги">'+imhref.trim()+'</a>').queue(function(){
				$('#button'+i).on('click',function(){
					$('#imdb'+i).html('Загружается, пожалуйста подождите...');
					GM_xmlhttpRequest({
						method: "GET",
						url: "https://www.kinopoisk.ru/index.php?kp_query="+encodeURI(imhref2.trim()),
						onload: function(response) {
							//if(location.href.search('kp_query')==-1){
							var objkinop=$.parseHTML(response.responseText);
							console.log(response.finalUrl)
							if(response.finalUrl.search('kp_query')==-1){
							//console.log(nameurl+" = "+imhref2.trim())
							var ratingkinop=$('span.film-rating-value',objkinop).eq(0).text();
								console.log(ratingkinop)
							if(ratingkinop=="" || ratingkinop=="–"){ratingkinop="Фильм ещё не оценен"}
							var urlkinop=response.finalUrl;
							var searchurl='na'
						} else {
							//console.log(nameurl+" = "+imhref2.trim())
							var ratingkinop=$('p.name',objkinop).find('a[data-url^="/film/"]',objkinop).eq(0).parent().parent().parent().find('div.rating',objkinop).eq(0).text();
							console.log(ratingkinop)
							if(ratingkinop==""){ratingkinop="Фильм ещё не оценен"}
							var urlkinop='https://www.kinopoisk.ru'+$('p.name',objkinop).find('a[data-url^="/film/"]',objkinop).eq(0).attr('href');
							var ratingkinopl=$('div.rating',objkinop).length;
							var searchurl=response.finalUrl;
					}
								if(imgt=='text'){
									var ratingkinopc=parseFloat(ratingkinop.replace(',','.'));
									if(ratingkinop == "undefined" || ratingkinop == ""){$('#kinop'+i).removeAttr('class').addClass('black').addClass('blacklink');$('#kinop'+i).parent().removeAttr('class').addClass('blackbox')}
									if(ratingkinopc >=0){$('#kinop'+i).removeAttr('class').addClass('red').addClass('redlink');/*$('#kinobock'+i).removeAttr('class').addClass('redbox')*/}
									if(ratingkinopc >= 5.8){$('#kinop'+i).removeAttr('class').addClass('orange').addClass('orangelink');/*$('#kinobock'+i).removeAttr('class').addClass('orangebox')*/}
									if(ratingkinopc >= 7.0){$('#kinop'+i).removeAttr('class').addClass('green').addClass('greenlink');/*$('#kinobock'+i).removeAttr('class').addClass('greenbox')*/}
									if(searchurl=="na"){
										$('#kinop'+i).html("Kinopoisk: <a href='"+urlkinop+"'>"+ratingkinop+"</a>")
									} else {
										$('#kinop'+i).html("Kinopoisk: <a href='"+urlkinop+"'>"+ratingkinop+"</a><a href='"+searchurl+"'>["+ratingkinopl+"]</a>")
									}
								} else if(imgt=='img') {
									$('#kinop'+i).html("Kinopoisk: "+ratingkinop)
								}
							//}
							}
					})
					GM_xmlhttpRequest({
						method: "GET",
						url: "https://www.imdb.com/find?ref_=nv_sr_fn&q="+encodeURI(imhref2.trim())+"&s=all",
						onload: function(response) {
							var obj=$.parseHTML(response.responseText);
							var firstresult=$('tr.findResult',obj);
							var countres=firstresult.length;
							var firstlink=firstresult.eq(0).find('a').eq(0).attr('href');
							var tt=firstlink.split('/')
							tt=tt[2];
							GM_xmlhttpRequest({
								method: "GET",
								url: "https://www.imdb.com/"+firstlink,
								onload: function(response2) {
									var obj2=$.parseHTML(response2.responseText);
									//var rating=$('div.imdbRating',obj2).html();
									//var rat=$('div.imdbRating',obj2).find('span').eq(0).text();
									var rat=$('div[data-testid*="aggregate-rating__score"]',obj2).find('span').eq(0).text();
									//alert(rat)
									if(imgt=='text'){
									$('#imdb'+i).html($('#imdb'+i).html()+rat);
									if(rat == "undefined"){
										$('#imdb'+i).html("Нет рейтинга imdb");
									}else{
										$('#imdb'+i).html("IMDB: <a href='https://www.imdb.com"+firstlink.trim()+"' title='"+imhref.trim()+" / "+imhref2.trim()+"' target='_blank'>"+rat+"</a><a href='https://www.imdb.com/find?ref_=nv_sr_fn&q="+encodeURI(imhref2.trim())+"&s=all' target='_blank' title='"+imhref.trim()+" / "+imhref2.trim()+"'>["+countres+"]</a>")
									}
										} else if(imgt=='img') {
								$('#imdb'+i).html('IMDB: <img src="http://www.uniongang.net/imdb/imdb_'+tt+'.gif" class="undefined" alt="pic" title="Размеры изображения: 102 x 38">');
							}
									//var rat=$('#imdb'+i).find('span[itemprop^="ratingValue"]').eq(0).text();
									var ratc=parseFloat(rat.replace(',','.'));
									if(rat == "undefined" || rat == ""){$('#imdb'+i).removeAttr('class').addClass('black').addClass('blacklink');}
									if(ratc >=0){$('#imdb'+i).removeAttr('class').addClass('red').addClass('redlink');}
									if(ratc >= 5.8){$('#imdb'+i).removeAttr('class').addClass('orange').addClass('orangelink');}
									if(ratc >= 7.0){$('#imdb'+i).removeAttr('class').addClass('green').addClass('greenlink');}
								}
							})
						}
					})
				})
			})

			//var imgurl=imdb.split('/');
			//var imgimdb="http://tracker.0day.kiev.ua/imdb/imdb_"+imgurl[4]+".gif";
			//$('#imdb'+i).html('<a id="pos'+i+'" href="http://www.imdb.com/title/'+imgurl[4]+'/" target="_blank"><img src="'+imgimdb+'" /></a>');
			//$('#imdb'+i).html('<a id="pos'+i+'" style="display: block;border-radius:10px;padding:8px" href="http://www.imdb.com/title/'+imgurl[4]+'/" target="_blank"></a>');
			/*GM_xmlhttpRequest({
				method: "GET",
				url: "http://app.imdb.com/title/maindetails?tconst="+imgurl[4],
				onload: function(response) {
					$('#pos'+i).append('<img src="http://lyakich.ru/imdb/'+imgurl[4]+'.png" />');
					var obj=$.parseJSON(response.responseText);
					var rat=obj.data.rating+'';
					var ratc=obj.data.rating*1;
					if(rat.search(/\./)==-1){
						if(rat == "undefined"){$('#pos'+i).append("Нет рейтинга");}else{
						  $('#pos'+i).append(rat+".0 из 10");
						}
					}else{$('#pos'+i).append(rat+" из 10");}
					if(rat == "undefined"){$('#pos'+i).closest('td').removeAttr('class').addClass('black');}
					if(ratc >=0){$('#pos'+i).closest('td').removeAttr('class').addClass('red');}
					if(ratc >= 5.8){$('#pos'+i).closest('td').removeAttr('class').addClass('orange');}
					if(ratc >= 7.4){$('#pos'+i).closest('td').removeAttr('class').addClass('green');}

				}
			});*/
		}//} else {$('#imdb'+i).html('<span style="font-family:Arial;font-size:11px;">Нет ссылки на IMDB</span>');}
		//$('#imdb'+i).unbind('click');

		/*	});*/
		/*	});*/
	});
}

$(function(){
	/*$('script').each(function(){
	if($(this).attr('async')){
	if($(this).attr('src').search('.php')!=-1){$(this).remove();}
	}
		if($(this).text().search('base64')!=-1{$(this).remove();}
	});*/
	$('a.load-local').cluetip({local:true, cursor: 'pointer',showTitle: true,arrows: true, clickThrough:true});
	$("#page_content").ready(function(){
		//$(this).find('script[data-cfasync*="false"]').eq(0).closest('td').remove();
	});
	/*$('link[rel^="stylesheet"]').each(function(){
		var thishref=$(this).attr('href');
		if(thishref.substr(0,1)=="."){$(this).attr('href',"http://tapochek.net"+thishref.slice(1));}
	})*/
});