"use strict";

const AVATAR_COLORS = [
  "#f3a683", "#f19066", "#786fa6", "#574b90",
  "#3dc1d3", "#e15f41", "#cf6a87", "#c44569",
  "#303952", "#596275", "#05c46b", "#0fbcf9",
  "#ffa801", "#ffd32a", "#ff5e57", "#ff3f34"
];

let contacts = [];
let callTimerInterval = null;
let callDuration = 0;
let toneCtx = null;

// Initialize Audio Context for dialer tones
function initToneContext() {
  if (!toneCtx) {
    toneCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playKeypadTone(digit) {
  try {
    initToneContext();
    if (toneCtx.state === "suspended") {
      toneCtx.resume();
    }
    
    // Simple tone mapping depending on digit
    let freq = 800;
    if (digit === '1') freq = 697;
    else if (digit === '2') freq = 770;
    else if (digit === '3') freq = 852;
    else if (digit === '4') freq = 697 + 50;
    else if (digit === '5') freq = 770 + 50;
    else if (digit === '6') freq = 852 + 50;
    else if (digit === '7') freq = 697 + 100;
    else if (digit === '8') freq = 770 + 100;
    else if (digit === '9') freq = 852 + 100;
    else if (digit === '*') freq = 941;
    else if (digit === '0') freq = 941 + 50;
    else if (digit === '#') freq = 941 + 100;

    const osc = toneCtx.createOscillator();
    const gainNode = toneCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(toneCtx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, toneCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.08, toneCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, toneCtx.currentTime + 0.15);
    
    osc.start();
    osc.stop(toneCtx.currentTime + 0.18);
  } catch (e) {
    console.error("Audio tone error", e);
  }
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function loadContacts() {
  const stored = localStorage.getItem("app_contacts");
  if (stored) {
    contacts = JSON.parse(stored);
  } else {
    // Default list
    contacts = [
      { id: 1, name: "Tahir Ahmad", phone: "01700000000", email: "tahir@example.com" },
      { id: 2, name: "Antigravity AI", phone: "+1 (800) GEMINI-AI", email: "antigravity@google.com" },
      { id: 3, name: "Jane Doe", phone: "01822334455", email: "jane.doe@gmail.com" },
      { id: 4, name: "Elon Musk", phone: "+1 (555) 420-6969", email: "elon@spacex.com" }
    ];
  }
}

function querySuggestions(number) {
  const container = $("#suggestionsContainer");
  container.empty();
  
  if (!number) return;
  
  const matches = contacts.filter(c => {
    return c.phone.includes(number) || c.name.toLowerCase().includes(number.toLowerCase());
  }).slice(0, 3); // limit to 3 suggestions
  
  matches.forEach(contact => {
    const initial = contact.name.charAt(0);
    const bg = getAvatarColor(contact.name);
    
    const html = `
      <div class="suggested-item" data-phone="${contact.phone}">
        <div class="suggested-avatar" style="background-color: ${bg}">${initial}</div>
        <div class="suggested-info">
          <span class="suggested-name">${contact.name}</span>
          <span class="suggested-phone">${contact.phone}</span>
        </div>
      </div>
    `;
    container.append(html);
  });
}

function startCallFlow(number) {
  if (!number) return;
  
  // Find matching contact
  const contact = contacts.find(c => c.phone.replace(/[\s\-\(\)]/g, "") === number.replace(/[\s\-\(\)]/g, ""));
  const name = contact ? contact.name : "Unknown Number";
  const initial = name.charAt(0);
  const bg = getAvatarColor(name);
  
  // Setup overlay values
  $("#callAvatar").text(initial).css("background-color", bg);
  $("#callRecipientName").text(name);
  $("#callRecipientNumber").text(number);
  $("#callStatusText").text("Dialing...");
  $("#callTimer").hide().text("00:00");
  
  // Activate UI
  $("#callOverlay").css("display", "flex");
  
  // Reset states
  $(".call-action-btn").removeClass("active");
  callDuration = 0;
  clearInterval(callTimerInterval);
  
  // Ringing phase timer
  setTimeout(function() {
    if ($("#callOverlay").is(":visible") && $("#callStatusText").text() === "Dialing...") {
      $("#callStatusText").text("Ringing...");
      
      // Connect phase timer
      setTimeout(function() {
        if ($("#callOverlay").is(":visible") && $("#callStatusText").text() === "Ringing...") {
          $("#callStatusText").text("Connected");
          $("#callTimer").fadeIn(200);
          
          callTimerInterval = setInterval(function() {
            callDuration++;
            const minutes = Math.floor(callDuration / 60);
            const seconds = callDuration % 60;
            const padMin = minutes < 10 ? "0" + minutes : minutes;
            const padSec = seconds < 10 ? "0" + seconds : seconds;
            $("#callTimer").text(padMin + ":" + padSec);
          }, 1000);
        }
      }, 2000);
    }
  }, 1500);
}

function endCall() {
  clearInterval(callTimerInterval);
  $("#callOverlay").fadeOut(300, function() {
    $("#num_text span").text("");
    $("#suggestionsContainer").empty();
  });
}

$(function() {
  // Sync Dark Mode state from parent
  if (window.parent && window.parent.document.body.classList.contains("dark-mode")) {
    $("body").addClass("dark-mode");
  }

  loadContacts();

  // Check if a trigger dial request exists
  const dialReq = localStorage.getItem("dial_number");
  if (dialReq) {
    localStorage.removeItem("dial_number");
    $("#num_text span").text(dialReq);
    setTimeout(function() {
      startCallFlow(dialReq);
    }, 400);
  }

  // Keypad Number keys
  $(".c_num").on("click", function() {
    const char = $(this).text().trim();
    playKeypadTone(char);
    
    const current = $("#num_text span").text();
    $("#num_text span").text(current + char);
    
    const updated = $("#num_text span").text();
    querySuggestions(updated);
    
    // Auto-scroll number display to the right
    const width = $("#num_text span").width();
    const containerWidth = $("#num_text").width();
    const scrollAmount = width - containerWidth;
    if (scrollAmount > 0) {
      $("#num_text").scrollLeft(scrollAmount);
    }
  });

  // Backspace single press
  $(".cut_number").on("click", function() {
    const current = $("#num_text span").text();
    if (current.length > 0) {
      const updated = current.substring(0, current.length - 1);
      $("#num_text span").text(updated);
      querySuggestions(updated);
    }
  });

  // Backspace press and hold to wipe
  let backspaceTimeout;
  $(".cut_number").on("mousedown touchstart", function() {
    backspaceTimeout = setInterval(function() {
      const current = $("#num_text span").text();
      if (current.length > 0) {
        const updated = current.substring(0, current.length - 1);
        $("#num_text span").text(updated);
        querySuggestions(updated);
      } else {
        clearInterval(backspaceTimeout);
      }
    }, 150);
  }).on("mouseup mouseleave touchend", function() {
    clearInterval(backspaceTimeout);
  });

  // Hitting suggestion fills number and calls
  $(document).on("click", ".suggested-item", function() {
    const phone = $(this).data("phone");
    $("#num_text span").text(phone);
    $("#suggestionsContainer").empty();
    startCallFlow(phone);
  });

  // Trigger call from dialer
  $("#callButton").on("click", function() {
    const num = $("#num_text span").text();
    if (num) {
      startCallFlow(num);
    }
  });

  // Hangups
  $("#hangupBtn").on("click", function() {
    endCall();
  });

  // Call actions
  $("#btnMute").on("click", function() {
    $(this).toggleClass("active");
  });

  $("#btnSpeaker").on("click", function() {
    $(this).toggleClass("active");
  });

  $("#btnHold").on("click", function() {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      clearInterval(callTimerInterval);
      $("#callStatusText").text("On Hold");
    } else {
      $("#callStatusText").text("Connected");
      // Resume timer
      callTimerInterval = setInterval(function() {
        callDuration++;
        const minutes = Math.floor(callDuration / 60);
        const seconds = callDuration % 60;
        const padMin = minutes < 10 ? "0" + minutes : minutes;
        const padSec = seconds < 10 ? "0" + seconds : seconds;
        $("#callTimer").text(padMin + ":" + padSec);
      }, 1000);
    }
  });
});
