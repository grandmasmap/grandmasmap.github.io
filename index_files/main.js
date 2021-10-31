jQuery(function($){

'use strict';

var GMAS = window.GMAS || {};

/* =============================================================================
   GMAS SKIP LINK FOCUS FIX (from _s)
   ========================================================================== */

GMAS.skiplinkfix = function(){
	var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
	    is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
	    is_ie     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

	if ( ( is_webkit || is_opera || is_ie ) && document.getElementById && window.addEventListener ) {
		window.addEventListener( 'hashchange', function() {
			var id = location.hash.substring( 1 ),
				element;

			if ( ! ( /^[A-z0-9_-]+$/.test( id ) ) ) {
				return;
			}

			element = document.getElementById( id );

			if ( element ) {
				if ( ! ( /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
};

/* =============================================================================
   GMAS WEB FONT LOADER
   ========================================================================== */

GMAS.webfont = function(){
	
	WebFont.load({
      //typekit: { id: 'xxxxxx' },
	  	google: {
	    	families: ['Montserrat:400,700']
		}
	});
	
};

/* =============================================================================
   GMAS NAVIGATION
   ========================================================================== */

GMAS.nav = function(){
	
  //mobile toggle
  $('.menu-toggle').click(function(){
	  $('#masthead').toggleClass('open');
	 $('.mobile-navigation > ul').slideToggle(125);
  });
  
  //desktop collapse
  $(window).scroll(function() {
    if ($(".site-header").offset().top > 150) {
        $(".site-header").addClass("collapse");
        $('.top-search').slideUp();
    } else {
        $(".site-header").removeClass("collapse");
    }
  });
  
  //desktop collapse
  $(window).scroll(function() {
    if ($(document).scrollTop() > 320) {
        $('#mobile-cta').addClass('shown');
    } else {
        $('#mobile-cta').removeClass('shown');
    }
  });
  
}

/* =============================================================================
   GMAS TABS
   ========================================================================== */

GMAS.tabs = function(){
	
  $('a.tab').click(function(){
	 $('a.tab.active').removeClass('active');
	 $(this).addClass('active');
	 $('.panel.open').removeClass('open');
	 $('#'+$(this).data('target')).addClass('open'); 
	 return false;
  });
  
}

/* =============================================================================
   GMAS SLIDER
   ========================================================================== */

GMAS.slider = function(){
	
	var mySwiper = new Swiper ('.swiper-container', {
	    // Optional parameters
	    direction: 'horizontal',
	    loop: true,
	    autoplay:7000,
	    
	    // If we need pagination
	    pagination: '.swiper-pagination',
	    paginationClickable: true,
	    paginationElement:'.swiper-pagination-bullet',
	    
	    // Navigation arrows
	    nextButton: '.swiper-button-next',
	    prevButton: '.swiper-button-prev',
	    
	    // And if we need scrollbar
	    //scrollbar: '.swiper-scrollbar',
	}); 
	
};

/* =============================================================================
   GMAS COUNTDOWN
   ========================================================================== */

GMAS.countdown = function(){
	
			var countTo = '2016/06/18';    
	    	$('.countdown').countdown(countTo, function(event) {
	    		$(this).find('.days').text(event.offset.totalDays);
	    		$(this).find('.hours').text(event.offset.hours);
	    		$(this).find('.minutes').text(event.offset.minutes);
	    		$(this).find('.seconds').text(event.offset.seconds);
	    	});
}

/* =============================================================================
   GMAS SEARCH
   ========================================================================== */

GMAS.search = function(){
	
  $('.search-item a').click(function(){
	 $('.top-search').slideToggle(125);
	 $('.top-search input').focus();
	 return false;
  });
}

/* =============================================================================
   GMAS VID BUTTONS
   ========================================================================== */

GMAS.video = function(){
	
  $('a.button[href*=youtube], a.button-alt[href*=youtube]').click(function(){
	  event.preventDefault();
	$('#vidBox').slideDown(250);
	  
	$(this).attr('href',function(i,v){
    var id = v.split('watch?v=')[1]; // get the id so you can add to iframe
    $('.vidBox-inner').html( '<iframe width="853" height="480" src="http://www.youtube.com/embed/' + id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>' );
    
    $("body").fitVids();
});
  });
  
  $('#closeVid').click(function(){
		$('.vidBox-inner').html('');
		$('#vidBox').hide();
		return false;
	});  
  
}

/* =============================================================================
   INIT
   ========================================================================== */
   
   
   
$(document).ready(function(){
	GMAS.skiplinkfix();
	GMAS.webfont();
	GMAS.nav();
	GMAS.tabs();
	GMAS.slider();
	GMAS.countdown();
	GMAS.search();
	GMAS.video();
});
	
});//jQuery

