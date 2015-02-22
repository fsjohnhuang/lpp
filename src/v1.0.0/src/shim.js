/**
 * @module lpp
 * @submodule base
 */
define(function(require, exports, module){

  /**
   *  模拟ES5的方法
   *  @class shim
   *  @static
   *  @since 1.0.0
   */ 

  if (!Function.prototype.bind){
    /**
     * 模拟Functioon.prototype.bind
     *
     * @method Function.prototype.bind
     * @param {Object} context 函数执行上下文对象的scope
     * @param {Any} presetParam* 预设入参
     * @return {Function} 绑定scope的函数
     */ 
    Function.prototype.bind = function(context, presetParam){
      var fn = this, context = context || null, args = Array.prototype.slice.call(arguments, 1);
      return function(){
        return fn.apply(context, args.concat(Array.prototype.slice.call(arguments)));
      };
    };
  }

  if (!Array.prototype.indexOf){

    /**
     * 模拟Array.prototype.indexOf
     *
     * @method Array.prototype.indexOf
     * @param {Any} el 检查的对象
     * @param {Number} [startIndex=0] 检查的起始索引
     * @return {Number} 对象位于数组的索引，匹配失败时返回0
     */
    Array.prototype.indexOf = function(el, startIndex){
      startIndex = startIndex || 0;
      var index = -1;
      for (var i = startIndex, len = this.length; i < len && index === -1; ++i) {
        if (el === this[i]){
          index = i;
        }
      }

      return index;
    };
  }

  /**
   * 模拟并整合window.getComputedStyle
   * （用于获取DOM元素的标准css属性值, 若要获取filter属性则要使用dom.currentStyle.filter, IE10以下使用filter来设置透明度等样式）
   *
   * @method window.getComputedStyle
   * @param {HtmlElement} dom DOM对象
   * @return {Object} css属性集合
   */
  if (!window.getComputedStyle){
    window.getComputedStyle = function(dom){
      return dom.currentStyle;
    };
  }
});
