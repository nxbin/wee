// JavaScript Document



$(document).ready(function() {
	$("a[rel=group1]").fancybox({
		'transitionIn'		: 'none',
		'transitionOut'		: 'none',
		'titlePosition' 	: 'over',
		'titleFormat'		: function(title, currentArray, currentIndex, currentOpts) {
			return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
		}
	});

	/*首页大图渐变*/
	$('.banner').animate({left:'-5px',filter: 'alpha(opacity=100)',opacity: '1',},"slow");
	
	
	/*案例文字渐变*/
	$('.example').mouseenter(function(){
		$('.example-word').hide();	
		});
	$('.example').mouseleave(function(){	
//		$('.example-word').fadeIn();
		});	
			
	
	var head_top = $('.head').height();	

	/*顶部浮动区域透明度调节	*/
	$(window).scroll(function(e){
		var scrollnow = $(window).scrollTop(); 
		if(scrollnow > head_top){
			$('.head').fadeTo(0, .85);
			$('.head').css("padding",'0');
		}else if(scrollnow = head_top){
			$('.head').fadeTo(0, 1);
			$('.head').css("padding",'15px 0');
			}
		});
				
	
	/*顶部浮动区文字点击跳转*/
	$('.texin').click(function(){

	    $('html, body').animate({scrollTop: 900}, 800); 
    });
    $('.anli').click(function(){
	    $('html, body').animate({scrollTop: 2588}, 800); 
    });
    $('.yunzuo').click(function(){
	    $('html, body').animate({scrollTop: 3700}, 800); 
    });
    $('.xiazai').click(function(){
	    var top = $(window).scrollTop() ;
	    if(top != 0){
	        $('html, body').animate({scrollTop: 0}, 800);
	    }else{
			for (var i=0; i<1; i++){
				$('.abtn-large').animate({backgroundColor:'#ED5154'}, 1000);
				$('.abtn-large').animate({backgroundColor:'#19608e'}, 1000);
			}
		} 
    });

   /* 按钮hover效果*/
    $('.abtn-large').mouseover(function(){
       $('.abtn-large').css('backgroundColor','#1E73AC');
    });
    $('.abtn-large').mouseout(function(){		
	   $('.abtn-large').css('backgroundColor','#19608e');
    });		
});

