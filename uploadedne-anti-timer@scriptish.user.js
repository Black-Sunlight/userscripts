// ==UserScript==
// @id             uploaded.net-8c688a90-3234-449c-877e-13d1842f7df7@scriptish
// @name           Uploaded.net anti timer
// @version        0.9c
// @history        0.9b Beta version
// @namespace      https://openuserjs.org/scripts/Black_Sun/anti_timer
// @author         Black_Sun
// @include        http://uploaded.net/file/*
// @unwrap
// @run-at         document-end
// @grant none
// @updateURL https://openuserjs.org/install/Black_Sun/anti_timer.user.js
// @downloadURL https://openuserjs.org/install/Black_Sun/anti_timer.user.js
// ==/UserScript==


loadXMLDoc()
Download.freeslot=true;
Download.captcha(true);





function loadXMLDoc() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
           if(xmlhttp.status == 200){
               document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
           }
           else if(xmlhttp.status == 400) {
              alert('There was an error 400')
           }
           else {
               alert('something else other than 200 was returned')
           }
        }
    }
    xmlhttp.open("POST", "/io/ticket/slot/"+location.href.split("/")[4], true);
	xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xmlhttp.send("z=1");
}