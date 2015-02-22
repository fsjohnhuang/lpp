/**
 * @module lpp
 * @submodule base
 */
define(function(require, exports, module){
  var _utils = {};
  _utils.str = require('./Str');

  /**
   *  数组辅助类
   *
   *  @class Array
   *  @static
   *  @since 1.0.0
   */ 
  var lpp_Array = {};
  module.exports = lpp_Array; 

  /**
   * 将类数组转换数组
   *
   * @method toArray
   * @param {Any} arrayLike 类数组
   * @param {Number} [startIndex] 数组截取的起始索引
   * @return {Array} 数组
   */
  lpp_Array.toArray = function(arrayLike, startIndex){
    var rs;
    if (Object.prototype.toString.call(arrayLike).indexOf('Array') > 0) {
      rs = arrayLike;
    }
    else{
      try {
        if (typeof(arrayLike) === 'string') {
          rs = arrayLike.split('');
        } else {
          rs = Array.prototype.slice.call(arrayLike);
        }
      } catch (e) {
        rs = [];
        for (var i = -1, len = arrayLike.length, item; ++i < len;) {
          item = arrayLike[i];
          rs.push(item);
        }
      }
    }

    if (!!startIndex){
      rs = rs.slice(startIndex);
    }

    return rs;
  };

  lpp_Array.distinctPush = function(arrayLike, el){
    var _array = lpp_Array.toArray(arrayLike);
    if (lpp_Array.exist(arrayLike, el)) return _array;

    _array.push(el);
    return _array;
  };

  lpp_Array.exist = function (arrayLike, el){
    var rs = false, _item, _array = lpp_Array.toArray(arrayLike), _el = el
      , checkType = function(target){
        return function(el){
          return Object.prototype.toString.apply(target).indexOf(el) > 0;
        };
      };
    if (lpp_Array.some(['Array', 'Object'], checkType(el))){
      _el = JSON.stringify(el);
    }
    for (var i = _array.length - 1; i >= 0 && !rs; i--) {
      _item = _array[i];
      if (lpp_Array.some(['Array', 'Object'], checkType(_item))){
        _item = JSON.stringify(_item);
      }

      rs = _item === _el;
    }

    return rs;
  };

  lpp_Array.some = function (arrayLike, fn) {
    var i, item, _array, _i, _len;

    _array = lpp_Array.toArray(arrayLike);
    // fn不为函数时, 只要array中有元素与fn相同即返回true
    if (typeof (fn) != 'function') {
      for (var i = _array.length - 1; i >= 0; i--) {
        item = _array[i];
        if (item === fn) return true;
      }
      return false;
    }

    if (_array.some != null) {
      return _array.some(fn);
    } else {
      for (i = _i = 0, _len = _array.length; _i < _len; i = ++_i) {
        item = _array[i];
        if (fn(item, i)) {
          return true;
        }
      }
      return false;
    }
  };

  lpp_Array.all = function (arrayLike, fn){
    var i, item, _array, _i, _len, pass = true;

    _array = lpp_Array.toArray(arrayLike);
    // fn不为函数时, 只要array中有元素与fn相同即返回true
    if (typeof (fn) != 'function') {
      for (var i = _array.length - 1; i >= 0; i--) {
        item = _array[i];
        pass = item === fn && pass;
      }
    }
    else{
      for (i = _i = 0, _len = _array.length; _i < _len; i = ++_i) {
        item = _array[i];
        pass = fn(item, i) && pass;
      }
    }

    return pass;
  };

  lpp_Array.each = function(arrayLike, fn){
      var i, item, _array, _i, _len;

      _array = lpp_Array.toArray(arrayLike);
      if (_array.forEach != null) {
        _array.forEach(fn);
      } else {
        for (i = _i = 0, _len = _array.length; _i < _len; i = ++_i) {
          item = _array[i];
          fn(item, i);
        }
      }
  };

  lpp_Array.map = function(arrayLike, fn){
    var _array = lpp_Array.toArray(arrayLike), rsArray = [];
    if (typeof(arrayLike) == 'undefined' || fn == null) return arrayLike;

    for (var i = 0, len = _array.length; i < len; i++) {
      rsArray.push(fn(_array[i]));
    };

    return rsArray;
  };

  lpp_Array.grep = function(arrayLike, fn, fetch) {
    var i, item, _array, _i, _len, _results;

    if (fetch == null) {
      fetch = true;
    }

    _array = lpp_Array.toArray(arrayLike);
    if ((_array.filter != null) && fetch === true) {
      return _array.filter(fn);
    } else {
      _results = [];
      for (i = _i = 0, _len = _array.length; _i < _len; i = ++_i) {
        item = _array[i];
        if (fn(item, i) === fetch) {
          _results.push(item);
        }
      }
      return _results;
    }
  };

  lpp_Array.trim = function(array, trim){
    return lpp_Array.map(array, function(el){
      return _utils.str.trim(el, trim);
    });
  };

  lpp_Array.insert = function(array, newEl, fn, before){
    if (array.length === 0) return [newEl];

    if (typeof(before) === 'undefined'){
      before = true;
    }
    var startIdx, prefix, suffix;
    if (typeof(fn) === 'number'){
      startIdx = before ? fn : fn + 1;
      prefix = array.slice(0, startIdx);
      suffix = array.slice(startIdx);
      prefix.push(newEl);
      return prefix.concat(suffix);
    }

    for (var i = 0, len = array.length; i < len; i++) {
      if (fn(array[i], newEl)){
        startIdx = before ? i : i + 1;
        prefix = array.slice(0, startIdx);
        suffix = array.slice(startIdx);
        prefix.push(newEl);
        return prefix.concat(suffix);
      }
    };
    return array.concat([newEl]);
  };
  lpp_Array.insertBefore = function(array, newEl, fn){
    return lpp_Array.insert(array, newEl, fn, true);
  };
  lpp_Array.insertAfter = function(array, newEl, fn){
    return lpp_Array.insert(array, newEl, fn, false);
  };
});
