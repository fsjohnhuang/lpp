/**
 * @module lpp
 * @module vml
 */
define(function(require, exports, module){
  var $ = require('$');
  var handlebars = require('handlebars');
  require('../../HandlebarsRegisterHelper');

  /**
   * 圆角矩形的HTML模板
   *
   * @attribute VHTML
   * @type String
   * @private
   * @readOnly
   */
  var VHTML = '<v:roundrect id="{{id}}" name="{{name}}" style="{{style}}" '
      + 'strokeColor="{{strokeColor}}" stroked="{{#if strokeWeight}}T{{else}}F{{/if}}" strokeWeight="{{setDefault strokeWeight "0px"}}" '
      + 'filled="{{#if fillColor}}T{{else}}F{{/if}}" fillColor="{{fillColor}}" arcsize="{{setDefault arcsize 0}}">'
      + '{{{shadow}}}'
      + '{{innerHtml}}'
      + '</v:roundrect>';
  /**
   * 阴影HTML模板
   *
   * @attribute VSHADOW
   * @type String
   * @private
   * @readOnly
   */
  var VSHADOW = '<v:shadow id="{{id}}" name="{{name}}" on="T" type="{{setDefault type "single"}}" color="{{setDefault color "#b3b3b3"}}" offset="{{offset}}"/>';

  /**
   * 圆角矩形
   *
   * @class RoundRect
   * @constructor
   * @param {Object} conf 配置项<br/>
   * 配置项属性：<br/>
   * {String}id, {String}name, {String}style, {String}strokeColor, {String}strokeWeight, {String}fillColor, {Object}shadow, {String}innerHtml<br/>
   * shadow属性:<br/>
   * {String}id, {String}name, {String}type, {String}color, {String}[offset='5px, 5px']
   */
  var RoundRect = function(conf){
    var _conf = {};
    $.extend(_conf, conf);
    if (_conf.shadow) {
        _conf.shadow.offset = _conf.shadow.offset || '5px, 5px';
        _conf.shadow = handlebars.compile(VSHADOW)(_conf.shadow);
    }
    this.$ = $(handlebars.compile(VHTML)(_conf));
  }

  module.exports = RoundRect;
});
