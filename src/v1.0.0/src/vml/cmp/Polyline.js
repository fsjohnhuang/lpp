/**
 * 多边形
 * @module Polyline
 */
define(function(require, exports, module){
  var $ = require('$');
  var handlebars = require('handlebars');
  require('../../HandlebarsRegisterHelper');

  /**
   * HTML模板
   * @private
   * @attribute HTML
   * @readOnly
   * @type {String}
   */ 
  var HTML = '<v:polyline data-strokeWeight="{{strokeWeight}}" id="{{id}}" name="{{name}}" filled="{{setBool filled false}}"'
    + ' fillColor="{{fillColor}}" strokeWeight="{{strokeWeight}}" strokeColor="{{strokeColor}}"  style="position: absolute;{{style}}" points="{{points}}">'
    + '</v:polyline>';

  /**
   * 多边形
   * @class Polyline
   * @constructor
   * @param {Object} conf 配置项<br/>
   * 配置项内容<br/>
   *  id {String} 'id'<br/>
   *  name {String} 'name'<br/>
   *  filled {Boolean} 是否填充<br/>
   *  fillColor {String} 填充颜色<br/>
   *  strokeWeight {String|Number} 边宽<br/>
   *  strokeColor {String} 边颜色<br/>
   *  style {String} css样式<br/>
   *  point {String} 边路径，形如 0,0 0,100 100,100 100,200<br/>
   */
  var Polyline = function(conf){
    if (this === window){
      return new Polyline(conf);
    }
    
    conf = $.extend({
      strokeWeight: '1px',
      strokeColor: '#000'
    }, conf);
    this.$ = $(handlebars.compile(HTML)(conf));
  };

  module.exports = Polyline;
});
