$(".menu-item").click(function () {
  $(".menu-item").removeClass("active");
  $(this).addClass("active");
  $("#tabs-container").attr("current-page", $(this).attr("data-page"));
  $(".tab").removeClass("active");
  $(`.tab[data-page-name="${$(this).attr("data-page")}"]`).addClass("active");
});
$("#group-descriptor").click(function () {
  window.location.href = "/";
});
