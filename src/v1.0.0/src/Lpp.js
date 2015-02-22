/**
 * @module lpp
 * @submodule base
 */
define(function(require, exports, module){
  "use strict";

  require('./shim');
  var _utils = {};
  _utils.array = require('./Array');

  /**
   * 基础辅助类
   * @class lpp
   */
  var lpp = {};
  module.exports = lpp;

  /*BEGIN —— 私有方法*/
  var span4HTMLEncoding; // 用于html格式编码的span元素
  var encode = function(str, encoding){
    var _encoding = typeof(encoding) != 'undefined' && encoding || 'HTML', encodedStr;
    if (_encoding == 'HTML')
    {
      span4HTMLEncoding = span4HTMLEncoding || document.createElement('span');
      span4HTMLEncoding.innerText = str;
      encodedStr = span4HTMLEncoding.innerHTML;
      span4HTMLEncoding.innerText = '';
    }
    else if (_encoding == 'URI'){
      encodedStr = encodeURI(str);
    }

    return encodedStr;
  }
  var fmtEncode = function(encoding, str){
    if (arguments.length == 2) return str;

    var args = _utils.array.toArray(arguments, 2), encodedArgs = [];
    for (var i = 0, len = args.length; i < len; i++) {
      encodedArgs.push(encode(args[i], encoding));
    };
    return lpp.fmt.apply(window, [str].concat(encodedArgs));
  };
  /*私有方法 —— END*/

  /**
   * 字符串格式化
   * 
   * @method fmt
   * @param {String} str 字符串格式
   * @param {Any} arg*
   * @param {String} 格式化后的字符串
   * @example
   * var rs = fmt('{0}-{1}', 'arg1', 'arg2');<br/>
   * equal(rs, 'arg1-arg2');
   */
  lpp.fmt = function(str){
    if (arguments.length == 1) return str;

    var args = _utils.array.toArray(arguments, 1), afterFmt = str;
    for (var i = args.length ; i >= 0; i--) {
      afterFmt = afterFmt.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i]);
    };
    return afterFmt;
  };

  /**
   * HTML编码的字符串格式化
   * 
   * @method fmtEncodeHTML
   * @param {String} str 字符串格式
   * @param {Any} arg*
   * @param {String} 格式化后的字符串
   * @example
   * var rs = fmt('{0}-{1}', 'arg1>', 'arg2<');<br/>
   * equal(rs, 'arg1&gt;-arg2&lt;');
   */
  lpp.fmtEncodeHTML = function(str){
    return fmtEncode.apply(window, ['HTML'].concat(_utils.array.toArray(arguments)));
  };

  /**
   * URI编码的字符串格式化
   * 
   * @method fmtEncodeHTML
   * @param {String} str 字符串格式
   * @param {Any} arg*
   * @param {String} 格式化后的字符串
   * @example
   * var rs = fmt('{0}-{1}', 'arg1 arg2', 'arg3');<br/>
   * equal(rs, 'arg1%20arg2-arg3');
   */
  lpp.fmtEncodeURI = function(str){
    return fmtEncode.apply(window, ['URI'].concat(_utils.array.toArray(arguments)));
  };
});
