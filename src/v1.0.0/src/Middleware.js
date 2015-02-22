// 中间件，用于解决模块互相调用的问题
define(function(require, exports, module){
  var lpp_Middleware = {};
  module.exports = lpp_Middleware;

  var _evts = {};

  var _toArray = function(args){
      var _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        item = args[_i];
        _results.push(item);
      }
      return _results;
  };

  lpp_Middleware.subscribe = function(key, fn, args){
    var _args = arguments.length >= 3 && _toArray(arguments).slice(2) || []
      , self = this == lpp_Middleware && window || this;
    _evts[key] = {
      fn: fn,
      scope: self,
      args: _args
    };
  };

  lpp_Middleware.unsubscribe = function(key){
    if (!key || !_evts[key]) return false;

    _evts[key] = {};
    return true;
  };

  lpp_Middleware.fire = function(key, args){
    if (!key || !_evts[key]) return;

    var scope = this, evt = _evts[key], _args = arguments.length > 1 && _toArray(arguments).slice(1) || [];
    if (scope === lpp_Middleware){
      scope = evt.scope;
    }
    return evt.fn.apply(scope, evt.args.concat(_args));
  };
});
