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

		// if (sec < 10 ) {
		// 	var sec= '0' + sec;
		// }
		 if (min < 10) {
			var min = '0' + min;
		 }
		// if (hour < 10) {
		// 	var hour = '0' + hour;
		// }
		// if (date < 10) {
		// 	var date = '0' + date
		// }
	
		$(".hour").text(hour);
		$(".minute").text(min);
		$(".second").text(sec);
		$(".day").text(week);
		$(".month").text(month);
		$(".date").text(date);
	}

	setInterval(clock, 100);

	var height = $(".mobile-scroll-body").height();
	console.log(height);

	$(".item").css({
		height : height + "px"
	});

	var owl = $('.owl-carousel');
      owl.owlCarousel({
        margin: 0,
        loop: true,
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 1
          },
          1000: {
            items: 1
          }
        }
      })

});

