// JavaScript Document
jQuery(document).ready(function(){
	var isFirst = true;
	var trigger = jQuery('.lg-slideshow .page-num li');
	trigger.click(function(){
		//jQuery('.lg-slideshow .page-num li').show();
		if (jQuery('.lg-slideshow .content>li .inner').is(':animated')){
			return false
		} else{
			var a = jQuery(this).index();
			jQuery(this).parent().find('li').removeClass('select');
			jQuery(this).addClass('select');
			jQuery('.lg-slideshow .content>li').fadeOut(300).eq(a).fadeIn(500);//!
			
			if(isFirst) {
				$('.lg-slideshow .content>li .inner .inner-content').animate({ right: 30, opacity: 0 }, 0).eq(a).animate({ right: 0, opacity: 1 }, 500);
				isFirst = false;
			}
			else {
				$('.lg-slideshow .content>li .inner .inner-content').animate({ right: 0 }, 400).animate({ right: 30, opacity: 0 }, 0).eq(a).animate({ right: 0, opacity: 1 }, 500);
			}
		}
	});
	var snow = scount = jQuery(".lg-slideshow .page-num").children().length - 1;
	trigger.eq(snow).click();
	
	playSlide = setInterval(function() {
		if ( snow>0 ) { snow--; } else { snow=scount }
		trigger.eq(snow).click();
	}, 5000)
});








