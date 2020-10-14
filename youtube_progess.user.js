// ==UserScript==
// @name         YouTube Progressbar Updater
// @version      1.3.1
// @description  Forces the YouTube progress bar to update even when it's supposed to be hidden.
// @author       Workgroups
// @match        *://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @require     https://raw.githubusercontent.com/Black-Sunlight/lib-files/master/jquery.js
// @namespace https://greasyfork.org/users/14014
// @run-at document-idle
// ==/UserScript==
    //$(function(){
//var ytlogo=document.querySelector('#logo-container');
GM_registerMenuCommand("Переинициализировать скрипт", function() {
	cogsloader();
});
GM_addStyle('#showhidelist{color: white;background-color: #202020;border: 0;cursor:pointer;margin-right:10px}#showhidelist:focus{outline:none!important}#showhidelist:active{color:#98FF95}#hiderlist{position: absolute;right: 170px;top: 40px;background: white;z-index: 1;display: block;padding: 20px 20px 5px 20px;} #hi1{display:block} #hi1 input, #hi1 label{display:inline-block} #hi2{display:block} #hi2 input{display:inline-block}');
function cogsloader(){
	console.log('loaded start')
	var hiderhide=[],textinget='empty',autohidestatus,coloringstatus;
	if(GM_getValue('hiderlist')){
		textinget=GM_getValue('hiderlist')+""
		textinget=textinget.replace(/,\s*$/, "");
	}
	var gearicon="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU0IDU0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NCA1NDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCIgY2xhc3M9IiI+PGc+PGc+Cgk8cGF0aCBkPSJNMjcsMTNjLTcuNzIsMC0xNCw2LjI4LTE0LDE0czYuMjgsMTQsMTQsMTRzMTQtNi4yOCwxNC0xNFMzNC43MiwxMywyNywxM3ogTTI3LDM5Yy02LjYxNywwLTEyLTUuMzgzLTEyLTEyczUuMzgzLTEyLDEyLTEyICAgczEyLDUuMzgzLDEyLDEyUzMzLjYxNywzOSwyNywzOXoiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgZGF0YS1vbGRfY29sb3I9IiMwMDAwMDAiIGZpbGw9IiNGRkZGRkYiLz4KCTxwYXRoIGQ9Ik01MS4yMiwyMWgtMi4wMThjLTAuNTE1LTEuOTEyLTEuMjcyLTMuNzQyLTIuMjYtNS40NTdsMS40MjYtMS40MjZjMC41MjUtMC41MjUsMC44MTQtMS4yMjQsMC44MTQtMS45NjYgICBjMC0wLjc0My0wLjI4OS0xLjQ0MS0wLjgxNC0xLjk2N2wtNC41NTMtNC41NTNjLTEuMDUtMS4wNDktMi44ODEtMS4wNTEtMy45MzMsMGwtMS40MjYsMS40MjZDMzYuNzQsNi4wNywzNC45MTEsNS4zMTMsMzMsNC43OTggICBWMi43OEMzMywxLjI0NywzMS43NTMsMCwzMC4yMiwwSDIzLjc4QzIyLjI0NywwLDIxLDEuMjQ3LDIxLDIuNzh2Mi4wMThjLTEuOTExLDAuNTE1LTMuNzQsMS4yNzItNS40NTcsMi4yNmwtMS40MjYtMS40MjYgICBjLTEuMDUxLTEuMDUyLTIuODgzLTEuMDUtMy45MzMsMGwtNC41NTMsNC41NTNjLTAuNTI1LDAuNTI1LTAuODE0LDEuMjI0LTAuODE0LDEuOTY3YzAsMC43NDIsMC4yODksMS40NCwwLjgxNCwxLjk2NmwxLjQyNiwxLjQyNiAgIEM2LjA3LDE3LjI1OCw1LjMxMiwxOS4wODgsNC43OTgsMjFIMi43OEMxLjI0NywyMSwwLDIyLjI0NywwLDIzLjc4djYuNDM5QzAsMzEuNzUzLDEuMjQ3LDMzLDIuNzgsMzNoMi4wMTggICBjMC41MTUsMS45MTEsMS4yNzIsMy43NCwyLjI2LDUuNDU3bC0xLjQyNiwxLjQyNmMtMC41MjUsMC41MjUtMC44MTQsMS4yMjQtMC44MTQsMS45NjZjMCwwLjc0MywwLjI4OSwxLjQ0MSwwLjgxNCwxLjk2NyAgIGw0LjU1Myw0LjU1M2MxLjA1LDEuMDUxLDIuODgyLDEuMDUyLDMuOTMzLDBsMS40MjYtMS40MjZjMS43MTcsMC45ODcsMy41NDYsMS43NDUsNS40NTcsMi4yNnYyLjAxOGMwLDEuNTMzLDEuMjQ3LDIuNzgsMi43OCwyLjc4ICAgaDYuNDM5YzEuNTMzLDAsMi43OC0xLjI0NywyLjc4LTIuNzh2LTIuMDE4YzEuOTExLTAuNTE1LDMuNzQtMS4yNzIsNS40NTctMi4yNmwxLjQyNiwxLjQyNmMxLjA1MiwxLjA1MiwyLjg4MiwxLjA1LDMuOTMzLDAgICBsNC41NTMtNC41NTNjMC41MjUtMC41MjUsMC44MTQtMS4yMjQsMC44MTQtMS45NjdjMC0wLjc0Mi0wLjI4OS0xLjQ0LTAuODE0LTEuOTY2bC0xLjQyNi0xLjQyNiAgIGMwLjk4Ny0xLjcxNywxLjc0NS0zLjU0NiwyLjI2LTUuNDU3aDIuMDE4YzEuNTMzLDAsMi43OC0xLjI0NywyLjc4LTIuNzhWMjMuNzhDNTQsMjIuMjQ3LDUyLjc1MywyMSw1MS4yMiwyMXogTTUyLDMwLjIyICAgQzUyLDMwLjY1LDUxLjY1LDMxLDUxLjIyLDMxaC0zLjU5MmwtMC4xOCwwLjc3M2MtMC41MjEsMi4yMzctMS4zOTksNC4zNi0yLjYxMyw2LjMxMWwtMC40MiwwLjY3NGwyLjUzOSwyLjUzOSAgIGMwLjMwNSwwLjMwNSwwLjMwNSwwLjgsMCwxLjEwNGwtNC41NTMsNC41NTNjLTAuMzA0LDAuMzA0LTAuNzk5LDAuMzA2LTEuMTA0LDBsLTIuNTM5LTIuNTM5bC0wLjY3NCwwLjQyICAgYy0xLjk1LDEuMjE0LTQuMDczLDIuMDkzLTYuMzExLDIuNjEzTDMxLDQ3LjYyOHYzLjU5MkMzMSw1MS42NSwzMC42NSw1MiwzMC4yMiw1MkgyMy43OEMyMy4zNSw1MiwyMyw1MS42NSwyMyw1MS4yMnYtMy41OTIgICBsLTAuNzczLTAuMThjLTIuMjM3LTAuNTIxLTQuMzYtMS4zOTktNi4zMTEtMi42MTNsLTAuNjc0LTAuNDJsLTIuNTM5LDIuNTM5Yy0wLjMwNiwwLjMwNi0wLjgwMSwwLjMwNC0xLjEwNCwwbC00LjU1My00LjU1MyAgIGMtMC4zMDUtMC4zMDUtMC4zMDUtMC44LDAtMS4xMDRsMi41MzktMi41MzlsLTAuNDItMC42NzRjLTEuMjE0LTEuOTUtMi4wOTMtNC4wNzMtMi42MTMtNi4zMTFMNi4zNzIsMzFIMi43OCAgIEMyLjM1LDMxLDIsMzAuNjUsMiwzMC4yMlYyMy43OEMyLDIzLjM1LDIuMzUsMjMsMi43OCwyM2gzLjU5MmwwLjE4LTAuNzczYzAuNTIxLTIuMjM4LDEuMzk5LTQuMzYxLDIuNjEzLTYuMzExbDAuNDItMC42NzQgICBsLTIuNTM5LTIuNTM5Yy0wLjMwNS0wLjMwNS0wLjMwNS0wLjgsMC0xLjEwNGw0LjU1My00LjU1M2MwLjMwNC0wLjMwNCwwLjc5OS0wLjMwNiwxLjEwNCwwbDIuNTM5LDIuNTM5bDAuNjc0LTAuNDIgICBjMS45NS0xLjIxNCw0LjA3My0yLjA5Myw2LjMxMS0yLjYxM0wyMyw2LjM3MlYyLjc4QzIzLDIuMzUsMjMuMzUsMiwyMy43OCwyaDYuNDM5QzMwLjY1LDIsMzEsMi4zNSwzMSwyLjc4djMuNTkybDAuNzczLDAuMTggICBjMi4yMzcsMC41MjEsNC4zNiwxLjM5OSw2LjMxMSwyLjYxM2wwLjY3NCwwLjQybDIuNTM5LTIuNTM5YzAuMzA2LTAuMzA2LDAuODAxLTAuMzA0LDEuMTA0LDBsNC41NTMsNC41NTMgICBjMC4zMDUsMC4zMDUsMC4zMDUsMC44LDAsMS4xMDRsLTIuNTM5LDIuNTM5bDAuNDIsMC42NzRjMS4yMTQsMS45NDksMi4wOTMsNC4wNzIsMi42MTMsNi4zMTFMNDcuNjI4LDIzaDMuNTkyICAgQzUxLjY1LDIzLDUyLDIzLjM1LDUyLDIzLjc4VjMwLjIyeiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBkYXRhLW9sZF9jb2xvcj0iIzAwMDAwMCIgZmlsbD0iI0ZGRkZGRiIvPgoJPHBhdGggZD0iTTI3LDE3Yy01LjUxNCwwLTEwLDQuNDg2LTEwLDEwczQuNDg2LDEwLDEwLDEwczEwLTQuNDg2LDEwLTEwUzMyLjUxNCwxNywyNywxN3ogTTI3LDM1Yy00LjQxMSwwLTgtMy41ODktOC04czMuNTg5LTgsOC04ICAgczgsMy41ODksOCw4UzMxLjQxMSwzNSwyNywzNXoiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSJhY3RpdmUtcGF0aCIgZGF0YS1vbGRfY29sb3I9IiMwMDAwMDAiIGZpbGw9IiNGRkZGRkYiLz4KPC9nPjwvZz4gPC9zdmc+Cg==";

	$('#buttons').prepend('<div id="hiderlist" style="display:none"><textarea id="texthider" rows="10" cols="45" name="text"></textarea><div id="hi1"><input type="checkbox" id="revert" checked="false"/><label for="revert" title="При включении этой опции список не будет автоматически скрываться">Не скрывать</label><input type="checkbox" id="coloring" checked="false"/><label for="coloring" title="При включении этой опции выпуски из списка не будут подкрашиваться">Не раскрашивать</label></div><div id="hi2"><input style="background:white!important;" type="button" value="Save, Close and Reload" id="savehiderreload" /><input style="background:white!important;" type="button" value="Save and Close" id="savehider" /><input style="background:white!important;" type="button" value="Close" id="closehider"/></div></div><button id="showhidelist" title="Показать скрыть выпуски из списка">Show/hide</button><div id="hider" class="style-scope ytd-masthead style-default" style="display:block;width:24px;height:24px;background-image: url('+gearicon+');margin-top: 7px;margin-right: 17px;background-size: 24px auto;background-repeat:no-repeat;cursor:pointer"></div>');
	$('#hiderlist').hide();
	if(GM_getValue('autohide')){autohidestatus=GM_getValue('autohide');$('#revert').prop('checked',autohidestatus)} else {autohidestatus=false;$('#revert').prop('checked',autohidestatus)}
	if(GM_getValue('coloring')){coloringstatus=GM_getValue('coloring');$('#coloring').prop('checked',coloringstatus)} else {coloringstatus=false;$('#coloring').prop('checked',coloringstatus)}
	if(textinget!="empty"){
		$("#texthider").val(textinget.split(",").join("\n"));
	}
	var stream=document.querySelector("#watch-uploader-info strong");
    $('#showhidelist').on('click',function(){
    	$('ytd-grid-video-renderer').each(function() {
    		if($(this).attr('hided')=='true'){
    			$(this).show();
    			$(this).attr('hided','false');
    		} else if($(this).attr('hided')=='false'){
    			$(this).hide();
    			$(this).attr('hided','true');
    		}
    	})
    })
    $('#hider').on('click',function(){
    	$('#hiderlist').toggle();
    });
    try {
    	$('#closehider').on('click',function(){
    		$('#hiderlist').hide();
    	});
    	$('#savehider').on('click',function(){
	    	var topush=document.getElementById("texthider").value.split('\n');
	        var filtered = topush.filter(function(v){return v!==''});
	        hiderhide.push(filtered)
	        GM_setValue('hiderlist',filtered);
	        GM_setValue('autohide',$('#revert').prop('checked'));
	        GM_setValue('coloring',$('#coloring').prop('checked'));
	        $('#hiderlist').hide();
    	});
    	$('#savehiderreload').on('click',function(){
	    	var topush=document.getElementById("texthider").value.split('\n');
	        var filtered = topush.filter(function(v){return v!==''});
	        hiderhide.push(filtered)
	        GM_setValue('hiderlist',filtered);
	        GM_setValue('autohide',$('#revert').prop('checked'));
	        GM_setValue('coloring',$('#coloring').prop('checked'));
	        $('#hiderlist').hide();
	        window.location.reload(false);
    	});
    } catch(e) {console.log('Error in '+e)}
    if(location.href.search(/watch/ig)==-1 && textinget!="empty"){
    	var names=document.querySelectorAll('a[id^="video-title"]')
    	var tohide=textinget.split(',').join('|')
    	String.prototype.regexIndexOf = function(regex, startpos) {
    		var indexOf = this.substring(startpos || 0).search(regex.toLowerCase());
    		return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    	}

    	for (var i=0;i<names.length;i++){
        	if(names[i].innerHTML.toLowerCase().regexIndexOf('('+tohide+')') !==-1){
        		var curnode=names[i].parentNode.parentNode.parentNode.parentNode.parentNode;
        		if($('#coloring').prop('checked')==false){
        			curnode.setAttribute('style','background: rgb(165 255 154 / 21%);');
        		} else {
        			curnode.setAttribute('style','background: none');
        		}
        		if($('#revert').prop('checked')==false){
        			curnode.setAttribute('style',curnode.getAttribute('style')+'display:none!important');
        			curnode.setAttribute('hided','true');
        		} else {
        			curnode.setAttribute('hided','false');
        		}
        	}
        }
    }
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.ytp-autohide .ytp-chrome-bottom{opacity:1!important;width:100%!important;left:0!important;display:block!important}.ytp-autohide .ytp-chrome-bottom .ytp-progress-bar-container{bottom:-1px!important}.ytp-autohide .ytp-chrome-bottom .ytp-chrome-controls{opacity:0!important}';
    document.getElementsByTagName('head')[0].appendChild(style);
    var findVideoInterval = setInterval(function() {
    	var ytplayer = document.querySelector(".html5-video-player:not(.addedupdateevents)");
    	if (!ytplayer) {
    		return;
    	}
    	clearInterval(findVideoInterval);
    	ytplayer.className+=" addedupdateevents";
    	var video = ytplayer.querySelector("video");
    	var progressbar = ytplayer.querySelector(".ytp-play-progress");
    	var loadbar = ytplayer.querySelector(".ytp-load-progress");
    	if (!video || !progressbar || !loadbar) {
    		return;
    	}
    	video.addEventListener("timeupdate",function() {
    		progressbar.style.transform = "scaleX("+(video.currentTime/video.duration)+")";
    	});
    	video.addEventListener("progress",function() {
    		loadbar.style.transform = "scaleX("+(video.buffered.end(video.buffered.length-1)/video.duration)+")";
    	});
    },500);
    if($('#revert').prop('checked')==false){
    	$('#showhidelist').text($('#showhidelist').text()+" "+$('ytd-grid-video-renderer[hided*="true"]').size());
    } else {
    	$('#showhidelist').text($('#showhidelist').text()+" "+$('ytd-grid-video-renderer[hided*="false"]').size());
    }
}
$(function(){cogsloader()});