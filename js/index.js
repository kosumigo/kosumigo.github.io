$("#sections-nav > li").click(function () {
  $("#sections-nav > li").removeClass("active");
  $(this).addClass("active");
  var id = $(this).attr("id");
  $(".storyline-content > div").removeClass("active");
  $("#" + id + "-content").addClass("active");
  $("#lower-storyline").attr("section", id);
});
$(".footer-item").click(function () {
  window.location.href = $(this).attr("href");
});
class Meeting {
  constructor(json) {
    this.place_name = json.location.name;
    this.time = json.time;
    this.showbutton = json.showbutton;
    this.location = json.location;
    this.location.query = this.location.query ? this.location.query : `${this.location.latitude},${this.location.longitude}`;
  }
  formatTime() {
    let time = {
        start: new Date(this.time.start),
        end: new Date(this.time.end),
      },
      days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return `${time.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).replace("PM", "").replace("AM", "")} - ${time.end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} | ${days[time.start.getDay()]} ${time.start.getMonth() + 1}/${String(time.start.getDate()).padStart(2, "0")}`;
  }
  getHTML(showButton = true) {
    let buttonHTML = showButton ? `<button loadshimmerbg class="meeting-map-button accented-btn" href="https://maps.google.com/?q=${this.location.query}"><span loadshimmerslow class="slowshimmer">Open Map</span></button>` : "";
    return `<div class="meeting-card">
        <div class="meeting-location" loadshimmer>${this.place_name}</div>
        <div class="meeting-time" loadshimmer>${this.formatTime(this.time)}</div>
        ${buttonHTML}
      </div>`;
  }
}
// $("#learn-section").click(function () {
//   $.getJSON("./data/meetings.json")
//     .then((data) => {
//       $("#meeting-cards").empty();
//       for (meeting of data) {
//         var m = new Meeting(meeting);
//         $("#meeting-cards").append(m.getHTML(m.showbutton));
//       }
//       $(".meeting-map-button").each(function () {
//         var thisPopup = $(this);
//         thisPopup.colorbox({
//           iframe: true,
//           innerWidth: Math.min(600, $(window).width() - 20),
//           innerHeight: Math.min(500, $(window).width() - 40),
//           opacity: 0.7,
//           href: thisPopup.attr("href") + "&ie=UTF8&t=&output=embed",
//         });
//       });
//       //SHHHH THIS ISNT FOR LOOKS WDYM
//       setTimeout(function () {
//         $("[loadshimmer]").removeAttr("loadshimmer");
//         $("[loadshimmerslow]").removeAttr("loadshimmerslow");
//         $("[loadshimmerbg]").removeAttr("loadshimmerbg");
//       }, 700);
//     })
//     .catch((error) => {
//       console.error("Error getting meetings JSON:", error.error);
//     });
// });

// listen for scroll, then set theme bar color if the scroll has readched the top of #storyline-nav scrolltop
$(document.body).scroll(function () {
  if ($("#storyline-nav").offset().top <= 25) {
    $("meta[name=theme-color], meta[name='apple-mobile-web-app-status-bar']").attr("content", "#ffffff");
  } else {
    $("meta[name=theme-color], meta[name='apple-mobile-web-app-status-bar']").attr("content", "#141414");
  }
});
