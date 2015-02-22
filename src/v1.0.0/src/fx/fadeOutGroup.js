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
   * ���Ԫ�ذ���������
   * 
   * @method fadeOutGroup
   * @param {jQuery����}
   * @param {Boolean} [reverse=false] ��˳����������ж���
   * @param {Number} [during=200] ��˳����������ж���
   * @param {Function} [callback] �ص�����
   */
  exports.fadeOut = function (items, reverse, during, callback) {
      fx.fadeInorOut(items, false, reverse, during, callback);
  };
});
