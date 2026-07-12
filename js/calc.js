"use strict";

$(function() {
  // Sync theme
  if (window.parent && window.parent.document.body.classList.contains("dark-mode")) {
    $("body").addClass("dark-mode");
  }

  const input = $("#input");
  let currentString = "";
  let resultDisplayed = false;

  $(".btn").on("click", function() {
    const val = $(this).text().trim();
    
    // Clear
    if ($(this).attr("id") === "clear") {
      currentString = "";
      input.text("");
      resultDisplayed = false;
      return;
    }

    // Backspace
    if ($(this).attr("id") === "backspace" || $(this).find("i").hasClass("fa-backspace")) {
      if (currentString.length > 0) {
        currentString = currentString.substring(0, currentString.length - 1);
        input.text(currentString);
      }
      return;
    }

    // Equal
    if ($(this).attr("id") === "result" || val === "=") {
      if (!currentString) return;
      try {
        // Replace × with * and ÷ with / for eval
        let evalStr = currentString.replace(/×/g, "*").replace(/÷/g, "/");
        
        // Remove trailing operator if any
        const last = evalStr.charAt(evalStr.length - 1);
        if (["+", "-", "*", "/"].includes(last)) {
          evalStr = evalStr.substring(0, evalStr.length - 1);
        }
        
        let res = Function('"use strict";return (' + evalStr + ')')();
        
        // Format floating-point float precision
        if (res % 1 !== 0) {
          res = parseFloat(res.toFixed(8));
        }
        
        input.text(res);
        currentString = String(res);
        resultDisplayed = true;
      } catch (e) {
        input.text("Error");
        currentString = "";
        resultDisplayed = false;
      }
      return;
    }

    const isOperator = ["+", "-", "×", "÷"].includes(val);

    if (resultDisplayed) {
      if (isOperator) {
        resultDisplayed = false;
      } else {
        currentString = "";
        resultDisplayed = false;
      }
    }

    const lastChar = currentString.charAt(currentString.length - 1);
    const lastIsOperator = ["+", "-", "×", "÷"].includes(lastChar);

    if (isOperator && lastIsOperator) {
      // Switch operators
      currentString = currentString.substring(0, currentString.length - 1) + val;
    } else {
      if (isOperator && currentString.length === 0) {
        if (val === "-") {
          currentString += val;
        } else {
          return;
        }
      } else {
        currentString += val;
      }
    }

    input.text(currentString);

    // Auto-scroll output container
    const container = document.getElementById("input");
    if (container) {
      container.scrollLeft = container.scrollWidth;
    }
  });
});