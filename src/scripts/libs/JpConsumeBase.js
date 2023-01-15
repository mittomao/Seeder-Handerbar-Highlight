import JpControllerBase from './JpControllerBase.js';
import JpProviderBase from './JpProviderBase';

function JpConsumerBase($el, options) {
  const _self = this;
  JpControllerBase.call(_self, $el, options);

  function defaultSelector (state) {
    return { ...state };
  }

  function defaultEqualityFn (state1, state2) {
    return state1 === state2;
  }

  _self.defaultEqualityFn = defaultEqualityFn;
  _self.defaultSelector = defaultSelector;
}

JpConsumerBase.prototype = Object.create(JpControllerBase.prototype);

JpConsumerBase.prototype.useSelector = function (selector, equalityFn) {
  const _self = this;
  _self.selector = selector;
  _self.equalityFn = equalityFn;
};

JpConsumerBase.prototype.getSelector = function () {
  const _self = this;
  if (_self.selector) {
    return _self.selector;
  }
  else {
    return _self.defaultSelector;
  }
};

JpConsumerBase.prototype.getEqualityFn = function () {
  const _self = this;
  if (_self.equalityFn) {
    return _self.equalityFn;
  }
  else {
    return _self.defaultEqualityFn;
  }
};

JpConsumerBase.prototype.dispatch = function (action) {
  const _self = this;
  const $provider = _self.$el.parent().closest('[data-jp-controller]');
  if ($provider.length === 0) {
    throw new Error('jp provider not found');
  } else {
    const $parent = $($provider[0]);
    const controller = $parent.data('jp-controller-data');
    if ( controller instanceof JpProviderBase ) {
      controller.dispatch(action);
    }
    else {
      throw new Error('jp provider is not JpProviderBase');
    }
  }
};

JpConsumerBase.prototype.getState = function () {
  const _self = this;
  const $provider = _self.$el.parent().closest('[data-jp-controller]');

  if ($provider.length === 0) {
    throw new Error('jp provider not found');
  } else {
    const $parent = $($provider[0]);
    const controller = $parent.data('jp-controller-data');
    if ( controller instanceof JpProviderBase ) {
      const stateSelector = _self.getSelector();
      const childState = stateSelector(controller.getState());
      return childState;
    }
    else {
      throw new Error('jp provider is not jqpProviderBase');
    }
  }
};

export default JpConsumerBase;
