/**
 * 动画模块
 * @module lpp
 * @submodule fx
 */
define(function(require, exports, module){
  "use strict";

  var fx = require('./fadeTo');

  /** 
   * @class fx
   * @static
   */

  /**
   * 隐藏
   *
   * @method fadeTo
   * @param {HtmlElement} dom DOM对象
   * @param {Number} [during=1] 动画时间
   * @param {Function} [callback] 动画结束的回调函数
   */
  exports.fadeOut = function(dom, during, callback){
    fx.fadeTo(dom, 0, during, callback);
  };
});
