// ==UserScript==
// @name         Scrap.tf auto join
// @namespace    http://scrap.tf
// @version      1.0
// @description  Auto join public raffles fron Scrap.tf
// @author       CYRIAQU3
// @match        https://scrap.tf/*
// @grant        none
// @homepageURL  http://www.cyriaquedelaunay.fr
// @updateURL	 https://raw.githubusercontent.com/CYRIAQU3/ScrapTF-auto-raffle/master/autojoin.js
// @downloadURL  https://raw.githubusercontent.com/CYRIAQU3/ScrapTF-auto-raffle/master/autojoin.js
// ==/UserScript==

var openedTabs = 0;	//number of opened tabs
$(document).ready(function()
{
	scanHash();
});

function scanHash()
{
	var h = window.location.hash;
	var url = window.location.href;
	var u = "https://scrap.tf/raffles";

	if(url == u)
	{
		console.log("scanning the raffles...");
		scanRaffles();
		var sri = setInterval(function(){scanRaffles();},1000);
		setTimeout(function(){location.reload();},30000);	// reload the page after 30 sec
	}

	if (url.indexOf(u) > -1 && url != u)
	{
    	if(h == "#join")
		{
			console.log("Joining raffle...");
			joinRaffle();
		}
		else
		{
			window.close();
		}
	}
}

function scanRaffles()
{
	var pc = 0;	// vérifie si il y a des panels de raffles remportées, si oui : on les ignore (on ne check que le deuxième tableau)
	var cId = "raffle-panel-1"; // id du conteneur qui contient les raffles
	var needScroll = true;	// vérifie si il faut continuer de scroller vers le bas (en fonction du label de chargement)
	var pl;
	var loadingDoneLabel = "That's all, no more!";


	pl = $(".pag-loading").text();
	
	if(pl == loadingDoneLabel)
	{
		needScroll = false;	// désactivation du scroll
	}

	if(needScroll)
	{
		$("html, body").animate({ scrollTop: $(document).height() }, 100);
	}

	$(".panel").each(function()
	{
		pc++;
		$(this).attr("id","raffle-panel-"+pc);
	});

	if(pc > 1)
	{
		$("#raffle-panel-1").hide();
		cId = "raffle-panel-2";
	}

	$("#"+cId).find(".panel-raffle").each(function()
	{
		var o = $(this).css("opacity");
		if(o == "0.6")
		{
			$(this).hide();
		}
		else
		{
			var r = $(this).attr("id");
			var raffleId = r.replace("raffle-box-","");
			if(openedTabs < 5)
			{
				var u = window.location.href+"/"+raffleId+"#join";
				var win = window.open(u, "", "width=0,height=0");
			    win.blur();
			  	win.resizeTo(0,0); 
			 	win.moveTo(0,window.screen.availHeight+10);
				openedTabs++;
				$(this).css("opacity","0.6").hide();
			}
		}
	});
}

function joinRaffle()
{
	window.opener.focus();
	var onclick = $("#raffle-enter").attr('onclick');
	eval("var sc = function(){"+onclick+"}");
	sc();
	window.location.hash = "#";
	setTimeout(function(){window.close();},10000);	// close the page after 10 sec
}