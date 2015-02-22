/**
 * @module lpp
 * @submodule movie
 */
define(function(require, exports, module){

  /**
   * 幕布事件基类
   *
   * @class Curtain
   * @static
   */
  var STATUS = {
    /**
     * 挂幕布前触发
     *
     * @event BEFORE_SHOW
     */
    BEFORE_SHOW: 'beforeShow.curtain',
    /**
     * 挂幕布后触发
     *
     * @event AFTER_SHOW
     */
    AFTER_SHOW: 'afterShow.curtain',
    /**
     * 卸幕布前触发
     *
     * @event BEFORE_HIDE
     */
    BEFORE_HIDE: 'beforeHide.curtain',
    /**
     * 卸幕布后触发
     *
     * @event AFTER_HIDE
     */
    AFTER_HIDE: 'afterHide.curtain'
  };

  module.exports = STATUS
});
