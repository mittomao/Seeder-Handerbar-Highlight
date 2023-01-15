import JpControllerBase from './JpControllerBase.js';
import JpConsumerBase from './JpConsumeBase';

function JpProviderBase($el, options) {
  const _self = this;
  JpControllerBase.call(_self, $el, options);
}

JpProviderBase.prototype = Object.create(JpControllerBase.prototype);

JpProviderBase.prototype.setReducer = function (reducer) {
  const _self = this;
  _self.reducer = reducer;
};

JpProviderBase.prototype.getReducer = function () {
  const _self = this;
  return _self.reducer;
};

JpProviderBase.prototype.dispatch = function (action) {
  const _self = this;
  const oldState = _self.getState();
  const reducer = _self.getReducer();
  const newState = reducer(oldState, action);
  _self.setState(newState);
};

JpProviderBase.prototype.render = function (state) {
  const _self = this;
  const $descendants = _self.$el.closestDescendant('[data-jp-controller]', true);
  $descendants.toArray().forEach(function (item) {
    const controller = $(item).data('jp-controller-data');

    if ( controller instanceof JpConsumerBase ) {
      const childStateSelector = controller.getSelector();
      const newChildState = childStateSelector(state);
      const equalityFn = controller.getEqualityFn();
      const oldChildState = controller.getState();

      if (!(equalityFn(oldChildState, newChildState))) {
        $(item).jpCom('render', newChildState);
      }
    }
  });
};

export default JpProviderBase;
