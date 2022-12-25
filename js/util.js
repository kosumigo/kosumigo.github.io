"use strict";
/** URI SEARCH TERMS **/
var params = new URLSearchParams(window.location.search),
  user,
  userDocCache = {};
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
      toast.innerHTML += `<img alt="icon" src="${this.icon}" class="toast-icon" alt="Toast Popup Icon">`;
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
class WarningToast extends Toast {
  constructor(message, duration, action = "") {
    super(message, "default", duration, "/img/icon/toast/warning-icon.svg", action);
  }
}
/** POPUP **/

class Popup {
  constructor(message, type, duration, iconPath = "", action = "") {
    if (typeof message == "object") {
      this.title = message[0];
      this.message = message[1];
    } else {
      this.message = message;
    }
    this.type = type;
    this.duration = duration;
    this.icon = iconPath;
    this.action = action;
    this.showPopup();
  }
  showPopup() {
    $(".popup, .popup-overlay").remove();
    let overlay = $("<div></div>", { class: "popup-overlay " + this.type }),
      toast = $("<div></div>", { class: "popup" }),
      buttons = $("<div></div>", { id: "popup-buttons" });

    for (let actionInfo of this.action) {
      $("<button></button>", { class: "popup-button " + (actionInfo[2] ? actionInfo[2] : ""), onclick: actionInfo[0], text: actionInfo[1] }).appendTo(buttons);
    }
    if (this.icon) {
      $(`<img alt='Popup Icon' src="${this.icon}" class="popup-icon">`).appendTo(toast);
    }
    if (this.title) {
      $("<div></div>", { text: this.title, class: "popup-title" }).appendTo(toast);
    }
    $("<div></div>", { text: this.message, class: "popup-text" }).appendTo(toast);
    buttons.appendTo(toast);

    if (this.action) {
      overlay.appendTo(document.body);
    }
    toast.appendTo(document.body);
    setTimeout(() => {
      $(toast).css({ animation: "popupout 0.25s forwards" });
      $(overlay).css({ animation: "fadeout 0.5s forwards" });
    }, this.duration);
    setTimeout(() => {
      toast.remove();
      overlay.remove();
    }, this.duration + 500);
  }
}
function removePopup() {
  $(".popup").css({ animation: "popupout 0.25s forwards" });
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
window.addEventListener("load", function () {
  setTimeout(function () {
    // This hides the address bar:
    window.scrollTo(0, 1);
  }, 0);
});
/* fix for custom checkbox tab events */
// when .checkbox-icon or its parent label.checkbox-label is focused and the user presses enter, click the checkbox
$(".checkbox-icon, .checkbox-label").keydown(function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    $(this).parent().filter(".checkbox-label").click();
    $(this).focus();
  }
});
