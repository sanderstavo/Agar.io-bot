// ==UserScript==
// @name         EvoNetwork Agar Bots
// @namespace    Copyright Â© evonetwork.net
// @version      0.2
// @description  Bots for agar.io
// @author       Varedz
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @match        *://agar.io/*
// @run-at       document-start
// @grant        none
// @downloadURL http://www.evonetwork.net/userscript.js
// @updateURL http://www.evonetwork.net/userscript.js
// ==/UserScript==

var $ = window.jQuery;
window.xt = false;
window.serverReady = false;
window.botmodeChange = false;
window.botmode = 0;
window.leaderBoard = {};
window.clientname = null;
window.ab = false;
window.ServerSwitching = false;
window.CurrentServerPlaying = null;
var waitUntilLoaded = null;
waitUntilLoaded = setInterval(function() {
    if($('#chv2_main-container').length > 0) {
        console.log("Loaded ext");
        refresh();
        clearInterval(waitUntilLoaded);
    }
}, 200);
setInterval(function(){
    if (window.CurrentServerPlaying != null && window.client.currentServer != window.CurrentServerPlaying)
    {
        window.client._ws.close();
        window.ServerSwitching = true;
        window.CurrentServerPlaying = window.client.currentServer;
        window.botmodeChange = false;
    }
},70);
setInterval(function(){
    if($('#mainui-app').css('display') == 'block') {
          var nameIG = document.querySelector('#nick') !== null;
          if (nameIG)
          {
              window.clientname = document.querySelectorAll('#nick')[0].value;
          }
    }
},50);
setInterval(function() {
        //Search if party is on
        if($('#overlays').css('display') == 'block') {
            freezeOwnCell(false);
        }
},1000);
var percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];
var getColorForPercentage = function(pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
}
var refresh = function(){
            if($('#chv2_main-container').length == 2) {
                return;
            }
    		var t = window.client.lastmessage;
    		if(t == undefined)
            {
    			return;
            }
    		if(t.nope){
                window.serverReady = true;
                var htmlAppend = '';
                htmlAppend = '<div class="chv2_expire_pkgexp chv2_expire"><p>No active plan</p></div>';
                htmlAppend += '<div class="chv2_expire_chgip chv2_expire"><p><a href="http://evonetwork.net" target="_blank"><b>Active plan ?</b><br>change your ip !</a></p></div>';
                document.getElementById('chv2_main-container').innerHTML = htmlAppend;
    		} else if(t.alreadyConnected){
                window.serverReady = true;
                htmlAppend = '';
                htmlAppend = '<div class="chv2_expire_pkgexp chv2_expire"><p>Already on another game (refresh page)</p></div>';
                htmlAppend += '<div class="chv2_expire_chgip chv2_expire"><p><a href="http://evonetwork.net" target="_blank"><b>Active plan ?</b><br>change your ip !</a></p></div>';
                document.getElementById('chv2_main-container').innerHTML = htmlAppend;
    		} else if(t.special != undefined){
                var evonetwork = "Out Of Time! Get more time from evonetwork.net!";
                window.serverReady = true;
                htmlAppend = '';
                htmlAppend = '<div class="chv2_expire_pkgexp chv2_expire"><p>'+evonetwork+'</p></div>';
                htmlAppend += '<div class="chv2_expire_chgip chv2_expire"><p>'+evonetwork+'</p></div>';
                document.getElementById('chv2_main-container').innerHTML = htmlAppend;
    		} else{
                if(window.loadingset == undefined)
                {
                htmlAppend = '';
                htmlAppend += '<div class="chv2_active_botsnb chv2_active"><p id="chv2_active_botsnb_ok">Bots: <span id="chv2_numeric_bot_load">'+t.currentBots+'</span> / '+t.maxBots+'<br><span class="chv2_small">bots alive<span id="chv2_agario_srvfull"></span></span>';
                htmlAppend += '<span style="width: 0%;" id="chv2_bot_load"></span>';
                htmlAppend += '<p id="chv2_active_botsnb_ko" style="background-color: rgba(255,0,0,0.5);display: none;padding-top: 12px;"></p>';
                htmlAppend += '</div>';
                htmlAppend += '<div class="chv2_active_followcmd chv2_active"><p style="">Split<br><span class="chv2_small">Key: X</span></p></div>';
                htmlAppend += '<div class="chv2_active_speedcmd chv2_active"><p style="">Feed<br><span class="chv2_small">Key: C</span></p></div>';
                htmlAppend += '<div class="chv2_active_randomcmd chv2_active"><p style="">Freeze<br><span class="chv2_small">key: V</span></p></div>';
                htmlAppend += '<div class="chv2_active_botmode chv2_active"><p style=""><span id="botmode">NORMAL</span><br><span class="chv2_small">Key: <span class="KEYBINDING_BOT_MODE">M</span> (mode)</span></p></div>';
                htmlAppend += '<div class="chv2_active_expire chv2_active"><p><span id="chv2_expire_time"></span>';
                htmlAppend += '<br><span class="chv2_small">Remain time</span> </p></div>';
                    document.getElementById('chv2_main-container').innerHTML = htmlAppend;
                    window.loadingset = true;
                    window.expire = t.expire;
                    var expire = new Date(t.expire);
                }
                else
                {
                    $('#chv2_active_botsnb_ok').html('Bots: <span id="chv2_numeric_bot_load">'+t.currentBots+'</span> / '+t.maxBots+'<br><span class="chv2_small">bots alive<span id="chv2_agario_srvfull"></span></span><span style="width: 0%;" id="chv2_bot_load"></span>');
                    var botLoadPct = Math.floor((t.currentBots / t.maxBots) * 100);
                    $('#chv2_bot_load').css('width', botLoadPct+'%');
                    $('#chv2_bot_load').css('background-color', getColorForPercentage(botLoadPct/100));
                }
    		}
    		showRemaining();
};
    	var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;
        var _day = _hour * 24;
    	function showRemaining() {
    		if(document.getElementById('chv2_expire_time') == undefined)
            {
    			return;
            }
    		if(window.expire == undefined || window.expire == 0)
            {
    			return;
            }
    		var now = new Date();
            var distance = new Date(window.expire) - now;
            if (distance < 0) {
                document.getElementById('chv2_expire_time').innerHTML = 'EXPIRED!';
                return;
            }
            var days = Math.floor(distance / _day);
            var hours = Math.floor((distance % _day) / _hour);
            var minutes = Math.floor((distance % _hour) / _minute);
            var seconds = Math.floor((distance % _minute) / _second);
            document.getElementById('chv2_expire_time').innerHTML = days + 'days ';
            document.getElementById('chv2_expire_time').innerHTML += hours + 'hrs ';
            document.getElementById('chv2_expire_time').innerHTML += minutes + 'mins ';
            document.getElementById('chv2_expire_time').innerHTML += seconds + 'secs';
}
var timer = setInterval(function(){
   showRemaining();
},1000);
setInterval(function()
{
        if (CanvasRenderingContext2D.prototype.v18_fillText == undefined)
        {
            CanvasRenderingContext2D.prototype.v18_fillText = CanvasRenderingContext2D.prototype.fillText;
            setInterval(function(){
                CanvasRenderingContext2D.prototype.fillText = function() {
                    this.v18_fillText.apply(this, arguments);
                    if(arguments[0] == "Leaderboard") {
                        window.leaderBoard = {};
                    }
                    if(parseInt(arguments[0].substr(0, 1)) > 0 && parseInt(arguments[0].substr(0, 1)) <= 9 && arguments[0].substr(1, 1) == '.') {
                        window.leaderBoard[parseInt(arguments[0].substr(0, 1))] = arguments[0].substr(2).trim();
                    } else if(parseInt(arguments[0].substr(0, 2)) == 10 && arguments[0].substr(2, 1) == '.') {
                        window.leaderBoard[10] = arguments[0].substr(3).trim();
                    }
                }
                if (window.xt)
                    {
                	    var e = {};
                        e.action = 4;
                        e.leaderBoard = window.leaderBoard;
                        window.client._ws.send(JSON.stringify(e));
                    }
            }, 1000);
        }
},1000);
class GUITweaker {
	constructor() {
		this.removeStartupBackground();
		this.removeElements();
        this.addGUI();
		this.addBotGUI();
        this.addsetNick();
	}

	removeStartupBackground() {
		const oldEvt = CanvasRenderingContext2D.prototype.drawImage;
		CanvasRenderingContext2D.prototype.drawImage = function (a) {
			if (a.src && a.src == 'https://agar.io/img/background.png') return;
			oldEvt.apply(this, arguments);
		};
	}
    addsetNick()
    {
       if(typeof(window.core) != 'undefined' && typeof(window.MC.onPlayerSpawn) != 'undefined'&& typeof(window.MC._onPlayerSpawn) == 'undefined') {
            window.MC._onPlayerSpawn = window.MC.onPlayerSpawn;
            window.MC.onPlayerSpawn = function()
                 {
                      if (window.xt)
                      {
                          window.botmodeChange = true;
                          window.CurrentServerPlaying = window.client.currentServer;
                          var e = {};
                          e.action = 1;
                          e.clientname = window.clientname;
                          e.targetIp = window.client.currentServer;
                          e.ao = window.ao;
                          if (window.client.currentServer.indexOf("?party_id=") !== -1)
                          {
                              e.targetRoom = "#8LAWM8";
                          }
                          else
                          {
                             e.targetRoom = "";
                          }
                          window.client._ws.send(JSON.stringify(e));
                          e = {};
                          e.action = 3;
                          window.client._ws.send(JSON.stringify(e));
                          console.log("PlayerSpawn");
                          window.MC.onPlayerSpawn;
                      }
                 }
           }
    }
	removeElements() {
		$('#advertisement').remove();
		$('#bannerCarousel').remove();
	}
addBotGUI() {
        //Generate static map grid
        var htmlToInject = '';
        htmlToInject += '<div id="chv2_staticmap" style="">';
        var gridAlphabet = ['A', 'B', 'C', 'D', 'E', 'F'];
        for(var mapX = 0;mapX < 6; mapX++) {
            for(var mapY = 1;mapY<7;mapY++) {
                htmlToInject += '<div class="grid">'+gridAlphabet[mapX]+mapY+' </div>';
            }
        }
        htmlToInject += '<div class="presshelp">press A to hide</div>';
        htmlToInject += '<div id="pointer"></div>';
        htmlToInject += '<div id="pointer2"></div>';
        htmlToInject += '</div>';
        htmlToInject += '<div id="chv2_staticmaphide">press A to show</div>';
        htmlToInject += '<div id="chv2_freeze_mouse_overlay" style="width: 100%;height: 100%;top:0;left:0;position: fixed;z-index: 199;display: none;"></div>';
        var cLCOMdiv = document.createElement("div");
        cLCOMdiv.innerHTML = htmlToInject;
        document.getElementsByTagName('body')[0].appendChild(cLCOMdiv);
	}
addGUI() {
    $('body').append(`
<style>
#chithercomUI2 {
    font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
    height: 50px!important;
    background-color: rgba(20,20,20, 0.2);
    position: fixed;
    top: 0;
	width: calc(100% - 20%);
    left: 0px;
    z-index: 9999999;
    color: #dddddd!important;
    font-size: 14px!important;
    text-align: left!important;
    line-height: 18px!important;
    box-sizing: border-box;
	display: inline-flex;
}
#chithercomUI2 .chv2_logo {
    cursor: pointer;
    text-transform: uppercase;
    width: 110px;
    height: 33px;
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    margin-right: 10px;
	margin-top: 7px;
}
#chithercomUI2 .chv2_logo_free {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAyCAYAAAC+jCIaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5M0VFQUIxN0M5MTZFNjExOTZFRTg0QjYxMUJDNjg1QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4MjZCRjU4RDFGOTgxMUU2QTU4NTk5QUQ0RDgwNzlBOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4MjZCRjU4QzFGOTgxMUU2QTU4NTk5QUQ0RDgwNzlBOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpERTIwMDM5Rjk3MUZFNjExOUQ5Rjk3OTAyRTFGRTcyMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5M0VFQUIxN0M5MTZFNjExOTZFRTg0QjYxMUJDNjg1QiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlgpdkgAAALJSURBVHja7JzxkeIgFIejYwO2wJXglZAtYbeEWIJXgpagJWxK0BLOEkwLqeAmhzM4w72FBKKB7Nz3zbx/BAThx3sPknHRdV0B8GqWTAEgLEBYgLAAEBYgLEBYAAgLEBYgLACEBQgLEBZAEmHd33xwWKXt3P1LZcqU+Pwm2h5F+U6USx6f77owlKefyvou1dOPq23XM2bVU+8+R+9y/v4XVhF119o+tZWOsg179AulsVrbBx7Lz9kjKujnXdveW/pncdPWDdhOW2Gsr/7N1FVWfWmx/YW3GSGsPV7pKXbG40+NMmt1M33O2mOp3IP8RjTa9BYvto6yKvFY9sZbzlZYrgm5avtpJtE3ka/kYPV1EWVbq6yZoG/7+xdmLEOcTG4lc9TUHDP1GyQsqfpW25sRF/i5jhTWRQh5SMyP+h9mbWSf5Yv7C2ozJCxlTHqPFt0EnaJTUnsEoebosZRHrTHJZGdZlWmRj9YYbgnaVo68tEnwO2cTRVaRwmoJgUEbyedRcnjJJsdExD7SIQSOD1OhC1wKLx/qJV33ZW1AhBnT32CbFWueJDxNeWoue7xktnw41mOt0UkvjcMzbTMt7iHwaiSLsBqHsNaRE20fSU+Zfqd9F/Vj4ra1I0RN7RFbx7z/yrnDlgGDdp14wM/lSWHJO6IhMbeODasi+o3tL6jNMmDQV4ewCIn9k96KRZ76Oetpbg4gJMeqHbvhbE3WPXnkWWL/Qk8dDhuHpyyLTJejY4VVGFH9NqeRc84fkICjOFqHbKKrY5FTXGkUiQX9lLCyJ4LfkFqEw02icCiT+JBNIO+kQjbPYJvQ64ZDwY37sx4khdc6OE7xWXKtmHustyLuOSFJfPqwNJtwGCOsx+syWzFpLYILOh1uEuSiviQ++du/C/6DFHJ7LACEBQgLEBYAwgKEBQgLAGEBwgKEBYCwAGEBwgLo5a8AAwCTLhdsLUxn1gAAAABJRU5ErkJggg==')!important;
}
#chithercomUI2 a {
    color: #66e48c!important;
    text-decoration: none!important;
}
#chithercomUI2 br {
    display: block!important;
    height: 0!important;
    margin: 0px 0!important;
}
#chithercomUI2 .small {
    font-size: 12px!important;
    color: #cccccc;
}
#chv2_main-container {
    height: 50px;
    width: calc(100% - 215px);
    box-sizing: content-box!important;
    display: inline-block;
    vertical-align: top;
}
.chv2_signletext {
    text-align: center;
    margin-top: 13px!important;
}
#chithercomUI2 .chv2_expire {
    width: 32%;
    height: 50px;
    display: inline-block;
    text-align: center;
    vertical-align: top;
    box-sizing: border-box;
    font-size: 15px;
}
#chithercomUI2 .chv2_expire p {
    line-height: 20px;
    margin-top: 6px;
}
#chithercomUI2 .chv2_expire p b {
    font-size: 20px;
}
#chithercomUI2 .chv2_expire_pkgexp p {
    margin-top: 9px;
    display: block;
    background-color: rgba(255, 0, 0, 0.5);
    border-radius: 4px;
    padding: 6px;
    font-size: 18px;
}
#chithercomUI2 .chv2_active {
    text-align: center;
    height: 50px;
    display: inline-block;
    vertical-align: top;

}
#chithercomUI2 .chv2_active_botsnb {
    width: 20%;
}
#chithercomUI2 .chv2_active_expire {
	width: 32%;
}

#chithercomUI2 .chv2_active_botmode,
#chithercomUI2 .chv2_active_followcmd,
#chithercomUI2 .chv2_active_speedcmd,
#chithercomUI2 .chv2_active_randomcmd {
    width: 12%;
}

#chithercomUI2 .chv2_active p {
    background-color: rgba(0,0,0, 0.5);
    border-radius: 4px;
    display: block;
    height: 40px;
    margin-top: 5px;
    margin-left: 2.5px;
    margin-right: 2.5px;
    margin-bottom: 0;
    font-size: 17px;
    line-height: 16px;
    padding-top: 4px;
    box-sizing: border-box;
    position: relative;
}
#chithercomUI2 .chv2_active p .chv2_small {
    font-size: 12px;
}

#chithercomUI2 #chv2_bot_load {
    position: relative;
    bottom: -2px;
    left: 0px;
    width: 0%;
    height: 2px;
    background-color: #00ff00;
    display: block;
    border-radius: 4px;
    -webkit-transition: width 2s;
    -moz-transition: width 2s;
    -o-transition: width 2s;
    transition: width 2s;
}

#chithercomUI2 #chv2_message_container {
    height: 22px;
    position: relative;
    bottom: 0;
    color: #dddddd;
    font-size: 14px;
    text-align: center;
    background-color: rgba(20,20,20, 0.8);
    border-radius: 4px;
    display: none;
}
#chithercomUI2 #chv2_message_container p {
    margin-top: -6px;
}

#chv2_staticmap {
    width: 150px;
    height: 170px;
    background-color: rgba(0,0,0, 0.5);
    position: fixed;
    bottom: 5px;
    right: 10px;
    color: rgba(255, 255, 255, 0.5);
    overflow: hidden;
    line-height: 0;
    z-index: 100;
}
#chv2_staticmap .grid {
    display: inline-block;
    width: 25px;
    height: 25px;
    border: 1px solid;
    border-color: rgba(255, 255, 255, 0.5);
    text-align: center;
    padding-top: 10px;
    font-size: 10px;
    margin: 0!important;
    box-sizing: border-box;
    margin-top: -100px;
}
#chv2_staticmap .presshelp {
    text-align: center;
    line-height: 20px;
    font-size: 12px;
}
#chv2_staticmap #pointer {
    background-color: #ff0000;
    position: absolute;
    top: calc(75px - 5px);
    left: calc(75px - 5px);
    width: 10px;
    height: 10px;
    border-radius: 10px;
}
#chv2_staticmap #pointer2 {
    background-color: #ffff00;
    position: absolute;
    top: calc(75px - 3px);
    left: calc(75px - 3px);
    width: 6px;
    height: 6px;
    border-radius: 6px;
}
#chv2_staticmaphide {
    text-align: center;
    height: 22px;
    width: 150px;
    color: rgba(255, 255, 255, 0.5);
    position: fixed;
    bottom: 40px;
    right: 10px;
    display: none;
    z-index: 100;
}
#chv2_advert {
    text-align: center;
    background-color: rgba(20, 20, 20, 0.8);
    height: 20px;
    line-height: 21px;
    display: none;
}
#chv2_advert p {
    font-size: 14px;
    margin: 0;
}
#chv2_advert p .red {
    color: #ff0000;
}
#chv2_advert p .orange {
    color: #ffff00;
}
@media screen and (max-width: 1100px) {
        #chv2_staticmap, #chv2_staticmaphide {
        width: 0px;
        height: 0px;
    }
}
</style>
<div id="chithercomUI2">
<a href="http://evonetwork.net/" target="_blank" class="chv2_logo"></a>
<div id="chv2_main-container"><p class="chv2_signletext">Connecting to server...</p></div>
<div id="chv2_message_container"></div>
<div id="chv2_advert"><p></p></div>
</div>
`);
	}
}
class Client {
	constructor(botServerIP) {
        this.lastmessage = null;
		this.botServerIP = botServerIP;
		this._ws = null;
		this.moveInterval = 0;
		this.clientX = 0;
		this.clientY = 0;
        this.mapOffsetX = 0;
        this.mapOffsetY = 0;
        this.mapOffset=7071.0678;
        this.mouseAbsoluteX= 0;
        this.mouseAbsoluteY= 0;
        this.playerAbsoluteX= 0;
        this.playerAbsoluteY = 0;
        this.viewScaleMultiplier = 1;
        this.playerX = 0;
        this.playerY = 0;
		this.currentServer = '';
		this.serverInUse = false;
		this.validated = false;
		this.connect();
		this.addListener();
	}

	connect() { // Connect
		this._ws = new WebSocket(this.botServerIP);
		this._ws.binaryType = 'arraybuffer';
		this._ws.onopen = this.onopen.bind(this);
		this._ws.onmessage = this.onmessage.bind(this);
		this._ws.onclose = this.onclose.bind(this);
		this._ws.onerror = this.onerror.bind(this);
        if($('#chv2_main-container').length > 0) {
                var htmlAppend = '';
                if (window.ServerSwitching == true)
                {
                    htmlAppend = '<p class="chv2_signletext">Switching Agar.io server...</p></div><div id="chv2_message_container"></div><div id="chv2_advert"><p></p>';
                    window.ServerSwitching = false;
                }
                else
                {
                    htmlAppend = '<p class="chv2_signletext">Connecting to server...</p></div><div id="chv2_message_container"></div><div id="chv2_advert"><p></p>';
                }
                document.getElementById('chv2_main-container').innerHTML = htmlAppend;
        }
	}

	onopen() {
        if($('#chv2_main-container').length > 0) {
                var htmlAppend = '';
                htmlAppend = '<p class="chv2_signletext">Authentification...</p></div><div id="chv2_message_container"></div><div id="chv2_advert"><p></p>';
                document.getElementById('chv2_main-container').innerHTML = htmlAppend;
        }
        window.xt = true;
        var e = {};
        e.action = 17;
        e.ver = 'p20';
        this._ws.send(JSON.stringify(e));
		this.startMoveInterval();
    }
	onmessage(msg) {
        this.lastmessage = JSON.parse(msg.data);
        refresh();
	}
	onclose() {
        if(window.loadingset != undefined)
        {
            delete window.loadingset;
        }
        window.xt = false;
		clearInterval(this.moveInterval);
		if (!this.serverInUse && !window.serverReady) setTimeout(this.connect.bind(this), 2000);
	}
	onerror() {
        if($('#chv2_main-container').length > 0) {
                var htmlAppend = '';
                htmlAppend = '<p class="chv2_signletext">Connecting errored with the server...</p></div><div id="chv2_message_container"></div><div id="chv2_advert"><p></p>';
                document.getElementById('chv2_main-container').innerHTML = htmlAppend;
        }
        if(window.loadingset != undefined)
        {
            delete window.loadingset;
        }
        window.xt = false;
	}
	sendMove(xPos, yPos) {
        var e = {}
		e.action = 2;
		e.positionX = xPos;
		e.positionY = yPos;
		this.send(JSON.stringify(e));
	}
    setPrecisionCoords() {
        var mouseX = (( (this.clientX - (window.innerWidth / 2) ) / (window.viewScale / this.viewScaleMultiplier )) + window.playerX);
        var mouseY = (( (this.clientY - (window.innerHeight / 2) ) / (window.viewScale / this.viewScaleMultiplier )) + window.playerY);
        this.playerAbsoluteX = window.playerX + this.mapOffsetX;
        this.playerAbsoluteY = window.playerY + this.mapOffsetY;
        this.mouseAbsoluteX = mouseX + this.mapOffsetX;
        this.mouseAbsoluteY = mouseY + this.mapOffsetY;
        $('#chv2_staticmap #pointer').css('left','calc('+Math.floor(((this.playerAbsoluteX + this.mapOffset) / (this.mapOffset * 2)) * 150)+'px - 5px)');
        $('#chv2_staticmap #pointer').css('top','calc('+Math.floor(((this.playerAbsoluteY + this.mapOffset) / (this.mapOffset * 2)) * 150)+'px - 5px)');
        $('#chv2_staticmap #pointer2').css('left','calc('+Math.floor(((this.mouseAbsoluteX + this.mapOffset) / (this.mapOffset * 2)) * 150)+'px - 3px)');
        $('#chv2_staticmap #pointer2').css('top','calc('+Math.floor(((this.mouseAbsoluteY + this.mapOffset) / (this.mapOffset * 2)) * 150)+'px - 3px)');
    }
	split() {
		if (this._ws != undefined && this._ws.readyState == WebSocket.OPEN) this.send(JSON.stringify({action:16}));
	}
	eject() {
		if (this._ws != undefined && this._ws.readyState == WebSocket.OPEN) this.send(JSON.stringify({action:15}));
	}
	botmode(mode) {
		if (this._ws != undefined && this._ws.readyState == WebSocket.OPEN)
		{
			var e = {};
            e.action = 18;
            e.botmode = mode;
			this.send(JSON.stringify(e));
		}
	}
	startMoveInterval() {
		this.moveInterval = setInterval(() => {
			if (window.playerX && window.playerY && window.coordOffsetFixed && this.clientX && this.clientY)
            {
                this.sendMove(((this.clientX - window.innerWidth / 2) / window.viewScale) + window.playerX, ((this.clientY - window.innerHeight / 2) / window.viewScale) + window.playerY);
            }
		}, 50);
	}
	createBuffer(len) {
		return new DataView(new ArrayBuffer(len));
	}
	send(data) {
		if (this._ws.readyState !== 1) return;
		this._ws.send(data, {
			binary: true
		});
	}
	addListener() {
		document.addEventListener('mousemove', event => {
                this.clientX = event.clientX;
                this.clientY = event.clientY;
		});
	}
}
window.client = new Client('wss://gamesrv.agarbot.ovh:8443');
let check = setInterval(() => {
	if (document.readyState == "complete") {
		clearInterval(check);
		setTimeout(() => {
			new GUITweaker();
		}, 1500);
	}
}, 100);
function freezeOwnCell(freeze) {
    if(freeze) {
        $('.chv2_active_randomcmd p').css('background-color', 'rgba(0,255,0, 0.4)');
        $('#chv2_freeze_mouse_overlay').css('display', 'block');
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("mousemove", true, true, window, 0, Math.floor(window.innerWidth / 2),Math.floor(window.innerHeight / 2),Math.floor(window.innerWidth / 2),Math.floor(window.innerHeight / 2), false, false, false, false, 0, null);
        document.getElementById('canvas').dispatchEvent(evt);
    } else {
        $('.chv2_active_randomcmd p').css('background-color', 'rgba(0,0,0, 0.8)');
        $('#chv2_freeze_mouse_overlay').css('display', 'none');
        evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("mousemove", true, true, window, 0, window.client.clientX, window.client.clientY, window.client.clientX, window.client.clientY, false, false, false, false, 0, null);
        document.getElementById('canvas').dispatchEvent(evt);
    }
}
    var autofeed_clientfeed = false;
    var autofeed_botfeed = false;
    var autofeed_botfeed_firstshot = false;
    var botModePressed = false;
    setInterval(function() {
            if(autofeed_clientfeed == true) {
                try {
                    window.core.eject();
                } catch(e) {}
            }
            if(autofeed_botfeed == true) {
                $('.chv2_active_speedcmd p').css('background-color', 'rgba(0,255,0, 0.4)');
                try {
                    window.client.eject();
                } catch (e) {}
            } else {
                $('.chv2_active_speedcmd p').css('background-color', 'rgba(0, 0,0, 0.8)');
            }
    }, 200);
    //Register key events
    var iCanMove = false;
    var splitPressed = false;
    var freezePressed = false;
    $(document).keyup(function(e){
        if(e.keyCode == 88) {
            splitPressed = false;
        } else if(e.keyCode == 86) {
            if(iCanMove == true) {
                iCanMove = false;
                freezeOwnCell(false);
            } else {
                iCanMove = true;
                freezeOwnCell(true);
            }
        } else if(e.keyCode == 67) {//FEED
            autofeed_botfeed = false;
        } else if(e.keyCode == 65) { //Minimap show / hide
            if($('#chv2_staticmap').css('display') == 'block') {
                $('#chv2_staticmap').css('display', 'none');
                $('#chv2_staticmaphide').css('display', 'block');
            } else {
                $('#chv2_staticmap').css('display', 'block');
                $('#chv2_staticmaphide').css('display', 'none');
            }
        } else if(e.keyCode == 87) { //Autofeed cotÃ© client
            autofeed_clientfeed = false;
        }
        else if(e.keyCode == 77) {
			botModePressed = false;
		}
    });
    $(document).keydown(function(e){ //Press key
        if(e.keyCode == 88) { //SPLIT
            try {
                if(splitPressed == false) {
                    splitPressed = true;
                    window.client.split();
                    $('.chv2_active_followcmd p').css('background-color', 'rgba(0,255,0, 0.4)');
                    setTimeout(function() {
                        $('.chv2_active_followcmd p').css('background-color', 'rgba(0, 0,0, 0.8)');
                    }, 100);
                }
            } catch(osef) {}
        } else if(e.keyCode == 67) { //C = Feed
            autofeed_botfeed = true;
        } else if(e.keyCode == 87) { //Autofeed cotÃ© client
            autofeed_clientfeed = true;
        }
        else if(e.keyCode == 77) {
			if (botModePressed == false && window.botmodeChange == true && window.xt)
			{
				botModePressed = true;
				$('.chv2_active_botmode p').css('background-color', 'rgba(0,255,0, 0.4)');
                    setTimeout(function() {
                        $('.chv2_active_botmode p').css('background-color', 'rgba(0, 0,0, 0.5)');
                }, 100);
				if (window.botmode == 0)
				{
					window.botmode = 1;
					window.client.botmode(1);
					$('#botmode').html('<span id="botmode">MASS X2</span>');
				}
				else if (window.botmode == 1)
				{
					window.botmode = 2;
					window.client.botmode(2);
					$('#botmode').html('<span id="botmode">MASS X4</span>');
				}
				else if (window.botmode == 2)
				{
					window.botmode = 10;
					window.client.botmode(10);
					$('#botmode').html('<span id="botmode">FEEDER</span>');
				}
				else if (window.botmode == 10)
				{
					window.botmode = 0;
					window.client.botmode(0);
					$('#botmode').html('<span id="botmode">NORMAL</span>');
				}
			}
        }
    });
if(window.location.origin == "https://agar.io") {
    var observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (/agario\.core\.js/i.test(node.src)){
                    observer.disconnect();
                    node.parentNode.removeChild(node);
                    var request = new XMLHttpRequest();
                    request.open("get", node.src, true);
                    request.send();
                    request.onload = function(){
                        var coretext = this.responseText;
                        var newscript = document.createElement("script");
                        newscript.type = "text/javascript";
                        newscript.async = true;
                        newscript.textContent = editCore(coretext);
                        document.body.appendChild(newscript);
                        }
                }
            });
        });
    });
    observer.observe(document, {attributes:true, characterData:true, childList:true, subtree:true});
    function editCore(coretext){
        coretext = coretext.replace(/([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i,
                                    '$1 window.viewScale=$2; if (window.coordOffsetFixed) { window.playerX=$4+window.offsetX; window.playerY=$5+window.offsetY;} client.playerX=$4; client.playerY=$5; client.setPrecisionCoords();');
        coretext = coretext.replace(/(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\=\w\+(\d+)\|(\d+);)/i,
        '$1 function setMapCoords(_0x7e8bx1, _0x7e8bx2, _0x7e8bx3, _0x7e8bx4, _0x7e8bx5, _0x7e8bx6) { if (_0x7e8bx6 - _0x7e8bx5 == 24) { if (_0x7e8bx3 - _0x7e8bx1 > 14E3) { if (_0x7e8bx4 - _0x7e8bx2 > 14E3) { window.offsetX = 7071.067811865476 - _0x7e8bx3; window.offsetY = 7071.067811865476 - _0x7e8bx4; window.minX = _0x7e8bx1;window.minY=_0x7e8bx2;window.maxX=_0x7e8bx3;window.maxY=_0x7e8bx4; window.coordOffsetFixed = true; } } } } setMapCoords($3,$5,$7,$9,$2,$8);');
        coretext = coretext.replace(/var (\w)=new WebSocket\((\w\(\w\))\);/, 'window.client.currentServer=$2;window.ab = false;var $1=new WebSocket(window.client.currentServer);');
        coretext = coretext.replace(/c\[h>>2\]=d;d/, 'c\[h>>2\]=d;if(window.ab == false){window.ao = d; window.ab = true;}d');
        coretext = coretext.replace(/;if\((\w)<1\.0\){/i, ';if(0){');
        coretext = coretext.replace(/([\w]+\s*=\s*[\w]+\s*\+\s*16\s*\|\s*0;\s*([\w=]+)\s*=\s*\+[\w\[\s*><\]]+;)/, '$1 $2*=0.75;');
        return coretext;
    }
}
