"use strict";
/** URI SEARCH TERMS **/
var params = new URLSearchParams(window.location.search);
if (window.history) {
  history.replaceState({}, "", window.location.href.substr(0, window.location.href.length - window.location.search.length));
}

/** TOAST **/

class Toast {
  constructor(message, type, duration, iconPath = "", action = "") {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.icon = iconPath;
    this.action = action;
    this.showToast();
  }
  showToast() {
    $(".toast").remove();
    let overlay = document.createElement("div"),
      toast = document.createElement("div");
    toast.classList.add("toast");
    overlay.classList.add("toast-overlay");
    toast.classList.add(this.type);
    if (this.icon != "") {
      toast.innerHTML += `<img src="${this.icon}" class="toast-icon" alt="Toast Popup Icon">`;
    }
    toast.innerHTML += this.message;
    if (this.action != "") {
      document.body.appendChild(overlay);
    }
    document.body.appendChild(toast);
    setTimeout(() => {
      $(toast).css({ animation: "slideOut 0.5s forwards" });
    }, this.duration);
    setTimeout(() => {
      overlay.remove();
      toast.remove();
      if (this.action != "" && this.action != "") {
        window.location.href = this.action;
      }
    }, this.duration + 500);
  }
}
class ErrorToast extends Toast {
  constructor(message, err, duration, action = "") {
    message += ": " + err;
    super(message, "default", duration, "/img/icon/toast/error-icon.svg", action);
  }
}
/** POPUP **/

class Popup {
  constructor(message, type, duration, iconPath = "", action = "") {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.icon = iconPath;
    this.action = action;
    this.showPopup();
  }
  showPopup() {
    $(".popup, .popup-overlay").remove();
    let overlay = document.createElement("div"),
      toast = document.createElement("div"),
      buttons = "<div id='popup-buttons'>";
    toast.classList.add("popup");
    overlay.classList.add("popup-overlay");
    for (let classData of this.type.split(" ")) {
      toast.classList.add(classData);
    }
    for (let actionInfo of this.action) {
      buttons += `<button class="popup-button ${actionInfo[2] == undefined ? "" : " " + actionInfo[2]}" onclick="${actionInfo[0]}">${actionInfo[1]}</button>`;
    }
    buttons += "</div>";
    toast.innerHTML += (this.icon != "" ? `<div class="popup-top-bar">` : "") + "<div class='popup-text'>" + this.message + `</div>` + (this.icon != "" ? `<img src="${this.icon}" class="popup-icon" alt="Popup Icon"></div>` : "");
    toast.innerHTML += buttons;
    if (this.action != "") {
      document.body.appendChild(overlay);
    }
    document.body.appendChild(toast);
    setTimeout(() => {
      $(toast).css({ animation: "fadeout 0.5s forwards" });
      $(overlay).css({ animation: "fadeout 0.5s forwards" });
    }, this.duration);
    setTimeout(() => {
      $(toast).remove();
      $(overlay).remove();
    }, this.duration + 500);
  }
}
function removePopup() {
  $(".popup").css({ animation: "fadeout 0.5s forwards" });
  $(".popup-overlay").css({ animation: "fadeout 0.5s forwards" });
  setTimeout(() => {
    $(".popup").remove();
    $(".popup-overlay").remove();
  }, 500);
}
$(document.body).on("click", ".popup-overlay", function () {
  removePopup();
});

/** Other **/
$("[placeholdaction]").click(function () {
  new Toast("This feature hasn't been implemented yet, sorry! 🤫", "default", 1500, "/img/icon/toast/unimplemented-icon.svg");
});

$(document.body).on("click", "*:not(a)[href]", function () {
  window.location.href = $(this).attr("href");
});
$(document.body).on("click", "#prompt-overlay", function () {
  $(this)
    .next("#prompt-container")
    .addClass("prompt-out")
    .add(this)
    .animate({ opacity: 0 }, 250, function () {
      $(this).remove();
      $("body").attr("style", "");
    });
});
