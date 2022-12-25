//tool to validate [data-role="email"] inputs for correctness and correspondingly update the closest ".input-pair" with a "valid" or "invalid" class

$("[data-role='email']").on("input change", function () {
  // use a regular expression to check if the input is a valid email
  let regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  if ($(this).val() && regex.test($(this).val())) {
    $(this).closest(".input-pair").removeClass("invalid").addClass("valid");
  } else {
    $(this).closest(".input-pair").removeClass("valid").addClass("invalid");
  }
});
function checkPairResponse(el) {
  if ($(el).hasClass("invalid")) {
    return false;
  } else if ($(el).find("input[type='radio']").length && !$(el).find("input[type='radio']:checked").length) {
    return false;
  } else if ($(el).find("input[type='radio']:checked + label .radio-label input").length && !$(el).find("input[type='radio']:checked + label .radio-label input").val()) {
    return false;
  } else if ($(el).children("input").length && !$(el).children("input").val()) {
    return false;
  }
  return true;
}
function checkResponse() {
  //filter using checkPairResponse()
  let invalid_parents = $("[data-required]").filter(function () {
    return !checkPairResponse(this);
  });

  $(".input-pair").not(invalid_parents).css("border-color", "");
  return invalid_parents;
}

// when an input changes, check if all required inputs are valid, and if they are enable the submit button
$("[data-required]").on("input change", function () {
  if (!checkPairResponse(this)) {
    $(this).css("border-color", "#e5573480");
    $("input[type='submit']").addClass("disabled");
  } else {
    $(this).css("border-color", "");
    if (!checkResponse().length) {
      $("input[type='submit']").removeClass("disabled");
    } else {
      $("input[type='submit']").addClass("disabled");
    }
  }
});
$(document.body).on("click", function (e) {
  $(".input-pair.active").removeClass("active");
});
$("form").on("click", ".input-pair", function () {
  $(".input-pair").removeClass("active");
  $(this).addClass("active");
});
$("form").on("submit", (e) => {
  e.preventDefault();
  let invalid_parents = checkResponse();
  //pulse the borders ref of any invalid inputs
  if (invalid_parents.length) {
    invalid_parents.each((i, parent) => {
      $(parent).css({ "border-color": "#e55734" });
      setTimeout(() => {
        $(parent).css({ "border-color": "#e5573480" });
      }, 600);
    });
    new WarningToast("Please fill out all required fields", 3000);
  } else {
    console.log("form submitted");
    new Toast("Response submitted! We'll reach out to you soon!", "default", 3000, "/img/icon/toast/success-icon.svg", "/");
  }
});
