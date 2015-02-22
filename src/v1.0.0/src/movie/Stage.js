/**
 * @module lpp
 * @submodule movie
 */
define(function(require, exports, module){
  var _utils = {};
  _utils.array = require('../Array');

  var Curtain = require('./Curtain');
  var MovieMediator = require('./MovieMediator');
  var CurtainEvt = require('./evt/CurtainEvt');
  var $ = require('$');
  var handlebars = require('handlebars');
  require('../HandlebarsRegisterHelper');

  /**
   * HTML模板
   *
   * @attribute HTML
   * @readOnly
   * @type String
   */
  var HTML = '<div data-type="Stage" style="{{style}}position: absolute; '
    + 'top: {{setCssNum top}}; left: {{setCssNum left}}; width: {{setCssNum width}}; height: {{setCssNum height}};">'
    + '</div>';

  /**
   * @attribute _curtains 幕布集合, 格式：幕布名: 幕布实例
   * @private
   * @type Object
   */
  var _curtains = {};
  /**
   * @attribute DEFAULT_CURTAIN_NAME 默认幕布名
   * @private
   * @readOnly
   * @type String
   */
  var DEFAULT_CURTAIN_NAME = 'default';
  _curtains[DEFAULT_CURTAIN_NAME] = new Curtain();

  var EMPTY_CURTAIN_NAME = 'empty';
  _curtains[EMPTY_CURTAIN_NAME] = {
    show: function(during, callback){
            MovieMediator.pub([], CurtainEvt.BEFORE_SHOW, this);
            MovieMediator.pub([], CurtainEvt.AFTER_SHOW, this);
            callback && callback();
          },
    hide: function(during, callback){
            MovieMediator.pub([], CurtainEvt.BEFORE_HIDE, this);
            MovieMediator.pub([], CurtainEvt.AFTER_HIDE, this);
            callback && callback();
          },
  };
  /**
   * @attribute _curCurtainName 当前挂起的幕布名
   * @private
   * @type String
   */
  var _curCurtainName = null;
  /**
   * @attribute _curCurtainDuring 当前挂起的幕布的动画时间
   * @private
   * @type Number
   */
  var _curCurtainDuring = null;

  /**
   * 舞台类
   *
   * @class Stage
   * @static
   */
  var Stage = {};
  /**
   * 初始化舞台实例
   *
   * @method init
   * @param {Object} layoutConf 属性：style,top,left,width,height
   * @param {Object} curtains 格式：幕布名: 幕布实例
   */
  Stage.init = function(layoutConf, curtains){
    delete Stage.init;
    // 布置舞台
    Stage.$ = $(handlebars.compile(HTML)(layoutConf));
    // 布置幕布
    Stage.$.append(_curtains[DEFAULT_CURTAIN_NAME].$);
    // 布置幕布
    Stage.$.append(_curtains[EMPTY_CURTAIN_NAME].$);

    if (!curtains) return;
    for(var curtainName in curtains){
      _curtains[curtainName] = curtains[curtainName];
      Stage.$.append(_curtains[curtainName].$);
    }
  };

  /**
   * 将舞台附加到dom树
   *
   * @method appendTo
   * @param {String|HtmlElement|jQuery对象} parent
   */
  Stage.appendTo = function(parent){
    parent = parent || $(document.body);
    Stage.$.appendTo(parent);

    delete Stage.appendTo; 
  };

  /**
   * 向舞台附加子元素
   *
   * @method append
   * @param {String|HtmlElement|jQuery对象|含$属性的对象} selector
   */
  Stage.append = function(selector){
    Stage.$.append(selector.$ || selector);
  };

  /**
   * 挂幕布
   * 
   * @method showCurtain
   * @param {String} name 幕布名称
   * @param {Number} during 动画时间
   * @param {Function} callback 回调函数
   */
  Stage.showCurtain = function (name, during, callback){
    if (_curtains[name]){
      _curCurtainName = name;
      _curCurtainDuring = during;
      _curtains[_curCurtainName].show(_curCurtainDuring, callback);
    }
  }

  /**
   * 卸当前幕布
   * 
   * @method hideCurtain
   */
  Stage.hideCurtain = function(){
    _curtains[_curCurtainName] && _curtains[_curCurtainName].hide(_curCurtainDuring);
  };

  module.exports = Stage;
});
