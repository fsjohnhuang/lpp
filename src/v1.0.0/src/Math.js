/**
 * @module lpp
 * @submodule base
 * @since 1.0.0
 */
define(function(require, exports, module){
  "use strict";

  /**
   * 弧
   * @attribute BOW
   * @private
   * @type Number
   */
  var BOW = 2 * Math.PI / 360;

  /**
   * 数学计算辅助类
   * @class Math
   * @static
   */ 
  var M = {};

  /**
   * 指定精度，获取数据
   * 
   * @method _toPrecision
   * @private
   * @param {Number} orig 要处理的数值
   * @param {Number} precision 精度
   * @return {Number} 处理后的数值
   */
  var _toPrecision = function(orig, precision){
    if (typeof(precision) !== 'number' || precision < 1) return orig
    return orig.toPrecision(precision);
  };
  
  /**
   * cos函数
   *
   * @method cos
   * @param {Number} angle 角度
   * @param {Number} precision cos计算结果精度
   * @return {Number} cos计算结果 
   */
  M.cos = function (angle, precision) {
    return _toPrecision(Math.cos(BOW * angle), precision);
  };

  /**
   * sin函数
   *
   * @method sin
   * @param {Number} angle 角度
   * @param {Number} precision sin计算结果精度
   * @return {Number} sin计算结果 
   */
  M.sin = function (angle, precision) {
    return _toPrecision(Math.sin(BOW * angle), precision);
  };

  /**
   * tan函数
   *
   * @method tan
   * @param {Number} angle 角度
   * @param {Number} precision tan计算结果精度
   * @return {Number} tan计算结果 
   */
  M.tan = function (angle, precision) {
    return _toPrecision(Math.tan(BOW * angle), precision);
  };

  /**
   * 计算某个角度圆弧上点的top,left值
   *
   * @method calcArcXY
   * @param {Number} angle 角度
   * @param {Number} r 圆半径
   * @param {Number} startAngle 起始角度，以时钟0点的角度为0度
   * @return {Object} 形如{top:0, left: 0}
   */
  M.calcArcXY = function (angle, r, startAngle) {
    var self = M,
        xy = { top: 0, left: 0 },
        _startAngle = startAngle || 0,
        _angle = angle + _startAngle;
    if (_angle % 90 == 0) {
      var timesBy90 = _angle / 90, remainder = timesBy90 % 2;
      xy.top = r * (timesBy90 == 0 ? 0 : !remainder && 2 || 1);
      xy.left = r * (timesBy90 == 3 ? 0 : !remainder && 1 || 2);
    }
    else if (_angle < 90) {
      xy.top = r - self.cos(_angle) * r;
      xy.left = self.sin(_angle) * r + r;
    }
    else if (_angle < 180) {
      _angle = 180 - _angle;
      xy.top = self.cos(_angle) * r + r;
      xy.left = self.sin(_angle) * r + r;
    }
    else if (_angle < 270) {
      _angle = _angle - 180;
      xy.top = self.cos(_angle) * r + r;
      xy.left = r - self.sin(_angle) * r;
    }
    else {
      _angle = _angle - 270;
      xy.top = self.sin(_angle) * r;
      xy.left = self.cos(_angle) * r;
    }

    return xy;
  };

  /** 
   * 十进制换算为其他进制的形式
   *
   * @method toOtherSysStr
   * @param {Number} dec 十进制数字
   * @param {Number} sys 2,8,16等进制
   * @param {Number} digit 其他进制字符串的最短长度, 不够最短长度时左边用0补足长度，默认不限制最短长度
   * @return {Number}
   */
  M.toOtherSysStr = function (dec, sys, digit) {
    if (typeof (dec) !== 'number') return dec;

    var rs = '', tmp;
    digit = digit || -1;
    while (dec / sys > 0) {
      tmp = dec % sys;
      rs = String(tmp).replace('10', 'A').replace('11', 'B').replace('12', 'C').replace('13', 'D').replace('14', 'E').replace('15', 'F') + rs;
      dec = parseInt(dec / sys);
    }
    while (digit - rs.length > 0) {
      rs = '0' + rs;
    }

    return rs;
  };

  /** 
   * 十进制转换为十六进制字符串
   *
   * @method toHexStr
   * @param {Number} dec 十进制数字
   * @param {Number} digit 十六进制字符串的最短长度, 不够最短长度时左边用0补足长度，默认不限制最短长度
   * @return {String} 十六进制字符串
   * @example实例：digit=3，而十六进制字符串为FF，那么返回值为0FF
   */
  M.toHexStr = function (dec, digit) {
    return this.toOtherSysStr(dec, 16, digit);
  };

  /** 
   * 十进制转换为二进制字符串
   *
   * @method toBinaryStr
   * @param {Number} dec 十进制数字
   * @param {Number} digit  二进制字符串的长最短长度, 不够最短长度时左边用0补足长度，默认不限制最短长度
   * @return {String} 二进制字符串
   * @example 实例：digit=3，而二进制字符串为11，那么返回值为011
   */
  M.toBinaryStr = function (dec, digit) {
    return this.toOtherSysStr(dec, 2, digit);
  };

  /** 
   * 其他进制转换为十进制
   * 
   * @method toDec
   * @param {String} orig 其他进制的字符串
   * @param {Number} sys 2,8,16等进制
   * @return {Number}
   */
  M.toDec = function (orig, sys) {
    return parseInt(orig, sys);
  }

  /** 
   * 十六进制转换为十进制
   *
   * @method hex2Dec
   * @param {String} orig 十六进制的字符串
   * @return {Number}
   */
  M.hex2Dec = function (orig) {
    return this.toDec(orig, 16);
  };

  /** 
   * 二进制转换为十进制
   *
   * @method binary2Dec
   * @param {String} orig 二进制的字符串
   * @return {Number}
   */
  M.binary2Dec = function (orig) {
    return this.toDec(orig, 2);
  };

  /** 
   * 四舍五入返回整数
   *
   * @method round2Int
   * @param {Number} orig 原始值
   * @param {Integer} min 原始值
   * @param {Integer} max 原始值
   * @return {Integer}
   */
  M.round2Int = function (orig, min, max) {
    var _orig = parseInt(orig + 0.5);
    if (min && _orig < min) {
      _orig = min;
    }
    if(max && _orig > max) {
      _orig = max;
    }

    return _orig;
  };

  module.exports = M;
});
