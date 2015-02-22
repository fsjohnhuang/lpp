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
   * 显示
   *
   * @method fadeIn
   * @param {HtmlElement} dom DOM对象
   * @param {Number} [during=1] 动画时间
   * @param {Function} [callback] 动画结束的回调函数
   */
  exports.fadeIn = function(dom, during, callback){
    fx.fadeTo(dom, 1, during, callback);
  };
});
