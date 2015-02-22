/**
 * @module lpp
 * @submodule base
 */
define(function(require, exports, module){
  var _utils = {};
  _utils.array = require('./Array');

  /**
   * @class Fn
   * @static
   * @since 1.0.0
   */
  var Fn = {};

  /**
   *  延迟执行函数
   *  
   *  @method delay
   *  @param {Function|Object} fn 函数,若类型为Object时格式就是{fn: 函数, scope: 执行上下文的this}
   *  @param {Number} [delay=1] 延迟时间
   *  @param {Any} params* 预设置入参
   *  @return {Object} 延迟契约<br/>
   *  契约属性：<br/> 
   *  {Object} symbol 延迟执行标识<br/>
   *  {Function} cancel 取消延迟执行
   */ 
  Fn.delay = function(fn, delay, params){
    var _params = [], _delay = delay || 1, _fn, rs;
    if (arguments.length >= 3){
      _params = _utils.array.toArray(arguments, 2);
    }
    _fn = function(){
      if (typeof fn === 'function'){
        fn.apply(window, _params);
      }
      else{
        fn.fn.apply(fn.scope, _params);
      }
    };

    rs = {
      symbol: setTimeout(_fn, _delay),
      cancel: function(){
        var self = this;
        clearTimeout(self.symbol);
      }
    };

    return rs;
  };

  module.exports = Fn;
});
