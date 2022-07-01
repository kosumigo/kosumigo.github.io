$("#sections-nav > li").click(function () {
  $("#sections-nav > li").removeClass("active");
  $(this).addClass("active");
  var id = $(this).attr("id");
  $(".storyline-content > div").removeClass("active");
  $("#" + id + "-content").addClass("active");
  $("#lower-storyline").attr("section", id);
});
