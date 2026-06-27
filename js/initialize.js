$(document).ready(function() {

	// device

	var ua = navigator.userAgent.toLowerCase();

	var safari;
	if (ua.indexOf("mac") > -1 && ua.indexOf("safari") > -1 && ua.indexOf("chrome") === -1) {
		safari = 1;
	} else {
		safari = -1;
	}

	var device = [
	    ua.indexOf("ipad"),
	    ua.indexOf("iphone"),
	    ua.indexOf("ipod"),
	    ua.indexOf("android"),
	    ua.indexOf("windows phone"),
	    ua.indexOf("touch"),
	    ua.indexOf("blackberry"),
	    ua.indexOf("edge"),
	    ua.indexOf("trident"),
	    safari
	];

	var staticVersion = new Array();

	for (i = 0; i < device.length; i++) {

		if (device[i] >= 0) {
			staticVersion.push(device[i]);
		}
	}

	// start

	$("section:first-of-type").html('<h1>' + $("header > h1").html() + '</h1><aside id="bg1"></aside><aside id="bg3"></aside>');

	if ($(window).scrollTop() === 0) {

		$("body").append('<div id="loadimg" style="display: none;"><img src="images/bg_allsorts.jpg"><img src="images/bg_beans.jpg"></div>');
	
		$("body").prepend('<div class="loader"><div><div><div class="loadanim"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div></div>');

		loadanimation();
		
		$("header h1").css({ top: "100%" });

		$(window).load(function() {

			setTimeout(function() {
				$("header h1").animate({ top: 0 }, { duration: 1000, easing: "easeInOutExpo" });
				$(".loader").animate({ top: "-100%" }, { duration: 1000, easing: "easeInOutExpo",
					complete: function() {
						$(".loader, #loadimg").remove();
					}
				});
			}, 2000);
		
		});

	}

	function loadanimation() {
		$(".loadanim div:nth-child(1)").delay(250).animate({ opacity: "show" }, { duration: 0 });
		$(".loadanim div:nth-child(2)").delay(300).animate({ opacity: "show" }, { duration: 0 });
		$(".loadanim div:nth-child(3)").delay(350).animate({ opacity: "show" }, { duration: 0 });
		$(".loadanim div:nth-child(4)").delay(400).animate({ opacity: "show" }, { duration: 0 });
		$(".loadanim div:nth-child(5)").delay(450).animate({ opacity: "show" }, { duration: 0 });
		$(".loadanim div:nth-child(6)").delay(500).animate({ opacity: "show" }, { duration: 0 });
		$(".loadanim div:nth-child(7)").delay(550).animate({ opacity: "show" }, { duration: 0 });
		$(".loadanim div:nth-child(8)").delay(600).animate({ opacity: "show" }, { duration: 0 });
		$(".loadanim div:nth-child(1)").delay(850).animate({ opacity: "hide" }, { duration: 0 });
		$(".loadanim div:nth-child(2)").delay(900).animate({ opacity: "hide" }, { duration: 0 });
		$(".loadanim div:nth-child(3)").delay(950).animate({ opacity: "hide" }, { duration: 0 });
		$(".loadanim div:nth-child(4)").delay(1000).animate({ opacity: "hide" }, { duration: 0 });
		$(".loadanim div:nth-child(5)").delay(1050).animate({ opacity: "hide" }, { duration: 0 });
		$(".loadanim div:nth-child(6)").delay(1100).animate({ opacity: "hide" }, { duration: 0 });
		$(".loadanim div:nth-child(7)").delay(1150).animate({ opacity: "hide" }, { duration: 0 });
		$(".loadanim div:nth-child(8)").delay(1200).animate({ opacity: "hide" }, { duration: 0,
			complete: function() { loadanimation(); }
		});
	}

	// element variables

	var sections = $("section");
	var headerOne = $("header > h1");
	var headerTwo = sections.eq(0).children("h1");
	var bgAllsorts = $("#bg1");
	var bgBeans = $("#bg3");
	var sectionTwo = sections.eq(1);
	var sectionThree = sections.eq(2);
	var headingContact = sectionThree.children("h2");

	// functions

	var winWidth, winHeight, scrollTop, headerTrigger, bgAllsortsTrigger, bgAllsortsShift, bgBeansTrigger, bgBeansShift, hcLineHeight, hcPadding, hcHeight;
	function getWinDim() {
		winWidth = $(window).width();
		winHeight = $(window).height();
	}
	getWinDim();

	function sectionTop(section) {
		var offset = section.offset();
		return offset ? offset.top : 0;
	}

	function getScrollVars() {
		scrollTop = $(window).scrollTop();
		headerTrigger = winHeight * 0.5;
		bgAllsortsTrigger = sectionTop(sectionTwo) - winHeight;
		bgAllsortsShift = scrollTop - bgAllsortsTrigger;
		bgBeansTrigger = sectionTop(sectionThree);
		bgBeansShift = scrollTop - bgBeansTrigger;
	}
	getScrollVars();

	function headersPos() {
		var viewportTop = 0;
		if (scrollTop >= headerTrigger) {
			viewportTop = (headerTrigger - scrollTop) * 0.5;
		}

		headerOne.css({ top: scrollTop + viewportTop });
		headerTwo.css({ top: viewportTop });
	}

	function bgAllsortsPos() {
		getScrollVars();
		if (scrollTop > bgAllsortsTrigger) {
			bgAllsorts.css({ top: -(bgAllsortsShift * 0.375) });
		} else {
			bgAllsorts.css({ top: 0 });
		}
	}

	function bgBeansPos() {
		getScrollVars();
		if (scrollTop > bgBeansTrigger) {
			bgBeans.css({ top: -(bgBeansShift * 0.375) });
		} else {
			bgBeans.css({ top: 0 });
		}
	}

	function bgHandler() {
		if (scrollTop > sectionTop(sectionTwo)) {
			bgAllsorts.hide();
			headerTwo.hide();
		} else {
			bgAllsorts.show();
			headerTwo.show();
		}
	}

	function headingsPos() {
		if (scrollTop > sectionTop(sectionTwo)) {
			hcLineHeight = parseInt(headingContact.css("line-height").slice(0,-2));
			hcPadding = parseInt(headingContact.css("padding-top").slice(0,-2)) * 2;
			hcHeight = hcLineHeight + hcPadding;
			headingContact.css({ top: bgBeansShift * 0.5, marginTop: (hcHeight * 0.5), opacity: 0.3 });
		}
		if (scrollTop > (sectionTop(sectionThree) + hcHeight)) {
			headingContact.css({ top: bgBeansShift, marginTop: 0, opacity: 1 });
		}
	}

	function headingsStatic() {
		if (staticVersion.length > 0) {
			headingContact.css({ top: winHeight * 0.2 });
		}
	}
	headingsStatic();

	if ($(window).scrollTop() !== 0) {
		if (staticVersion.length === 0) {
			headersPos();
			bgAllsortsPos();
			bgBeansPos();
			headingsPos();
		}
		bgHandler();
	}

	// resize

	$(window).resize(function() {

		getWinDim();
		getScrollVars();
		headingsStatic();

		if (staticVersion.length === 0) {

			headersPos();
			bgAllsortsPos();
			bgBeansPos();
			headingsPos();

		}

		bgHandler();

	});

	// scroll

	$(window).scroll(function() {
		
		getScrollVars();
		
		if (staticVersion.length === 0) {

			headersPos();
			bgAllsortsPos();
			bgBeansPos();
			headingsPos();

		}

		bgHandler();

	});

	// year
	
	$("footer > span > span").html( new Date().getFullYear() );

});
