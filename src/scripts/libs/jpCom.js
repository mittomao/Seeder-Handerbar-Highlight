import JpConsumeBase from './JpConsumeBase';
import MonthRangePickerController from '../components/MonthRangePickerController';

(function ($) {
  const COMPONENT_DATA_ATTR = 'jp-controller-data';
  const COMPONENT_ATTR = 'jp-controller';

  function createController($el, options) {
    const className = $el.data('jp-controller');

    switch (className) {
      case 'MonthRangePickerController':
        return new MonthRangePickerController($el, options);
      default:
        throw Error('controller class not found');
    }
  }

  $.fn.jpCom = function () {
    const $this = this;
    const options = arguments[0];
    const args = Array.prototype.slice.call(arguments, 1);
    const length = $this.length;

    for (let i = 0; i < length; i++) {
      const $element = $($this[i]);
      if (!$element.data(COMPONENT_ATTR)) {
        throw Error('Data jp-controller not found');
      }

      if (typeof options === 'object' || typeof options === 'undefined') {
        const controller = createController($element, options);
        $element.data(COMPONENT_DATA_ATTR, controller);
        if (!(controller instanceof JpConsumeBase)) {
          const state = controller.getState();
          controller.render(state);
        }
      } else {
        // options is string
        const methodName = arguments[0];
        const controller = $element.data(COMPONENT_DATA_ATTR);
        const result = $element.data(COMPONENT_DATA_ATTR)[methodName].apply(controller, args);
        if (methodName === 'render') {
          controller.componentDidUpdate();
        }
        return result;
      }
    }

    return $this;
  };
}(jQuery));
