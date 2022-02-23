$(function () {
  $('.lazy').Lazy();
  $('.search_icon').click(function () {
    $('#search').css("visibility", "visible");
    $('.search_close').css("visibility", "visible");
  });

  $('.search_close').click(function () {
    $('#search').css("visibility", "hidden");
    $(this).css("visibility", "hidden");
  });

  $('.show_more').on("click", function () {
    $(this).parent().find("div.summary").css("height", "auto");
    $(this).css("display", "none");
    $(this).parent().find("span.not_read").css("display", "block");
  })

  $('.not_read').on("click", function () {
    $(this).parent().find("div.summary").css("height", "120px");
    $(this).css("display", "none");
    $(this).parent().find("span.show_more").css("display", "block");
  })

  $('.detail_slider_photo').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  });


});

$(window).on("load", function () {
  setTimeout(() => {
    $(".loader-wrapper").fadeOut();
  }, 1300);
});