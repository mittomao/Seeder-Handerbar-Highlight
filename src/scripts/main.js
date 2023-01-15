//Plugin
import '../../node_modules/slick-carousel/slick/slick.min';
import './libs/jpCom';
import './slider';
// import './components/navbar';

(function () {
  //Init Dom
  const $monthRangePicker = $('.js-month-range-picker');

  if ($monthRangePicker.length) {
    $monthRangePicker.jpCom();
  }
})(window, jQuery);
