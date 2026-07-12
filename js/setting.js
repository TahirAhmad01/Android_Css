"use strict";

$(document).ready(function() {
  // Sync Dark Mode state from parent
  const parentIsDark = window.parent && window.parent.document.body.classList.contains("dark-mode");
  const storedTheme = localStorage.getItem("theme") === "dark";
  
  if (parentIsDark || storedTheme) {
    $("body").addClass("dark-mode");
    $("#darkModeSwitch").prop("checked", true);
  }

  // Active wallpaper highlight
  const currentWp = localStorage.getItem("wallpaper");
  if (currentWp) {
    $(".wallpaper-card").each(function() {
      const cardStyle = $(this).data("style");
      if (cardStyle === currentWp) {
        $(this).addClass("active");
      }
    });
  } else {
    // Default active is standard OPPO background
    $(".wallpaper-card").last().addClass("active");
  }

  // Navigate to Wallpaper panel
  $("#navWallpaper").on("click", function() {
    $("#paneWallpaper").css("display", "flex");
  });

  // Navigate to Specs panel
  $("#navSpecs").on("click", function() {
    $("#paneSpecs").css("display", "flex");
  });

  // Navigate to Developer panel
  $("#navDeveloper").on("click", function() {
    $("#paneDeveloper").css("display", "flex");
  });

  // Back buttons inside sub-panels
  $(".sub-back-btn").on("click", function() {
    $(this).closest(".sub-pane").fadeOut(150);
  });

  // Dark Mode toggle switch
  $("#darkModeSwitch").on("change", function() {
    const isChecked = $(this).is(":checked");
    if (isChecked) {
      $("body").addClass("dark-mode");
    } else {
      $("body").removeClass("dark-mode");
    }
    
    // Call parent handler to toggle global theme and sync other iframes
    if (window.parent && window.parent.toggleDarkMode) {
      window.parent.toggleDarkMode(isChecked);
    }
  });

  // Wallpaper selection trigger
  $(".wallpaper-card").on("click", function() {
    const styleVal = $(this).data("style");
    $(".wallpaper-card").removeClass("active");
    $(this).addClass("active");
    
    // Call parent handler to update root background
    if (window.parent && window.parent.changeWallpaper) {
      window.parent.changeWallpaper(styleVal);
    }
  });
});
