$(document).on('ready', function () {
  const $specialList = $('.js-special-list');

  const slickOption = {
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: '<a class="slick-arrow slick-arrow--prev"><i class="fa fa-angle-left" aria-hidden="true"></i></a>',
    nextArrow: '<a class="slick-arrow slick-arrow--next"><i class="fa fa-angle-right" aria-hidden="true"></i></a>'
  };

  if ($specialList.length) {
    $specialList.slick(slickOption);
  }
});
