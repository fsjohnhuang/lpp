/**
 * @module lpp
 * @submodule base
 */
define(function(require, exports, module){
  "use strict";

  var _utils = {};
  _utils.array = require('./Array');

  /**
   * 类辅助类
   * 
   * @class Cls
   * @static
   */
  var Cls = {};

  /**
   * 继承辅助方法 
   *
   * @method inherit
   * @param {Function Constructor} child 子类
   * @param {Function Constructor} parent 父类
   */
  Cls.inherit = function(child, parent){
    var Mid = function(){
      this.constructor = child;
    };
    Mid.prototype = parent.prototype;
    child.prototype = new Mid();
    child.prototype.base = function(propName, param){
      if (arguments.length === 0){
        return _super0(this, parent);
      }
      else{
        var params = [];
        params = params.concat(_utils.array.toArray(arguments, 1));
        return _super1(this, parent, propName, params);
      }
    };
  }

  /**
   * 子类实例super重载函数，获取所有父类方法和公共属性
   *
   * @method _super0
   * @private
   * @param {Object} 子类实例
   * @param {Function} 父类构造函数
   * @return {Object} 父类的prototype属性集合
   */
  var _super0 = function(childIns, parent){
    var rs = {};
    for(var p in parent.prototype){
      var tmp = parent.prototype[p];
      if (typeof tmp === 'function'){
        rs[p] = tmp.bind(childIns);
      }
      else{
        rs[p] = tmp;
      }
    }
    return  rs;
  };
  /**
   * 子类实例super重载函数，调用父类指定方法或获取指定的公共属性值
   *
   * @method _super0
   * @private
   * @param {Object} 子类实例
   * @param {Function} 父类构造函数
   * @return {Any} 方法返回值或公共属性值
   */
  var _super1 = function(childIns, parent, propName, params){
    if (propName in parent.prototype){
      var tmp = parent.prototype[propName];
      if (typeof tmp === 'function'){
        return tmp.apply(childIns, params);
      }
      else{
        return tmp;
      }
    }
  };

  module.exports = Cls;
});
