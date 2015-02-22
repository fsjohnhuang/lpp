/**
 * @module lpp
 * @submodule fx
 */
define(function(require, exports, module){
  "use strict";

  var $ = require('$');
  var _utils = {};
  _utils.fn = require('../Fn');

  /**
   * @class fx
   * @static
   */

  /**
   * 多个元素显示或隐藏的动画效果
   *
   * @method fadeInorOut
   * @param {jQuery对象}
   * @param {Boolean} [fadeIn=false] 是否为显示效果
   * @param {Boolean} [reverse=false] 是顺序还是逆序进行动画
   * @param {Number} [during=200] 是顺序还是逆序进行动画
   * @param {Function} [callback] 回调函数
   */
 exports.fadeInorOut = function (items, fadeIn, reverse, during, callback) {
      var _fadeIn = true;
      if (fadeIn === false) {
          _fadeIn = false;
      }
      var _reverse = false, _during = 200, reverseType = typeof (reverse), duringType = typeof (during), _callback = callback;
      if (reverseType == 'boolean') {
          _reverse = reverse;
      }
      else if (reverseType == 'number') {
          _during = reverse;
      }
      else if (reverseType == 'function') {
          _callback = reverse;
      }
      if (duringType == 'number') {
          _during = during
      }
      else if (duringType == 'function')
      {
          _callback = during;
      }

      var fade =  _fadeIn ? 'fadeIn' : 'fadeOut';
      if (reverse) {
          for (var i = items.length - 1; i >= 0; i--) {
              _utils.fn.delay(function($item, fnName, during, callback){
                $item[fnName](during, callback);
              }, (items.length - i) * _during, $(items[i]), fade, _during, i === 0 && _callback || function(){});

              /*(function (idx, len) {
                  setTimeout(function () {
                      $(items[idx])[_fadeIn ? 'fadeIn' : 'fadeOut'](during, function () {
                          if (idx == 0) {
                              _callback && _callback();
                          }
                      });
                  }, (len - idx) * _during);
              })(i, items.length);*/
          }
      }
      else {
          for (var i = 0, len = items.length; i < len; i++) {
              _utils.fn.delay(function($item, fnName, during, callback){
                $item[fnName](during, callback);
              }, i * _during, $(items[i]), fade, _during, i === len - 1 && _callback || function(){});

              /*(function (idx) {
                  setTimeout(function () {
                      $(items[idx])[_fadeIn ? 'fadeIn' : 'fadeOut'](during, function () {
                          if (idx == len - 1) {
                              _callback && _callback();
                          }
                      });
                  }, idx * _during);
              })(i);*/
          }
      }
  };

  module.exports = se;
});
