function JpControllerBase($el, options) {
  const _self = this;
  _self.options = options || {};
  _self.$el = $el;
}

JpControllerBase.prototype.useState = function (initialState) {
  const _self = this;
  _self.state = initialState;
};

JpControllerBase.prototype.setState = function (state) {
  const _self = this;
  _self.state = state;
  _self.$el.jpCom('render', state);
};

JpControllerBase.prototype.getState = function () {
  const _self = this;
  return _self.state;
};

JpControllerBase.prototype.useEffect = function (fn) {
  const _self = this;
  _self.effectFn = fn;
};

JpControllerBase.prototype.componentDidUpdate = function () {
  const _self = this;
  if ( _self.effectFn) {
    _self.effectFn();
  }
};

JpControllerBase.prototype.render = function (state) {
  throw Error('can not call JpControllerBase' + state);
};

export default JpControllerBase;
