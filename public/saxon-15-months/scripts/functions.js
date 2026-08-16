$(document).ready(function(){

	$(window).load(function() {
	
		var logopos = ($(".photo").height() - $(".ipf .photo").height() - $(".ipf .logo").height()) / 2;
		
		$(".ipf .logo").css({ top: logopos });
	
	});

});