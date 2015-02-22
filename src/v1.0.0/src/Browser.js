/**
 * @module lpp
 * @submodule base
 */
define(function(require, exports, module){
  var _utils = {};
  _utils.str = require('./Str');

  /**
   * 浏览器辅助类
   * @class Browser
   * @static
   * @since 1.0.0
   */
  var Browser = {};

  /**
   * 判断IE是否低于某个版本
   *
   * @method isLtIE
   * @param {Number} version 版本号
   * @return {Boolean}
   */
  Browser.isLtIE = function(version){
    var ua = navigator.userAgent;
    return ua.indexOf('MSIE') > 0 && parseInt(_utils.str.trim(ua.split(';')[1].replace('MSIE', ''))) < version;
  };

  /**
   * 判断是否为IE
   *
   * @method isIE
   * @return {Boolean}
   */
  Browser.isIE = function(){
    return navigator.userAgent.indexOf('MSIE') > 0;
  };

  module.exports = Browser;
});
