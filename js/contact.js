"use strict";

const AVATAR_COLORS = [
  "#f3a683", "#f19066", "#786fa6", "#574b90",
  "#3dc1d3", "#e15f41", "#cf6a87", "#c44569",
  "#303952", "#596275", "#05c46b", "#0fbcf9",
  "#ffa801", "#ffd32a", "#ff5e57", "#ff3f34"
];

// Seed contacts if empty
const defaultContacts = [
  { id: 1, name: "Tahir Ahmad", phone: "01700000000", email: "tahir@example.com" },
  { id: 2, name: "Antigravity AI", phone: "+1 (800) GEMINI-AI", email: "antigravity@google.com" },
  { id: 3, name: "Jane Doe", phone: "01822334455", email: "jane.doe@gmail.com" },
  { id: 4, name: "Elon Musk", phone: "+1 (555) 420-6969", email: "elon@spacex.com" }
];

let contacts = [];
let activeContact = null;

function loadContacts() {
  const stored = localStorage.getItem("app_contacts");
  if (stored) {
    contacts = JSON.parse(stored);
  } else {
    contacts = defaultContacts;
    saveContacts();
  }
}

function saveContacts() {
  localStorage.setItem("app_contacts", JSON.stringify(contacts));
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function renderContacts(filterText = "") {
  const listElement = $("#contactsList");
  listElement.empty();

  // Sort contacts alphabetically
  const filtered = contacts
    .filter(c => {
      const q = filterText.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.includes(q);
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (filtered.length === 0) {
    $("#noContactsNotice").show();
  } else {
    $("#noContactsNotice").hide();
    
    filtered.forEach(contact => {
      const initial = contact.name.charAt(0);
      const bg = getAvatarColor(contact.name);
      
      const itemHtml = `
        <div class="contact-item" data-id="${contact.id}">
          <div class="contact-avatar" style="background-color: ${bg}">${initial}</div>
          <div class="contact-info">
            <span class="contact-name">${contact.name}</span>
            <span class="contact-phone">${contact.phone}</span>
          </div>
        </div>
      `;
      listElement.append(itemHtml);
    });
  }
}

$(document).ready(function() {
  // Sync Dark Mode state from parent
  if (window.parent && window.parent.document.body.classList.contains("dark-mode")) {
    $("body").addClass("dark-mode");
  }

  loadContacts();
  renderContacts();

  // Search input
  $("#contactSearch").on("input", function() {
    renderContacts($(this).val());
  });

  // Open Details Modal
  $(document).on("click", ".contact-item", function() {
    const id = $(this).data("id");
    activeContact = contacts.find(c => c.id === id);
    
    if (activeContact) {
      const initial = activeContact.name.charAt(0);
      const bg = getAvatarColor(activeContact.name);
      
      $("#detailAvatar").text(initial).css("background-color", bg);
      $("#detailName").text(activeContact.name);
      $("#detailPhone").text(activeContact.phone);
      $("#detailEmail").text(activeContact.email || "No email address");
      
      $("#contactDetailModal").addClass("active");
    }
  });

  // Close Details Modal
  $("#closeDetailBtn, .modal-overlay").on("click", function() {
    $("#contactDetailModal").removeClass("active");
  });

  // Open Add Modal
  $("#openAddModalBtn").on("click", function() {
    $("#contactForm")[0].reset();
    $("#addContactModal").addClass("active");
  });

  // Close Add Modal
  $("#closeAddBtn, #addContactModal .modal-overlay").on("click", function() {
    $("#addContactModal").removeClass("active");
  });

  // Save Contact
  $("#contactForm").on("submit", function(e) {
    e.preventDefault();
    const name = $("#inputName").val().trim();
    const phone = $("#inputPhone").val().trim();
    const email = $("#inputEmail").val().trim();
    
    if (name && phone) {
      const newContact = {
        id: Date.now(),
        name,
        phone,
        email
      };
      
      contacts.push(newContact);
      saveContacts();
      renderContacts($("#contactSearch").val());
      $("#addContactModal").removeClass("active");
    }
  });

  // Call Action
  $("#detailCallAction").on("click", function() {
    if (activeContact && window.parent && window.parent.openDialerWithNumber) {
      window.parent.openDialerWithNumber(activeContact.phone);
      $("#contactDetailModal").removeClass("active");
    }
  });

  // Message Action
  $("#detailMessageAction").on("click", function() {
    if (activeContact && window.parent && window.parent.openMessengerWithContact) {
      window.parent.openMessengerWithContact(activeContact.name, activeContact.phone);
      $("#contactDetailModal").removeClass("active");
    }
  });

  // Delete Action
  $("#detailDeleteAction").on("click", function() {
    if (activeContact) {
      contacts = contacts.filter(c => c.id !== activeContact.id);
      saveContacts();
      renderContacts($("#contactSearch").val());
      $("#contactDetailModal").removeClass("active");
    }
  });
});
