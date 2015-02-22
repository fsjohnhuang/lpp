/**
 * 动画模块
 * @module lpp
 * @submodule fx
 */
define(function(require, exports, module){
  "use strict";

  require('../shim');
  var _utils = {};
  _utils.browser = require('../Browser');
  _utils.fn = require('../Fn');

  /** 
   * @class fx
   * @static
   */
  
  /**
   * 获取DOM对象的透明属性值
   *
   * @method _getCurOpacity
   * @private
   * @param {HtmlElement} dom
   * @return {Number} 等于小于1的值
   */
  var _getCurOpacity = {
    'IE': function(dom){
      var filter = dom.currentStyle.filter;
      if (filter === '') return 1;
      
      var rs = /alpha\(opacity=(\d+(\.\d+)?)\)/.exec(filter);
      if (!rs || rs.length !== 3 || typeof rs[1] === 'undefined') return 1;

      return Number(rs[1]) / 100;
    },
    'nonIE': function(dom){
      return Number(window.getComputedStyle(dom, null).opacity);
    }
  };

  /**
   * 设置DOM对象的透明属性值
   *
   * @method _setCurOpacity
   * @private
   * @param {HtmlElement} dom
   * @param {Number} opacity 透明度等于小于1
   */
  var _setCurOpacity = {
    'IE': function(dom, opacity){
      var filter = dom.currentStyle.filter;
      var newFilter
        , regExp = /alpha\(opacity=\d+(\.\d+)?\)/i 
        , newOpacity = 'alpha(opacity=' + (opacity * 100) + ')';
      if (filter === ''){
        newFilter = newOpacity;
      }
      else{
        var rs = regExp.test(filter); 
        if (rs){
          newFilter = filter.replace(regExp, newOpacity);
        }
        else{
          newFilter += ';' + newOpacity;
        }
      }
      dom.style.filter = newFilter;
    },
    'nonIE': function(dom, opacity){
      dom.style.opacity = opacity;
    }
  };

  /**
   * 设置透明度
   *
   * @method fadeTo
   * @param {HtmlElement} dom DOM对象
   * @param {Number} opacity 透明度，等于小于1
   * @param {Number} [during=1] 动画时间
   * @param {Function} [callback] 动画结束的回调函数
   */
  exports.fadeTo = function(dom, opacity, during, callback){
    // 获取元素当前状态
    var curDisplay = window.getComputedStyle(dom, null).display;
    if (curDisplay === 'none'){
      callback && callback();
      return;
    }

    var isLtIE10 = _utils.browser.isLtIE(10);
    var getCurOpacity = _getCurOpacity[isLtIE10 ? 'IE' : 'nonIE'];
    var setCurOpacity = _setCurOpacity[isLtIE10 ? 'IE' : 'nonIE'];

    var curOpacity = getCurOpacity(dom);
    var step = (opacity - curOpacity) / during;
    for (var i = 0, len = during; i <= len; i++) {
      _utils.fn.delay(function(dom, delay, during, callback){
        setCurOpacity(dom, curOpacity + step * delay);

        delay === during && callback && callback();
      }, i, dom, i, during, callback);
    }
  };
});
