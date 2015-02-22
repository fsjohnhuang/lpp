/**
 * @module lpp
 * @submodule vml
 */
define(function(require, exports, module){
  require('../shim');

  var $ = require('$');
  var handlebars = require('handlebars');
  var HandlebarsRegisterHelper = require('../HandlebarsRegisterHelper');


  var IFRAME_ID = 'iframeCanvas';

  /**
   * HTML模板
   *
   * @private
   * @attribute HTML
   * @readOnly
   */
  var HTML = '<iframe frameborder="{{setCssNum frameborder "0px"}}" longdesc="{{longdesc}}" allowTransparency="{{setBool allowTrans true}}" '
    + 'id="{{setDefault id "' + IFRAME_ID + '"}}" name="{{setDefault id "' + IFRAME_ID + '"}}" scrolling="{{setRange scrolling [yes,no,auto] no}}" style="{{style}}" src="{{setStr src "./lpp/vml/vml_canvas.html"}}" '
    + '/>';

  /**
   * iframe加载完毕后，获取iframe的window和document对象，并设置iframe的body的高宽
   *
   * @private
   * @method _onLoad
   * @param {Boolean} autoWidth 是否宽度自适应
   * @param {Boolean} autoHeight 是否高度自适应
   */
  var _onLoad = function(style, evt){
    this.frameWin = this.frame.window;
    this.frameDoc = this.frame.document;
    
    var h,w,frameBody = this.frameDoc.body, browser = $.browser, isLtIE7 = browser.msie && parseInt(browser.version) === 7;
    if (style){
      frameBody.style.cssText = style;
    }
    if (evt.data.autoWidth){
      this.$.width(frameBody.scrollWidth + (isLtIE7 ? frameBody.offsetWidth : 0));
    }
    if (evt.data.autoHeight){
      this.$.height(frameBody.scrollHeight + (isLtIE7 ? frameBody.offsetHeight : 0));
    }
  };

  /**
   * @class IFrame
   * @constructor
   * @param {Object} conf 配置信息
   */
  var IFrame = function (conf) {
    if (this === window){
      return new IFrame(conf);
    }

    conf = conf || {};
    this.$ = $(handlebars.compile(HTML)(conf));
    this.$.on('load', { autoWidth: conf.autoWidth, autoHeight: conf.autoHeight }, _onLoad.bind(this, conf.style));
  };

  /**
   * 配置IFrame初始化完成回调函数
   *
   * @method ready
   * @param {Function} fn 回调函数
   */
  IFrame.prototype.ready = function(fn){
    this.$.on('load', fn);
  };

  /**
   * 附加到父DOM节点
   *
   * @method appendTo 
   * @param {htmlElement|有$的对象} parent 父节点
   */
  IFrame.prototype.appendTo = function (selector) {
    this.$.appendTo(selector.$ || selector);
    this.frame = window.frames[this.$[0].id];
  };

  /**
   * 附加元素到iframe
   *
   * @method append
   * @param {Object|String|HtmlElement} 含$属性的对象 或 选择器字符串 或 DOM对象
   */
  IFrame.prototype.append = function(selector){
    $(this.frameDoc.body).append(selector.$ && selector.$ || selector);
  }

  module.exports = IFrame;
});
