"use strict";

const AVATAR_COLORS = [
  "#f3a683", "#f19066", "#786fa6", "#574b90",
  "#3dc1d3", "#e15f41", "#cf6a87", "#c44569",
  "#303952", "#596275", "#05c46b", "#0fbcf9",
  "#ffa801", "#ffd32a", "#ff5e57", "#ff3f34"
];

const BOT_REPLIES = [
  "That sounds amazing! Let's build more features.",
  "I completely agree! Did you see the new Settings page specs?",
  "Haha, nice! mushOS 14 is running super smoothly on this mockup.",
  "Wow! You are doing a fantastic job with Antigravity.",
  "Let's test the Dialer app later! Dial a number.",
  "Can we verify the Calculator next? I want to run some math.",
  "Sounds good. Keep me posted!",
  "Great work! Let's keep improving the phone."
];

let contacts = [];
let threads = [];
let activeThread = null;

function loadContacts() {
  const stored = localStorage.getItem("app_contacts");
  if (stored) {
    contacts = JSON.parse(stored);
  } else {
    contacts = [
      { id: 1, name: "Tahir Ahmad", phone: "01700000000", email: "tahir@example.com" },
      { id: 2, name: "Antigravity AI", phone: "+1 (800) GEMINI-AI", email: "antigravity@google.com" },
      { id: 3, name: "Jane Doe", phone: "01822334455", email: "jane.doe@gmail.com" },
      { id: 4, name: "Elon Musk", phone: "+1 (555) 420-6969", email: "elon@spacex.com" }
    ];
  }
}

function loadThreads() {
  const stored = localStorage.getItem("app_threads");
  if (stored) {
    threads = JSON.parse(stored);
  } else {
    // Default seed conversations
    threads = [
      {
        id: 1,
        contactName: "Tahir Ahmad",
        contactPhone: "01700000000",
        lastMessage: "I finished implementing the Android CSS mockup!",
        timestamp: "12:30 PM",
        messages: [
          { sender: "them", text: "Hey! How's the project going?" },
          { sender: "me", text: "It is going well! Antigravity AI is helping me build features." },
          { sender: "them", text: "I finished implementing the Android CSS mockup!" }
        ]
      },
      {
        id: 2,
        contactName: "Jane Doe",
        contactPhone: "01822334455",
        lastMessage: "Sounds good, let's meet up later.",
        timestamp: "Yesterday",
        messages: [
          { sender: "me", text: "Are we still on for lunch?" },
          { sender: "them", text: "Yes, definitely!" },
          { sender: "me", text: "Great, see you at 1 PM." },
          { sender: "them", text: "Sounds good, let's meet up later." }
        ]
      }
    ];
    saveThreads();
  }
}

function saveThreads() {
  localStorage.setItem("app_threads", JSON.stringify(threads));
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
}

function renderThreads() {
  const container = $("#threadList");
  container.empty();
  
  if (threads.length === 0) {
    $("#noThreadsNotice").show();
  } else {
    $("#noThreadsNotice").hide();
    
    // Sort threads by ID desc (newest first)
    const sorted = [...threads].sort((a, b) => b.id - a.id);
    
    sorted.forEach(t => {
      const initial = t.contactName.charAt(0);
      const bg = getAvatarColor(t.contactName);
      
      const threadHtml = `
        <div class="thread-item" data-id="${t.id}">
          <div class="thread-avatar" style="background-color: ${bg}">${initial}</div>
          <div class="thread-details">
            <div class="thread-header">
              <span class="thread-name">${t.contactName}</span>
              <span class="thread-time">${t.timestamp}</span>
            </div>
            <span class="thread-preview">${t.lastMessage}</span>
          </div>
        </div>
      `;
      container.append(threadHtml);
    });
  }
}

function openChat(thread) {
  activeThread = thread;
  
  const initial = thread.contactName.charAt(0);
  const bg = getAvatarColor(thread.contactName);
  
  $("#chatHeaderAvatar").text(initial).css("background-color", bg);
  $("#chatHeaderName").text(thread.contactName);
  $("#chatHeaderStatus").text("Online");
  
  // Render messages
  const msgArea = $("#chatMessages");
  msgArea.empty();
  
  thread.messages.forEach(msg => {
    const bubbleClass = msg.sender === "me" ? "sent" : "received";
    msgArea.append(`<div class="msg-bubble ${bubbleClass}">${msg.text}</div>`);
  });
  
  $("#chatScreen").css("display", "flex");
  scrollChatToBottom();
}

function scrollChatToBottom() {
  const container = document.getElementById("chatMessages");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function sendMessage() {
  const input = $("#chatMessageInput");
  const text = input.val().trim();
  if (!text || !activeThread) return;
  
  // Append message locally
  const timeStr = formatTime(new Date());
  activeThread.messages.push({ sender: "me", text: text });
  activeThread.lastMessage = text;
  activeThread.timestamp = timeStr;
  
  saveThreads();
  renderThreads();
  
  // Update view
  $("#chatMessages").append(`<div class="msg-bubble sent">${text}</div>`);
  input.val("");
  scrollChatToBottom();
  
  // Trigger Auto-Response
  simulateReply();
}

function simulateReply() {
  $("#chatHeaderStatus").text("typing...");
  
  // Append typing bubble
  const typingHtml = `
    <div class="typing-bubble" id="typingBubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  $("#chatMessages").append(typingHtml);
  scrollChatToBottom();
  
  // Delayed bot response
  setTimeout(function() {
    $("#typingBubble").remove();
    $("#chatHeaderStatus").text("Online");
    
    if (!activeThread) return;
    
    const randomReply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
    const timeStr = formatTime(new Date());
    
    activeThread.messages.push({ sender: "them", text: randomReply });
    activeThread.lastMessage = randomReply;
    activeThread.timestamp = timeStr;
    
    saveThreads();
    renderThreads();
    
    $("#chatMessages").append(`<div class="msg-bubble received">${randomReply}</div>`);
    scrollChatToBottom();
  }, 1500);
}

function renderContactsList(filterText = "") {
  const container = $("#selectContactsList");
  container.empty();
  
  const filtered = contacts.filter(c => {
    const q = filterText.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q);
  }).sort((a, b) => a.name.localeCompare(b.name));
  
  filtered.forEach(c => {
    const initial = c.name.charAt(0);
    const bg = getAvatarColor(c.name);
    
    const contactHtml = `
      <div class="select-contact-item" data-phone="${c.phone}" data-name="${c.name}">
        <div class="suggested-avatar" style="background-color: ${bg}; width: 36px; height: 36px; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 500; margin-right: 12px; text-transform: uppercase;">${initial}</div>
        <div style="display: flex; flex-direction: column;">
          <span style="font-size: 13.5px; font-weight: 500;">${c.name}</span>
          <span style="font-size: 11px; color: #8e8e93;">${c.phone}</span>
        </div>
      </div>
    `;
    container.append(contactHtml);
  });
}

$(document).ready(function() {
  // Sync Dark Mode state from parent
  if (window.parent && window.parent.document.body.classList.contains("dark-mode")) {
    $("body").addClass("dark-mode");
  }

  loadContacts();
  loadThreads();
  renderThreads();

  // Route cross-app messaging trigger if any
  const msgName = localStorage.getItem("message_contact_name");
  const msgPhone = localStorage.getItem("message_contact_phone");
  if (msgName && msgPhone) {
    localStorage.removeItem("message_contact_name");
    localStorage.removeItem("message_contact_phone");
    
    // Check if thread exists
    let existingThread = threads.find(t => t.contactPhone.replace(/[\s\-\(\)]/g, "") === msgPhone.replace(/[\s\-\(\)]/g, ""));
    if (!existingThread) {
      existingThread = {
        id: Date.now(),
        contactName: msgName,
        contactPhone: msgPhone,
        lastMessage: "Start of conversation",
        timestamp: formatTime(new Date()),
        messages: []
      };
      threads.push(existingThread);
      saveThreads();
      renderThreads();
    }
    
    setTimeout(function() {
      openChat(existingThread);
    }, 450);
  }

  // Click on a thread opens chat
  $(document).on("click", ".thread-item", function() {
    const id = $(this).data("id");
    const thread = threads.find(t => t.id === id);
    if (thread) {
      openChat(thread);
    }
  });

  // Back from chat
  $("#chatBackBtn").on("click", function() {
    activeThread = null;
    $("#chatScreen").fadeOut(200);
  });

  // Open Contacts Drawer
  $("#openContactsListBtn").on("click", function() {
    renderContactsList();
    $("#contactsSelectOverlay").fadeIn(200);
  });

  // Close Contacts Drawer
  $("#closeSelectBtn, #contactsSelectOverlay").on("click", function(e) {
    if (e.target === this || e.target.id === "closeSelectBtn") {
      $("#contactsSelectOverlay").fadeOut(200);
    }
  });

  // Select contact to start chat
  $(document).on("click", ".select-contact-item", function() {
    const name = $(this).data("name");
    const phone = $(this).data("phone");
    
    // Check if thread exists
    let thread = threads.find(t => t.contactPhone.replace(/[\s\-\(\)]/g, "") === phone.replace(/[\s\-\(\)]/g, ""));
    if (!thread) {
      thread = {
        id: Date.now(),
        contactName: name,
        contactPhone: phone,
        lastMessage: "Conversation started",
        timestamp: formatTime(new Date()),
        messages: []
      };
      threads.push(thread);
      saveThreads();
      renderThreads();
    }
    
    $("#contactsSelectOverlay").fadeOut(150, function() {
      openChat(thread);
    });
  });

  // Filter contacts list in drawer
  $("#selectSearchInput").on("input", function() {
    renderContactsList($(this).val());
  });

  // Send message events
  $("#sendBtn").on("click", function() {
    sendMessage();
  });

  $("#chatMessageInput").on("keypress", function(e) {
    if (e.which === 13) {
      sendMessage();
    }
  });
});
