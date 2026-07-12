"use strict";

// System State
var systemVolume = 70;
var screenState = "unlocked"; // "unlocked", "locked", "off"
var volumeTimeout;

function clock() {
  var time = new Date(),
    hour = time.getHours(),
    min = time.getMinutes(),
    sec = time.getSeconds(),
    day = time.getDay(),
    year = time.getFullYear(),
    date = time.getDate();

  var mnth = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    month = mnth[time.getMonth()];

  var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    week = weekday[time.getDay()];

  // 24hr to 12hr
  if (hour > 12) {
    hour = hour - 12;
  }

  // 0 to 12
  if (hour == 0) {
    hour = 12;
  }
  if (min < 10) {
    min = "0" + min;
  }

  $(".hour").text(hour);
  $(".minute").text(min);
  $(".second").text(sec);
  $(".day").text(week);
  $(".month").text(month);
  $(".date").text(date);
}

setInterval(clock, 100);

// Initialize volume HUD & sliders
function showVolumeHud(level) {
  $("#volumeHudLevel").css("height", level + "%");
  $("#ccVolume").val(level);
  
  let icon = "fa-volume-up";
  if (level === 0) icon = "fa-volume-mute";
  else if (level < 40) icon = "fa-volume-down";
  
  $("#volumeHudIcon").removeClass().addClass("fad " + icon);
  $("#ccVolumeIcon").removeClass().addClass("fad " + icon);
  
  $("#volumeHud").css("display", "flex");
  clearTimeout(volumeTimeout);
  volumeTimeout = setTimeout(function() {
    $("#volumeHud").fadeOut(200);
  }, 1500);
}

// Battery API integration
function updateBatteryUI(level, isCharging) {
  const percentage = Math.round(level * 100);
  $("#ccBatteryPercent").text(percentage + "%");
  $("#statusBarPercent").text(percentage + "%");
  
  let iconClass = "fa-battery-full";
  if (percentage <= 15) iconClass = "fa-battery-empty";
  else if (percentage <= 35) iconClass = "fa-battery-quarter";
  else if (percentage <= 60) iconClass = "fa-battery-half";
  else if (percentage <= 85) iconClass = "fa-battery-three-quarters";
  
  if (isCharging) {
    iconClass = "fa-battery-bolt";
  }
  $("#statusBatteryIcon").removeClass().addClass("fad " + iconClass);
}

// Restore saved wallpaper and dark mode on load
function loadSavedSettings() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    $("body").addClass("dark-mode");
    $("#ccDarkMode").addClass("active");
  }
  const savedWallpaper = localStorage.getItem("wallpaper");
  if (savedWallpaper) {
    $(".mobile-freame-size").css("background", savedWallpaper);
    $(".mobile-freame-size").css("background-size", "cover");
  }
}

// Public API hooks for iframes to invoke
window.changeWallpaper = function(cssBgValue) {
  localStorage.setItem("wallpaper", cssBgValue);
  $(".mobile-freame-size").css("background", cssBgValue);
  $(".mobile-freame-size").css("background-size", "cover");
};

window.toggleDarkMode = function(enable) {
  if (enable) {
    $("body").addClass("dark-mode");
    $("#ccDarkMode").addClass("active");
    localStorage.setItem("theme", "dark");
  } else {
    $("body").removeClass("dark-mode");
    $("#ccDarkMode").removeClass("active");
    localStorage.setItem("theme", "light");
  }
  
  // Propagate to open iframe
  $("iframe").each(function() {
    try {
      if (enable) {
        $(this).contents().find("body").addClass("dark-mode");
      } else {
        $(this).contents().find("body").removeClass("dark-mode");
      }
    } catch(e) {}
  });
};

window.openDialerWithNumber = function(num) {
  localStorage.setItem("dial_number", num);
  if ($(".back").hasClass("enable")) {
    $(".back").trigger("click");
  }
  setTimeout(function() {
    $("#call").click();
  }, 400);
};

window.openMessengerWithContact = function(name, number) {
  localStorage.setItem("message_contact_name", name);
  localStorage.setItem("message_contact_phone", number);
  if ($(".back").hasClass("enable")) {
    $(".back").trigger("click");
  }
  setTimeout(function() {
    $("#message").click();
  }, 400);
};

$(document).ready(function() {
  loadSavedSettings();
  
  var height = $(".middle_body").height() - 80;
  $(".item").css({
    height: height + "px",
  });

  // Battery setup
  if (navigator.getBattery) {
    navigator.getBattery().then(function(battery) {
      updateBatteryUI(battery.level, battery.charging);
      battery.addEventListener('levelchange', function() {
        updateBatteryUI(battery.level, battery.charging);
      });
      battery.addEventListener('chargingchange', function() {
        updateBatteryUI(battery.level, battery.charging);
      });
    });
  } else {
    updateBatteryUI(0.85, false);
  }

  // Physical Side Buttons
  $("#physicalPowerBtn").on("click", function() {
    if (screenState === "off") {
      screenState = "locked";
      $("#sleepOverlay").addClass("lock-screen");
      $("#sleepOverlay").fadeIn(100);
    } else if (screenState === "locked") {
      screenState = "off";
      $("#sleepOverlay").removeClass("lock-screen");
      $("#sleepOverlay").css("background", "#000").show();
    } else {
      // unlocked -> off
      screenState = "off";
      $("#sleepOverlay").removeClass("lock-screen");
      $("#sleepOverlay").css("background", "#000").fadeIn(200);
    }
  });

  $("#sleepOverlay").on("click", function() {
    if (screenState === "locked") {
      screenState = "unlocked";
      $("#sleepOverlay").fadeOut(300);
    }
  });

  $("#physicalVolUpBtn").on("click", function() {
    systemVolume = Math.min(systemVolume + 10, 100);
    showVolumeHud(systemVolume);
  });

  $("#physicalVolDownBtn").on("click", function() {
    systemVolume = Math.max(systemVolume - 10, 0);
    showVolumeHud(systemVolume);
  });

  // Control Center drop down triggers
  $(".notification-bar").on("click", function(e) {
    if (!$(e.target).closest(".f_cam").length) {
      $("#controlCenter").toggleClass("open");
    }
  });

  $(".cc-handle").on("click", function() {
    $("#controlCenter").removeClass("open");
  });

  $(document).on("click", function(e) {
    if (!$(e.target).closest(".control-center, .notification-bar, .physical-btn").length) {
      $("#controlCenter").removeClass("open");
    }
  });

  // Control Center sliders and quick settings toggles
  $("#ccWifi").on("click", function() {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      $("#statusWifi").removeClass("fal fa-wifi-slash").addClass("fad fa-wifi").fadeIn(100);
    } else {
      $("#statusWifi").removeClass("fad fa-wifi").addClass("fal fa-wifi-slash").fadeIn(100);
    }
  });

  $("#ccBluetooth").on("click", function() {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      $("#statusBluetooth").fadeIn(100);
    } else {
      $("#statusBluetooth").fadeOut(100);
    }
  });

  $("#ccDarkMode").on("click", function() {
    const isDark = !$("body").hasClass("dark-mode");
    window.toggleDarkMode(isDark);
  });

  $("#ccFlashlight").on("click", function() {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      $("#flashlightBeam").fadeIn(150);
    } else {
      $("#flashlightBeam").fadeOut(150);
    }
  });

  $("#ccBrightness").on("input", function() {
    const val = $(this).val();
    const opacity = ((100 - val) / 100) * 0.85; // max 85% darkness
    $("#brightnessOverlay").css("opacity", opacity);
  });

  $("#ccVolume").on("input", function() {
    systemVolume = parseInt($(this).val());
    showVolumeHud(systemVolume);
  });

  // App loader
  setTimeout(function () {
    $("#loadImg").fadeOut(1500, function () {
      $(this).addClass("close_animation");
    });
    $(".loader").fadeOut(4000, function () {
      $(this).addClass("close_animation");
      $(this).remove();
    });
  }, 20);
});

var owl = $(".owl-carousel");
owl.owlCarousel({
  margin: 0,
  loop: true,
  items: 1,
});

$(".app-open-body").on("click", function () {
  $(this).addClass("item_ready");
});

$(".items-inner div div").on("click", function () {
  const position = $(this).position();

  $(".content-loader-div").css({
    display: "block",
  });

  setTimeout(function () {
    $(".app-open-body").trigger("click");
  }, 20);

  $(".app-open-body").addClass("app_icon_position");

  //call window opwn
  if ($(this).attr("id") === "call") {
    $(".app-open-body").html("<iframe src='apps/call.html'></iframe>");
  }

  //contact window opwn
  if ($(this).attr("id") === "contact") {
    $(".app-open-body").html("<iframe src='apps/contact.html'></iframe>");
  }

  //message window opwn
  if ($(this).attr("id") === "message") {
    $(".app-open-body").html("<iframe src='apps/message.html'></iframe>");
  }

  //message window opwn
  if ($(this).attr("id") === "setting") {
    $(".app-open-body").html("<iframe src='apps/setting.html'></iframe>");
  }

  //cute window opwn
  if ($(this).attr("id") == "cute") {
    $(".app-open-body").html("<iframe src='https://dooplays.xyz/'></iframe>");
  }

  //calculator window opwn
  if ($(this).attr("id") === "calc") {
    $(".app-open-body").html("<iframe src='apps/calculator.html'></iframe>");
  }

  //fast window opwn
  if ($(this).attr("id") === "fast") {
    $(".app-open-body").html("<iframe src='https://fast.com/'></iframe>");
  }

  //chess
  if ($(this).attr("id") === "chess") {
    $(".app-open-body").html("<iframe src='apps/chess.html'></iframe>");
  }

  //horse run
  if ($(this).attr("id") === "horse") {
    $(".app-open-body").html("<iframe src='apps/horse_run.html'></iframe>");
  }

  //golden
  if ($(this).attr("id") === "golden") {
    setTimeout(function () {
      $(".app-open-body").html("<iframe src='golden/index.html'></iframe>");
    }, 400);
  }

  //music
  if ($(this).attr("id") === "music") {
    $(".app-open-body").html("<iframe src='apps/music.html'></iframe>");
  }

  if ($(this).attr("id") === "google") {
    $(".app-open-body").append(`<ifream>
    <div class="gcse-searchbox-only"></div>
      <script async src="https://cse.google.com/cse.js?cx=28096d1e8754a1051"></script>
    </ifream>
      
    `);
  }

  $(".app_icon_position").css({
    left: position.left + "px",
    top: position.top + "px",
  });

  $(".notification-bar").css({
    "background-color": "#fff",
    transition: ".5s",
    color: "#000",
  });

  $(".notification-bar i").css({
    color: "#000",
  });

  $(".navigation-button").css({
    color: "#000",
    "background-color": "#fff",
    transition: ".5s",
  });

  $(".back").addClass("enable");
});

$(".back").on("click", function () {
  if (!$(this).hasClass("enable")) {
    return;
  }

  $(".app-open-body").removeClass("item_ready");
  $(".app-open-body").addClass("conveter");
  $(".app-open-body").addClass("window_close");

  $(".notification-bar").css({
    "background-color": "transparent",
    transition: ".2s ease-in-out",
    color: "#fff",
  });

  $(".notification-bar i").css({
    color: "#fff",
  });

  $(".navigation-button").css({
    color: "#fff",
    "background-color": "transparent",
    transition: ".3s",
  });

  $(".app-open-body iframe").remove();

  $(this).removeClass("enable");

  setTimeout(function () {
    $(".content-loader-div").removeAttr("style");
    $(".app-open-body").removeClass("conveter");
    $(".app-open-body").removeClass("window_close");
    $(".app-open-body").removeAttr("style");
    $(".notification-bar").removeAttr("style");
    $(".notification-bar i").removeAttr("style");
    $(".navigation-button").removeAttr("style");
  }, 400);
});
