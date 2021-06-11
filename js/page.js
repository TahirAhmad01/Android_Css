$(function() {
	function clock() {
		var time = new Date(),
			hour = time.getHours(),
			min = time.getMinutes(),
			sec = time.getSeconds(),
			day = time.getDay(),
			year = time.getFullYear(),
			date = time.getDate();
	
		var mnth = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
			month = mnth[time.getMonth()];
	
		var	weekday = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
			week = weekday[time.getDay()];
		
		
		// 24hr to 12hr
		if (hour > 12) {
			hour = hour - 12
		}

		// 0 to 12
		if (hour == 0) {
			hour = 12;
		}
		 if (min < 10) {
			var min = '0' + min;
		 }
	
		$(".hour").text(hour);
		$(".minute").text(min);
		$(".second").text(sec);
		$(".day").text(week);
		$(".month").text(month);
		$(".date").text(date);
	}

	setInterval(clock, 100);

	var height = $(".middle_body").height() - 80;

	$(".item").css({
		height : height + "px"
	});

    setTimeout(function(){
		$(".loader").css({'z-index':'0', 'display' : 'none'}); 
	},4000);

	var owl = $('.owl-carousel');
	owl.owlCarousel({
		margin: 0,
		loop: true,
		items: 1
	});

	$(".app-open-body").on("click", function(){
		$(this).addClass("item_ready")
	})

	$(".items-inner div div").on("click", function(){
		var position = $(this).position();

		$(".content-loader-div").css({
			display : "block"
		})
		
		setTimeout(function (){
			$(".app-open-body").trigger("click");
		},20)

		$(".app-open-body").addClass("app_icon_position");

		if($(this).attr('id') == "call"){
			$(".app-open-body").html("<iframe src='call.html'></iframe>");
		}

		if($(this).attr('id') == "w3"){
			$(".app-open-body").html("<iframe src='https://google.com'></iframe>");
		}

		$(".app_icon_position").css({
			left : position.left + "px",
			top: position.top + "px"
		})

		$(".notification-bar").css({
			"background-color" : "#fff",
			"transition" : ".5s",
			"color" : "#000"
		})

		$(".notification-bar i").css({
			color : "#000"
		})

		$(".navigation-button").css({
			"color" : "#000",
			"background-color" : "#fff",
			"transition" : ".5s"
		})

		$(".back").addClass("enable");
		
	});

	$(".back").on("click" ,function(){
		if (!$(this).hasClass("enable")){
			return;
		}

		$(".app-open-body").removeClass("item_ready");
		$(".app-open-body").addClass("conveter");
		$(".app-open-body").addClass("window_close");

		$(".notification-bar").css({
			"background-color" : "transparent",
			"transition" : ".2s ease-in-out",
			"color" : "#fff"
		})

		$(".notification-bar i").css({
			color : "#fff"
		})

		$(".navigation-button").css({
			"color" : "#fff",
			"background-color" : "transparent",
			"transition" : ".3s"
		})

		$(".app-open-body iframe").remove();

		$(this).removeClass("enable")
	
		setTimeout(function(){
			$(".content-loader-div").removeAttr('style');
			$(".app-open-body").removeClass("conveter");
			$(".app-open-body").removeClass("window_close");
			$(".app-open-body").removeAttr("style");
			$(".notification-bar").removeAttr("style");
			$(".notification-bar i").removeAttr("style");
			$(".navigation-button").removeAttr("style");
		}, 400)
	})
});
