/**
 * jQuery功能增强模块
 *
 * @module lpp
 * @submodule $
 */
define(function(require, exports, module){
  var $ = require('$');

  /**
   * @class EvtBooster
   * @static
   */

  // 增强click事件
  $.event.special.click = {
    setup: function(data, ns){
            $(this).css('cursor', 'pointer');
            return false;
           },
    teardown: function(ns){
                $(this).css('cursor', 'default');
                return false;
              }
  };
});
