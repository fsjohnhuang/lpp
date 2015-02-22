/**
 * @module lpp
 * @submodule base
 */
define(function(require, exports, module){
  "use strict";

  var _utils = {};
  _utils.str = require('./Str');
  _utils.math = require('./Math');

  /**
   * @private
   * @readOnly
   * @attribute COLOR_MAP 颜色映射表
   */
  var COLOR_MAP = {
    Red: {
           name: '红色',
           hex: '#FF0000'
         },
    LightPink: {
                 name: '浅粉色',
                 hex: '#FFB6C1'
               },
    Pink: {
            name: '粉色',
            hex: '#FFC0CB'
          },
    Crimson: {
               name: '猩红',
               hex: '#DC143C'
             },
    Black: {
             name: '纯黑',
             hex: '#000000'
           },
    DimGray: {
               name: '暗淡的灰色',
               hex: '#696969'
             },
    Gray: {
            name: '灰色',
            hex: '#808080'
          }
  };

  /**
   * @class Css
   * @static
   * @since 1.0.0
   */
  var Css = {};

  var _parseColor = {
    /**
     * 处理toColorHexStr的入参
     * @private
     * @method _parseColor1
     * @parma {Object|String} color <br/>
     * String类型时形如#000000,yellow,rgb(123,12,31) <br/>
     * Object类型时形如{red{Number}, green{Number}, blue{Number}}
     * @return {String} 形如#000000,yellow,rgb(123,12,31) 
     */
    '1': function(color){
      var type = typeof color;
      if (type === 'object'){
        return 'rgb(' + color.red + ',' + color.green + ',' + color.blue + ')';
      }
      else if(type === 'string'){
        return color;
      }
    },
    /**
     * 处理toColorHexStr的入参
     * @private
     * @method _parseColor3
     * @parma {Number} r 
     * @parma {Number} g 
     * @parma {Number} b 
     * @return {String} 形如rgb(123,12,31) 
     */
    '3': function(r, g, b){
      return 'rgb(' + r 
          + ',' + (typeof g === 'number' && g !== null ? g : 0) 
          + ',' + (typeof b === 'number' && b !== null ? b : 0) + ')';
    }
  };
  /**
   * 将颜色转为十六进制格式
   *
   * @method toColorHexStr
   * @param {Object|String|Number} red <br/>
   * String类型时形如#000000,yellow,rgb(123,12,31) <br/>
   * Object类型时形如{red{Number}, green{Number}, blue{Number}}
   * @param {Number} [green]
   * @param {Number} [blue]
   * @return {String}
   */
  Css.toColorHexStr = function (red, green, blue) {
    var hex = '', color;
    color = _parseColor[arguments.length].call(null, red, green, blue);

    var rgbMatch = /rgb\(\s*(\d+)\s*,\s*(\d+),\s*(\d+)\s*\)/i.exec(color);
    if (rgbMatch && rgbMatch.length > 0) {
      var r = rgbMatch[1], g = rgbMatch[2], b = rgbMatch[3];
      hex = '#' + _utils.math.toHexStr(Number(r), 2) + _utils.math.toHexStr(Number(g), 2) + _utils.math.toHexStr(Number(b), 2);
    }
    else if (color.indexOf('#') === -1)
    {
      color = _utils.str.toUpperCase(color, 0);
      hex = COLOR_MAP[color].hex;
    }
    else {
      hex = color;
      if (hex.length !== 7)
      {
        hex = hex.substr(0, 4);
        hex += hex.substr(1);
      }
    }

    return hex;
  };

  /**
   * 通过对入参进行四舍五入，获取有效的颜色值
   *
   * @method getValidColor
   * @param {Number} dec 实数
   * @return {Number} 整数
   */
  Css.getValidColor = function (dec) {
    return _utils.math.round2Int(dec, 0, 255);
  };

  /**
   * 将颜色#000000,rgb(1,2,3),yellow等形式转换为对象{red:1,green:2,blue:3}
   *
   * @method toRGB
   * @param {String} color 形如#000000,rgb(1,2,3),yellow
   * @return {Object} 形如{red:1,green:2,blue:3}
   */
  Css.toRGB = function (color) {
    var rgb = {red: 0, green: 0, blue: 0};
    var regexRs = /rgb\(\s*(\d+)\s*,\s*(\d+),\s*(\d+)\s*\)/i.exec(color);
    if (regexRs && regexRs.length > 0)
    {
      // 提前作操作，避免使用Css.toColorHexStr导致性能下降
      rgb.red = Number(regexRs[1]);
      rgb.green = Number(regexRs[2]);
      rgb.blue = Number(regexRs[3]);
    }
    else {
      var rgbStr = this.toColorHexStr(color);
      rgb.red = _utils.math.hex2Dec(rgbStr.substr(1, 2));
      rgb.green = _utils.math.hex2Dec(rgbStr.substr(3, 2));
      rgb.blue = _utils.math.hex2Dec(rgbStr.substr(5, 2));
    }

    return rgb;
  };

  module.exports = Css;
});
