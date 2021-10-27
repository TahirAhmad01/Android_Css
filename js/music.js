$(function(){
	let track = document.createElement('audio');
	track.style.display = 'none';
	document.body.insertBefore(track, document.body.childNodes[0]);
	let index_no = 0;
	track.id = "audio";
	track.attr = "controls";

	audio_track_list = [
		{
			name: "Alan Walker - Fade",
			artist: "Alan Walker",
			image: "1.jpg",
			path: "1.mp3",
		},
		{
			name: "Pirates of caribbean Ringtone",
			artist: "Unknown",
			image: "2.jpg",
			path: "2.mp3",
		},
		{
			name: "Alan Walker - Force",
			artist: "Alan Walker",
			image: "3.jpg",
			path: "3.mp3",
		},
		{
			name: "Alan Walker - Spectre",
			artist: "Alan Walker",
			image: "4.jpg",
			path: "4.mp3",
		},
		{
			name: "Structure mood off song",
			artist: "Unknown",
			image: "5.jpg",
			path: "5.mp3",
		},
		{
			name: "Warriyo - Mortals",
			artist: "unknown",
			image: "6.jpg",
			path: "6.mp3",
		},
		{
			name: "Tujh Mein Rab Dikhta Hai",
			artist: "Salim-Sulaiman",
			image: "8.jpg",
			path: "7.mp3",
		},
		{
			name: "Cartoon - On & On",
			artist: "feat. Daniel Levi",
			image: "8.jpg",
			path: "8.mp3",
		},
		{
			name: "Zedd, Alessia Cara - Stay",
			artist: "Alessia Cara",
			image: "9.jpg",
			path: "9.mp3",
		}
	]

	//playlist open
	$(".music-count").on('click', function(){
		$(this).toggleClass("playlist_active");
		$(".playlist").toggleClass("p_active");
	})

	// volume value
	var volume_value = $("#volume").val();
	$(".current-volume").text(volume_value);
	track.volume = volume_value / 100;

	//music play function
	function play(){
		$('.play').html('<i class="fas fa-pause"></i>'); 
		track.play();
		$('#spans').addClass('spans');
		$('#music_ani_bg').addClass('music_ani_bg');
	}

	//music pause function
	function pause(){
		$('.play').html('<i class="fas fa-play"></i>');
		track.pause();
		$('#spans').removeClass('spans')
		$('#music_ani_bg').removeClass('music_ani_bg')
	}

	//current_time_function
	function track_cu_time_update(){
		var currentTime = Math.floor(track.currentTime);
		var minutes = Math.floor(currentTime / 60);
		var seconds = currentTime%60;

		if (minutes < 10){
			var minute = "0"+ minutes;
		}else{
			var minute = minutes;
		}
		
		if (seconds < 10 ){
			var second = "0"+ seconds;
		}else{
			var second = seconds;
		}
		
		$("#curent_time").text(minute + ":" + second);
	}

	//duration_time_function
	function track_du_time_update(){
		var duration = Math.floor(track.duration);
		var duration_minutes = Math.floor(duration / 60);
		var duration_seconds = duration%60;
		if (duration_minutes < 10){
			var d_minute = "0"+ duration_minutes;
		}else{
			var d_minute = duration_minutes;
		}

		if (duration_seconds < 10){
			var d_second = "0"+ duration_seconds;
		}else{
			var d_second = duration_seconds;
		}

		if( track.duration === 0 || track.duration >= 0){
			$("#duration_time").text(d_minute + ":" + d_second);
		}else{
			$("#duration_time").text("00" + ":" + "00");
		}
			
	}

	function slider_value(){
		$("#track_duration").val(track.currentTime*100/track.duration);
	}

	//Music Play Pause
	$('.play').click(function(){
		var $this = $(this);
		$this.toggleClass('active');
		if($this.hasClass('active')){
			play();
			$(this).addClass('active')    
		} else {
			pause()
		}
	});

	// index no function
	function music_play_nm(index_no){
		track.src = 'music/'+audio_track_list[index_no].path;
		$("#playback_image").attr("src", 'img/music/'+ audio_track_list[index_no].image) ;
		$("#current_track").text(index_no + 1);
		$("#song_title").text(audio_track_list[index_no].name);
		$("#artist").text(audio_track_list[index_no].artist)
	}

	music_play_nm( index_no );

	//playlist
	for (let i = 0; i < audio_track_list.length; i++) {
		$(".playlist").append("<div class='playlist_item p_song_title_"+i+"'> <div>"+audio_track_list[i].name+"</div> <div id='p_song_artist' class='p_artist'> Artist: "+audio_track_list[i].artist+"</div> </div>");

		$(".p_song_title_"+i).on('click', function() {
			index_no = i;
			music_play_nm( index_no );
			$(".music-count").toggleClass("playlist_active");
			$(".playlist").toggleClass("p_active");
			if($('.play').hasClass('active')){
				play();
				$('.play').addClass('active')
			}else{
				pause();
			}
		})
	}

	//forword track
	$("#forword_track").on("click", function(){
		if(index_no < audio_track_list.length -1 ){
			index_no += 1;
			music_play_nm( index_no );
			if($('.play').hasClass('active')){
				play();
				$('.play').addClass('active')
			}else{
				pause();
			}
		}else{
			index_no = 0;
			music_play_nm(index_no);
			if($('.play').hasClass('active')){
				play();
				$('.play').addClass('active')
			}else{
				pause();
			}
		}
	})

	//backword track
	$("#backword_track").on("click", function(){
		if(index_no > 0){
			index_no -= 1;
			music_play_nm( index_no );
			if($('.play').hasClass('active')){
				play();
				$('.play').addClass('active')
			}else{
				pause();
			}
		}else if ( index_no == 0 ){
			index_no = audio_track_list.length -1
			music_play_nm( index_no );
			if($('.play').hasClass('active')){
				play();
				$('.play').addClass('active')
			}else{
				pause();
			}
		}
	})

	//Music Volume
	$('#volume').on('change', function() {
		var volume_value = $("#volume").val();
		track.volume = volume_value / 100;
		$(".current-volume").text(volume_value);

		//Volume Icon
		if( track.volume == 0 ){
			$(".volume-ico i").removeClass("fa-volume-up");
			$(".volume-ico i").addClass("fa-volume-slash");
		}else{
			$(".volume-ico i").addClass("fa-volume-up");
			$(".volume-ico i").removeClass("fa-volume-slash");
		}

	});

	//mute music
	$("#volume_btn").on('click',function(){
		var uvol = track.volume = 0;
		$('#volume').val(uvol)
		$(".current-volume").text($('#volume').val());

		//Volume Icon
		if( track.volume == 0 ){
			$(".volume-ico i").removeClass("fa-volume-up");
			$(".volume-ico i").addClass("fa-volume-slash");
		}else{
			$(".volume-ico i").addClass("fa-volume-up");
			$(".volume-ico i").removeClass("fa-volume-slash");
		}
	})

	var interval = setInterval(slider_value , 1000);

	//music slider move
	$('#track_duration').on('change', function() {
		var slider_position = track.duration * ($("#track_duration").val() / 100);
		track.currentTime = slider_position;
		track_cu_time_update();
		track_du_time_update();
	})
	

	track.onplay = function(){
		console.log(track.onplay)
	}
	
	//track time fixer
	setInterval(() => {
		track_du_time_update();
		track_cu_time_update();

		//music end pause
		if(track.currentTime == track.duration){
			
			if($("#auto_play").hasClass("auto_active") && $('.play').hasClass('active') && index_no < audio_track_list.length ){
				index_no += 1;
				music_play_nm( index_no );
				play();
				track_du_time_update();
				track_cu_time_update();
			}else{
				pause();
				$('.play').removeClass('active')
			}
		}

	}, 1000)

	$("#repet").on('click',function(){
		track.currentTime = 0;
		track_cu_time_update();
		track_du_time_update();
	})

	$("#auto_play").on('click', function(){
		$(this).toggleClass('auto_active')
	})


	$("#total_track").text(audio_track_list.length)

	window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

	var start = function() {
		var audio = document.getElementById('audio');
		var ctx = new AudioContext();
		var analyser = ctx.createAnalyser();
		var audioSrc = ctx.createMediaElementSource(audio);
		// we have to connect the MediaElementSource with the analyser 
		audioSrc.connect(analyser);
		analyser.connect(ctx.destination);
		// we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
		// analyser.fftSize = 64;
		// frequencyBinCount tells you how many values you'll receive from the analyser
		var frequencyData = new Uint8Array(analyser.frequencyBinCount);

		// we're ready to receive some data!
		var canvas = document.getElementById('canvas'),
			cwidth = canvas.width,
			cheight = canvas.height - 2,
			meterWidth = 10, //width of the meters in the spectrum
			gap = 2, //gap between meters
			capHeight = 2,
			capStyle = '#fff',
			meterNum = 800 / (10 + 2), //count of the meters
			capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
		ctx = canvas.getContext('2d'),
		gradient = ctx.createLinearGradient(0, 0, 0, 300);
		gradient.addColorStop(1, '#0f0');
		gradient.addColorStop(0.5, '#ff0');
		gradient.addColorStop(0, '#f00');
		// loop
		function renderFrame() {
			var array = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(array);
			var step = Math.round(array.length / meterNum); //sample limited data from the total array
			ctx.clearRect(0, 0, cwidth, cheight);
			for (var i = 0; i < meterNum; i++) {
				var value = array[i * step];
				if (capYPositionArray.length < Math.round(meterNum)) {
					capYPositionArray.push(value);
				};
				ctx.fillStyle = capStyle;
				//draw the cap, with transition effect
				if (value < capYPositionArray[i]) {
					ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
				} else {
					ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
					capYPositionArray[i] = value;
				};
				ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
				ctx.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
			}
			requestAnimationFrame(renderFrame);
		}
		renderFrame();
		// audio.play();
	};

	track.onplay = function(){
		start();
	}

})