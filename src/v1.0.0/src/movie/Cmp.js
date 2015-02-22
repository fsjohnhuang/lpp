/**
 * @module lpp
 * @submodule movie
 */
define(function(require, exports, module){
  var $ = require('$');
  var handlebars = require('handlebars');
  var fx = require('../fx/zoomToggle');
  var _utils = {};
  _utils.lpp = require('../Lpp');

  require('../HandlebarsRegisterHelper')


  /**
   * HTML模板：组件容器
   *
   * @attribute HTML
   * @type String
   * @private
   * @readOnly
   */
  var HTML = '<ul data-type="Cmp" style="position: absolute; width: 100%; height: 100%;"></ul>';
  /**
   * HTML模板：组件
   *
   * @attribute ITEM_HTML
   * @type String
   * @private
   * @readOnly
   */
  var ITEM_HTML = '<li style="position: absolute; top: {{setCssNum top}};{{setLeftorRight left right}}width:{{setCssNum width}};height:{{setCssNum height}};{{style}}">'
  + '<a style="position: absolute; display:block;width:100%;height:100%;cursor:pointer;" title="{{title}}">'
  + '{0}'
  + '</a></li>';
  /**
   * HTML模板：组件的图片
   *
   * @attribute IMG_HTML
   * @type String
   * @private
   * @readOnly
   */
  var IMG_HTML = '<img src="{{src}}" style="position: absolute; width:100%; height: 100%;"/>';
  /**
   * HTML模板：组件的文字
   *
   * @attribute TXT_HTML
   * @type String
   * @private
   * @readOnly
   */
  var TXT_HTML = '<span style="position: absolute; display: block; text-align:center; width: 100%; height: {{setCssNum height}}; line-height: {{setCssNum height}}; font-size:{{setCssNum fontSize \"12px\"}};{{textStyle}}">'
      + '{{text}}'
    + '</span>';

  /**
   * 精灵组件类
   *
   * @class Cmp
   * @param {Spirit} 精灵实体
   */
  var Cmp = function (spirit) {
    if (this === window){
      return new Cmp(spirit);
    }

    this.$ = $(HTML);
    this.spirit = spirit;
  };

  /**
   * 初始化组件实例
   *
   * @method init
   * @param {Array} confs 组件配置项
   */
  Cmp.prototype.init = function (confs) {
    var self = this;

    $.each(confs, function (idx, conf) {
      var innerHtml = '';
      if (conf.src){
        innerHtml += IMG_HTML;
      }
      if (conf.text){
        innerHtml += TXT_HTML;
      }
      if (typeof conf.html === 'string'){
        innerHtml += conf.html;
      }
      
      var item = $(handlebars.compile(_utils.lpp.fmt(ITEM_HTML, innerHtml))(conf));
      item.data('id', conf.id);
      if (item.find('a>span').length !== 0){
        item.find('a').mouseenter(fx.zoomToggle(item.find('img')));
      }
      else{
        item.find('a').on('mouseenter', 'img:first', function(){
          fx.zoomToggle($(this), function(){
            conf.callback && conf.callback(item);
          })();
        });
      }
      if (conf.on)
      {
        for (var evt in conf.on) {
          if (evt === 'init'){
          }
          else{
            item.on(evt, function (e) {
              e.preventDefault();
              e.stopPropagation();
              conf.on[evt](e);
            });
          }
        }
      }

      item.appendTo(self.$);
    });
  };

  /**
   * 附加组件到精灵
   *
   * @method appendTo
   */
  Cmp.prototype.appendTo = function () {
    this.spirit.$.append(this.$);
  }

  module.exports = Cmp;
});
