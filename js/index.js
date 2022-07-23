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
$.getJSON("../data/meetings.json")
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Error getting meetings JSON:", error.error);
  });
