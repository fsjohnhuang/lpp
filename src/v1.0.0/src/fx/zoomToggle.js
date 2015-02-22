/**
 * ����ģ��
 *
 * @module lpp
 * @submodule fx
 */
define(function(require, exports, module){
  "use strict";

  require('../shim');
  var $ = require('$');

  /** 
   * @class fx
   * @static
   */

  /**
   * �¼�������
   *
   * @method _evtHandler
   * @private
   * @param {EventObject} e �¼�ʵ��
   */
  var _evtHandler = function(e){
    var $el = this.$target || $(e.target);
    if (this.isQueue && !$el.parent().find(':animated').length) return;
    var w = $el.width(), h = $el.height(), t1 = this.t1, t2 = this.t2;
    var add = '+=', minus = '-='
        , t1Setting = { width: add + t1, height: add + t1, top: minus + t1 / 2, left: minus + t1 / 2 }
        , t1Return = { width: minus + t1, height: minus + t1, top: add + t1 / 2, left: add + t1 / 2 }
        , t2Setting = { width: add + t2, height: add + t2, top: minus + t2 / 2, left: minus + t2 / 2 }
        , t2Return = { width: minus + t2, height: minus + t2, top: add + t2 / 2, left: add + t2 / 2 };

    $el.animate(t1Setting, this.d1)
      .animate(t1Return, this.d1)
      .animate(t2Setting, this.d2)
      .animate(t2Return, this.d2, this.callback || function(){});
  }

  /**
   * �Ŵ���С����
   *
   * @method zoomToggle
   * @param {jQuery����} $target
   * @param {Number} [d1=180] ��һ���ڵĶ���ʱ��
   * @param {Number} [d2=150] �ڶ����ڵĶ���ʱ��
   * @param {Number} [t1=10] ��һ���ڵķŴ���С����
   * @param {Number} [t2=6] �ڶ����ڵķŴ���С����
   * @param {Function} callback �ص�����
   * @return {Function({EventObject})} �¼���������ִ��������this�̶����䡣
   */
  exports.zoomToggle = function ($target, d1, d2, t1, t2, callback) {
      callback = typeof d1 === 'function' && d1 || typeof d2 === 'function' && d2 || typeof t1 === 'function' && t1 || typeof t2 === 'function' && t2 || callback;
      d1 = typeof d1 === 'number' && d1 || 180, d2 = typeof d2 === 'number' && d2 || 150
        , t1 = typeof t1 === 'number' && t1 || 10, t2 = typeof t2 === 'number' && t2 || 6;

      return _evtHandler.bind({$target: $target, d1: d1, d2: d2, t1: t1, t2: t2, callback: callback});
  };
});
