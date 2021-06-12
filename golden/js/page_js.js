
(function ($) {
	'use strict'


	$('#menu_ico').on('click', function(){
		$('.menu_icon').toggleClass( "change" );
		$('.menu').slideToggle();
	})

	
	$(window).resize(function(){
		var screenSize = $(window).width();
		if (screenSize > 991) {
			$('.menu').removeAttr('style');
			$('.menu_icon').removeClass( "change" );
		}
	});


	$(window).on('scroll', function(){
		var scroll = $(window).scrollTop();

		if (scroll > 50){
			$("#menu").addClass('sticky');
		}else{
			$("#menu").removeClass('sticky');
		}

		if (scroll > 400){
			$('#top').addClass("back");
		}else{
			$('#top').removeClass('back')
		}
	});


	$('#top').on('click', function(){
		$(window).scrollTop(0)
	});

	//acive menu
	$(document).ready(function() {
		$('#nav').onePageNav({
			currentClass: 'current',
			changeHash: true,
			scrollSpeed: 0,
			scrollThreshold: .50,
			filter: ':not(.external)',
			
			begin: function() {
				//I get fired when the animation is starting
				$('body').append('<div id="device-dummy" style="height: 1px;"></div>');
			},
			end: function() {
				//I get fired when the animation is 
				$('#device-dummy').remove();
			},
			scrollChange: function($currentListItem) {
				//I get fired when you enter a section and I pass the list item of the section
			}
		});
	});

	//wow js
	var wow = new WOW({
	    boxClass:     'wow',      // animated element css class (default is wow)
	    animateClass: 'animated', // animation css class (default is animated)
	    offset:       0,          // distance to the element when triggering the animation (default is 0)
	    mobile:       false,       // trigger animations on mobile devices (default is true)
	    live:         false,       // act on asynchronously loaded content (default is true)
	    callback:     function(box) {
	      // the callback is fired every time an animation is started
	      // the argument that is passed in is the DOM node being animated
	    },
	    scrollContainer: true,    // optional scroll container selector, otherwise use window,
	    resetAnimation: true,     // reset animation on end (default is true)
	  }
	);
	wow.init();

	//filte button

	// filter items on button click
	$('.filter-button-group').on( 'click', 'button', function() {
		var filterValue = $(this).attr('data-filter');
		$grid.isotope({ filter: filterValue });
	});
	var $grid = $('.grid').isotope({
	  // set itemSelector so .grid-sizer is not used in layout
	  itemSelector: '.grid-item',
	  percentPosition: true,
	  masonry: {
	    // use element for option
	    columnWidth: '.grid-item'
	  }
	})
	// init Isotope
	var $grid = $('.grid').isotope({
	  itemSelector: '.element-item',
	  layoutMode: 'fitRows',
	  getSortData: {
	    name: '.name',
	    symbol: '.symbol',
	    number: '.number parseInt',
	    category: '[data-category]',
	    weight: function( itemElem ) {
	      var weight = $( itemElem ).find('.weight').text();
	      return parseFloat( weight.replace( /[\(\)]/g, '') );
	    }
	  }
	});

	// filter functions
	var filterFns = {
	  // show if number is greater than 50
	  numberGreaterThan50: function() {
	    var number = $(this).find('.number').text();
	    return parseInt( number, 10 ) > 50;
	  },
	  // show if name ends with -ium
	  ium: function() {
	    var name = $(this).find('.name').text();
	    return name.match( /ium$/ );
	  }
	};

	// bind filter button click
	$('#filters').on( 'click', 'button', function() {
	  var filterValue = $( this ).attr('data-filter');
	  // use filterFn if matches value
	  filterValue = filterFns[ filterValue ] || filterValue;
	  $grid.isotope({ filter: filterValue });
	});

	// bind sort button click
	$('#sorts').on( 'click', 'button', function() {
	  var sortByValue = $(this).attr('data-sort-by');
	  $grid.isotope({ sortBy: sortByValue });
	});

	// change is-checked class on buttons
	$('.button-group').each( function( i, buttonGroup ) {
	  var $buttonGroup = $( buttonGroup );
	  $buttonGroup.on( 'click', 'button', function() {
	    $buttonGroup.find('.is-checked').removeClass('is-checked');
	    $( this ).addClass('is-checked');
	  });
	});

	//preloder
	$(window).on("load",function(){
	 	$(".loader-container").fadeOut(2500);
	 	$(window).scrollTop(0);
    });

	//skill
	$(document).ready(function(){
		$('.skill_outside').each(function(){
			$(this).find('.skill_bar div').animate({
				width:$(this).attr('data-percent')
			});
		});

		$('.skill_outside').each(function(){
			$(this).find('.skill_head div').text($(this).attr('data-percent'));
		});

	});


}) (jQuery);