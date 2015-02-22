/**
 * 动画模块
 * @module lpp
 * @submodule fx
 */
define(function(require, exports, module){
  require('../shim');
  var _utils = {};
  _utils.array = require('../Array');
  _utils.str = require('../Str');
  _utils.fn = require('../Fn');
  _utils.css = require('../Css');

  /** 
   * @class fx
   * @static
   */

  /**
   * @attribute _setCss 设置元素样式的方法集合
   * @private
   */
  var _setCss = {
    /**
     * 计算数值类型的下一个样式值
     *
     * @method calcNextNumVal
     * @private
     * @param {Object} fxCss 整理后的动画样式配置项
     * @param {String} prop fxCss的属性键名
     * @return {Number} 下一个样式值
     */
    calcNextNumVal: function(fxCss, prop){
            fxCss[prop].curVal += fxCss[prop].step;
            return fxCss[prop].curVal;
          },
    /**
     * 计算颜色类型的下一个样式值
     *
     * @method calcNextColorVal
     * @private
     * @param {Object} fxCss 整理后的动画样式配置项
     * @param {String} prop fxCss的属性键名
     * @return {Number} 下一个样式值
     */
    calcNextColorVal: function(fxCss, prop){
                        fxCss[prop].curVal.red = fxCss[prop].curVal.red + fxCss[prop].rStep;
                        fxCss[prop].curVal.green = fxCss[prop].curVal.green + fxCss[prop].gStep;
                        fxCss[prop].curVal.blue = fxCss[prop].curVal.blue + fxCss[prop].bStep;

                        var _red = _utils.css.getValidColor(fxCss[prop].curVal.red)
                            , _green = _utils.css.getValidColor(fxCss[prop].curVal.green)
                            , _blue = _utils.css.getValidColor(fxCss[prop].curVal.blue);
                        return _utils.css.toColorHexStr(_red, _green, _blue);
                      }
  };
  /**
   * 设置如width、height、top、left等样式属性值
   *
   * @method offsetCss 
   * @private
   * @param {HtmlElement} dom
   * @param {Object} fxCss 整理后的动画样式配置项
   * @param {String} prop fxCss的属性键名
   */
  _setCss.offsetCss = function(dom, fxCss, prop){
    dom.style[prop] = this.calcNextNumVal(fxCss, prop) + 'px';
  }.bind(_setCss);
  /**
   * 设置如strokeWeight等样式属性值
   *
   * @method vmlNumCss 
   * @private
   * @type Function
   * @param {HtmlElement} dom
   * @param {Object} fxCss 整理后的动画样式配置项
   * @param {String} prop fxCss的属性键名
   */
  _setCss.vmlNumCss = function(dom, fxCss, prop){
    dom[prop] = this.calcNextNumVal(fxCss, prop) + 'px';
  }.bind(_setCss);
  /**
   * 设置如strokeColor等样式属性值
   *
   * @method vmlColorCss 
   * @private
   * @type Function
   * @param {HtmlElement} dom
   * @param {Object} fxCss 整理后的动画样式配置项
   * @param {String} prop fxCss的属性键名
   */
  _setCss.vmlColorCss = function(dom, fxCss, prop){
    dom[prop] = this.calcNextColorVal(fxCss, prop);
    dom['data-' + prop] = dom[prop];
  }.bind(_setCss);
  /**
   * 设置如borderColor, backgroundColor, color等样式属性值
   *
   * @method colorCss 
   * @private
   * @param {HtmlElement} dom
   * @param {Object} fxCss 整理后的动画样式配置项
   * @param {String} prop fxCss的属性键名
   */
  _setCss.colorCss = function(dom, fxCss, prop){
    dom.style[prop] = this.calcNextColorVal(fxCss, prop);
  }.bind(_setCss);
  /**
   * 设置如backgroundImage等样式属性值
   *
   * @method defaultCss 
   * @private
   * @param {HtmlElement} dom
   * @param {Object} fxCss 整理后的动画样式配置项
   * @param {String} prop fxCss的属性键名
   */
  _setCss.defaultCss = function(dom, fxCss, prop){
    dom.style[prop] = fxCss[prop].targetVal;
  }.bind(_setCss);

  var _offsets = ['width', 'height', 'top', 'left', 'right'];
  var _vmlNums = ['strokeWeight'];
  var _vmlColors = ['strokeColor'];
  var _colors = ['backgroundColor', 'color', 'borderColor'];

  /**
   * 仿jQuery的animate动画函数
   *
   * @method animate
   * @param {HtmlElement} dom DOM对象
   * @param {Object} css css属性集合
   * @param {Number} during 动画时间
   * @param {FxQ} fxQ 动画队列管理器
   * @param {Function} callback 动画结束时的回调函数
   */
  exports.animate = function (dom, css, during, callback) {
      during = during || 1;

      // 整理动画属性
      var fxCss = {};
      var offsetCss = [];
      var vmlNumCss = [];
      var vmlColorCss = [];
      var colorCss = [];
      var otherCss = [];
      for (var prop in css){
        if (_offsets.indexOf(prop) >=0){
          offsetCss.push(prop);
        }
        else if (_vmlNums.indexOf(prop) >= 0){
          vmlNumCss.push(prop);
        }
        else if (_vmlColors.indexOf(prop) >= 0){
          vmlColorCss.push(prop);
        }
        else if (_colors.indexOf(prop) >=0){
          colorCss.push(prop);
        }
        else{
          otherCss.push(prop);
        }
      }

      // 整理width, hegiht, top, left动画属性
      var i = 0, len = offsetCss.length;
      if (len){
        var origDisplay = window.getComputedStyle(dom).display;
        if (origDisplay === 'none'){
          dom.style.display = 'block';
        }
        for (; i < len; i++) {
          var prop = offsetCss[i]; 
          var finalProp = prop, targetVal = css[prop], hasTrans = false;
          if (finalProp === 'right'){
            finalProp = 'left';
            targetVal = dom.offsetParent.offsetWidth - targetVal - dom.offsetWidth;
            hasTrans = true;
          }
          if (finalProp === 'bottom'){
            finalProp = 'top';
            targetVal = dom.offsetParent.offsetHeight - targetVal - dom.offsetHeight;
            hasTrans = true;
          }
          if (hasTrans){
            delete fxCss[prop];
            offsetCss[i] = finalProp;
          }
          fxCss[finalProp] = {
            curVal: dom['offset' + _utils.str.toUpperCase(finalProp, 0)],
            targetVal: targetVal
          };
          fxCss[finalProp].step = (targetVal - fxCss[finalProp].curVal) / during;
        }
        dom.style.display = origDisplay;
      }

      // 整理vml的strokeWeight动画属性
      var i = 0, len = vmlNumCss.length;
      if (len){
        for (; i < len; i++) {
          var prop = vmlNumCss[i]; 
          fxCss[prop] = {
            curVal: Number(String(dom['data-' + prop]).replace(/px/ig, '')),
            targetVal: css[prop]
          };
          fxCss[prop].step = (css[prop] - fxCss[prop].curVal) / during;
        }
      }

      // 整理vml的strokeColor动画属性
      i = 0, len = vmlColorCss.length;
      for (; i < len; i++) {
        var prop = vmlColorCss[i];
        fxCss[prop] = {
          curVal: _utils.css.toRGB(dom[prop].value),
          targetVal: _utils.css.toRGB(css[prop])
        };
        fxCss[prop].rStep = (fxCss[prop].targetVal.red - fxCss[prop].curVal.red) / during;
        fxCss[prop].gStep = (fxCss[prop].targetVal.green - fxCss[prop].curVal.green) / during;
        fxCss[prop].bStep = (fxCss[prop].targetVal.blue - fxCss[prop].curVal.blue) / during;
      } 

      // 整理color, borderColor, backgroundColor动画属性
      i = 0, len = colorCss.length;
      for (; i < len; i++) {
        var prop = colorCss[i];
        fxCss[prop] = {
          curVal: _utils.css.toRGB(window.getComputedStyle(dom)[prop]),
          targetVal: _utils.css.toRGB(css[prop])
        };
        fxCss[prop].rStep = (fxCss[prop].targetVal.red - fxCss[prop].curVal.red) / during;
        fxCss[prop].gStep = (fxCss[prop].targetVal.green - fxCss[prop].curVal.green) / during;
        fxCss[prop].bStep = (fxCss[prop].targetVal.blue - fxCss[prop].curVal.blue) / during;
      } 

      // 整理其他动画属性
      i = 0, len = otherCss.length;
      for (; i < len; i++) {
        var prop = otherCss[i];
        fxCss[prop].targetVal = css[prop];
      }

      // 运行动画
      for (var i = 1; i <= during; i++) {
           _utils.fn.delay(function (delay, during, dom, fxCss, callback) {
              for (var prop in fxCss) {
                 var setCss;
                 if (_offsets.indexOf(prop) >= 0){
                   setCss = _setCss.offsetCss;
                 }
                 else if (_vmlNums.indexOf(prop) >= 0){
                   setCss = _setCss.vmlNumCss;
                 }  
                 else if (_vmlColors.indexOf(prop) >= 0) {
                   setCss = _setCss.vmlColorCss;
                 }
                 else if (_colors.indexOf(prop) >= 0) {
                   setCss = _setCss.colorCss;
                 }
                 else {
                   setCss = _setCss.defaultCss;
                 }
                 setCss(dom, fxCss, prop);
              }

              delay == during && callback && callback(self);
          }, i, i, during, dom, fxCss, callback);
      }
  };
});
