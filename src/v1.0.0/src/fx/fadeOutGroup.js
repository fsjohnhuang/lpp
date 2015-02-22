/**
 *  @module lpp
 *  @submodule fx
 */ 
define(function(require, exports, module){
  "use strict";

  var fx = require('./fadeInorOutGroup');

  /**
   * @class fx
   * @static
   */

  /**
   * 多个元素按次序隐藏
   * 
   * @method fadeOutGroup
   * @param {jQuery对象}
   * @param {Boolean} [reverse=false] 是顺序还是逆序进行动画
   * @param {Number} [during=200] 是顺序还是逆序进行动画
   * @param {Function} [callback] 回调函数
   */
  exports.fadeOut = function (items, reverse, during, callback) {
      fx.fadeInorOut(items, false, reverse, during, callback);
  };
});
