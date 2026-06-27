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

	$("section:first-of-type").html('<h1>' + $("header > h1").html() + '</h1><aside id="bg1"></aside><aside id="bg2"></aside><aside id="bg3"></aside>');

	if ($(window).scrollTop() === 0) {

		$("body").append('<div id="loadimg" style="display: none;"><img src="images/bg_allsorts.jpg"><img src="images/bg_jellies.jpg"><img src="images/bg_beans.jpg"></div>');
	
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
	
	var headerOne = $("header > h1");
	var sectionOne = $("section:first-of-type");
	var headerTwo = $("section:first-of-type > h1");
	var bgAllsorts = $("#bg1");
	var bgJellies = $("#bg2");
	var bgBeans = $("#bg3");
	var sectionTwo = $("section:nth-of-type(2)");
	var sectionTwoArticle = $("section:nth-of-type(2) > article");
	var sectionThree = $("section:nth-of-type(3)");
	var sectionFour = $("section:nth-of-type(4)");
	var sectionFive = $("section:nth-of-type(5)");
	var sectionSix = $("section:last-of-type");
	var headingSkills = sectionThree.children("h2");
	var headingContact = sectionFive.children("h2");

	// functions

	var winWidth, winHeight, scrollTop, headerTrigger, bgAllsortsTrigger, bgAllsortsShift, bgJelliesTrigger, bgJelliesShift, bgBeansTrigger, bgBeansShift, hsLineHeight, hsPadding, hsHeight, hcLineHeight, hcPadding, hcHeight;

	function getWinDim() {
		winWidth = $(window).width();
		winHeight = $(window).height();
	}
	getWinDim();

	function getScrollVars() {
		scrollTop = $(window).scrollTop();
		headerTrigger = winHeight * 0.5;
		bgAllsortsTrigger = sectionTwo.offset().top - winHeight;
		bgAllsortsShift = scrollTop - bgAllsortsTrigger;
		bgJelliesTrigger = sectionThree.offset().top;
		bgJelliesShift = scrollTop - bgJelliesTrigger;
		bgBeansTrigger = sectionFive.offset().top;
		bgBeansShift = scrollTop - bgBeansTrigger;
	}
	getScrollVars();

	function headersPos() {
		if (scrollTop < headerTrigger) {
			headerOne.offset({ top: scrollTop });
			headerTwo.offset({ top: scrollTop });
		} else {
			headerOne.offset({ top: (headerTrigger + scrollTop) * 0.5 });
			headerTwo.offset({ top: (headerTrigger + scrollTop) * 0.5 });
		}
	}

	function bgAllsortsPos() {
		getScrollVars();
		if (scrollTop > bgAllsortsTrigger) {
			bgAllsorts.css({ top: -(bgAllsortsShift * 0.375) });
		} else {
			bgAllsorts.css({ top: 0 });
		}
	}

	function bgJelliesPos() {
		getScrollVars();
		if (scrollTop > bgJelliesTrigger) {
			bgJellies.css({ top: -(bgJelliesShift * 0.375) });
		} else {
			bgJellies.css({ top: 0 });
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
		if (scrollTop > sectionTwo.offset().top) {
			bgAllsorts.hide();
			headerTwo.hide();
		} else {
			bgAllsorts.show();
			headerTwo.show();
		}
		if (scrollTop > sectionFour.offset().top) {
			bgJellies.hide();
		} else {
			bgJellies.show();
		}
	}

	function headingsPos() {
	
		if (scrollTop > sectionTwo.offset().top) {
			hsLineHeight = parseInt(headingSkills.css("line-height").slice(0,-2));
			hsPadding = parseInt(headingSkills.css("padding-top").slice(0,-2)) * 2;
			hsHeight = hsLineHeight + hsPadding;
			headingSkills.css({ top: bgJelliesShift * 0.5, marginTop: (hsHeight * 0.5), opacity: 0.3 });
		}
		if (scrollTop > (sectionThree.offset().top + hsHeight)) {
			headingSkills.css({ top: bgJelliesShift, marginTop: 0, opacity: 1 });
		}
		
		if (scrollTop > sectionFour.offset().top) {
			hcLineHeight = parseInt(headingContact.css("line-height").slice(0,-2));
			hcPadding = parseInt(headingContact.css("padding-top").slice(0,-2)) * 2;
			hcHeight = hcLineHeight + hcPadding;
			headingContact.css({ top: bgBeansShift * 0.5, marginTop: (hcHeight * 0.5), opacity: 0.3 });
		}
		if (scrollTop > (sectionFive.offset().top + hcHeight)) {
			headingContact.css({ top: bgBeansShift, marginTop: 0, opacity: 1 });
		}
	
	}

	function headingsStatic() {
		if (staticVersion.length > 0) {
			headingSkills.css({ top: winHeight * 0.2 });
			headingContact.css({ top: winHeight * 0.2 });
		}
	}
	headingsStatic();

	// resize

	$(window).resize(function() {

		getWinDim();
		getScrollVars();
		headingsStatic();

		if (staticVersion.length === 0) {

			headersPos();
			bgAllsortsPos();
			bgJelliesPos();
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
			bgJelliesPos();
			bgBeansPos();
			headingsPos();

		}

		bgHandler();

	});

	// form

	$("form").append('<div>&nbsp;</div>');

	var isText, regEx, isEmail, form, data, element, errors, i, disable = false;

		// type - text
	
	$("input[type='text'].required").bind("input blur", function() {
		isText = $(this).val();
		if (isText) {
			$(this).removeClass("invalid").addClass("valid");
		} else {
			$(this).removeClass("valid").addClass("invalid");
		}
	});
	
		// type - email
	
	$("input[type='email'].required").bind("input blur", function() {
		regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		isEmail = regEx.test($(this).val());
		if (isEmail) {
			$(this).removeClass("invalid").addClass("valid");
		} else {
			$(this).removeClass("valid").addClass("invalid");
		}
	});
	
		// ajax sending
	
	$("form").submit(function(event) {
		event.preventDefault();
		if (!disable) {
			errors = true;
			form = $(this);
			data = form.serializeArray();
			i = 0;
			for (var prop in data) {
				element = $("#" + data[prop].name);
				if (element.hasClass("required") && !element.hasClass("valid")) {
					element.addClass("invalid");
					i++;
				}
			}
			if (i === 0) {
				errors = false;
			}
			if (errors === true) {
				if ($("#Name").hasClass("valid")) {
					$("form > div").html("Please enter a valid email address.");
				} else {
					$("form > div").html("Please complete required fields.");
				}
			} else {
				disable = true;
				$.ajax({
					type: 'POST',
					url: form.attr("action"),
					data: data,
					success: function(data) {
						var json = JSON.parse(data);
						if (json.response.status == 'success') {
							form[0].reset();
							form.trigger('ajaxed', data);
							disable = false;
						} else {
							$("form > div").html(json.response.message);
							disable = false;
						}
					}
				});
			}
		}
	});
	
	$("form").bind('ajaxed', function() {
		$(".required").removeClass("valid");
		$("form > div").html("Thank you, I will be in touch shortly..!");
	});

	// year
	
	$("footer > span > span").html( new Date().getFullYear() );

});