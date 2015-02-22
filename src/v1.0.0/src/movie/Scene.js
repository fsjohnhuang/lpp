/**
 * @module lpp
 * @submodule movie
 */
define(function(require, exports, module){
  var $ = require('$');
  var handlebars = require('handlebars');
  require('../HandlebarsRegisterHelper');

  var _utils = {};
  _utils.array = require('../Array');

  // 事件
  var EVT = require('./evt/SceneEvt');

  var MovieMediator = require('./MovieMediator');

  /**
   * HTML模板
   *
   * @attribute HTML
   * @private
   * @readOnly
   * @type String
   */
  var HTML = '<div data-type="Scene" style="position: relative; width: 100%; height: 100%;{{setBg bg}}"></div>';

  /**
   * 场景类
   *
   * @class Scene
   * @param {Object} conf 属性含bg
   */
  var Scene = function (conf) {
    conf = conf || {};

    this.mediator = this.mediator || MovieMediator;
    this.mediator.pub(this.subscribers || [], EVT.BEFORE_INIT, this);
    this.subscriber = this.subscriber || 'Scene' + (+ new Date());
    this.$ = $(handlebars.compile(HTML)(conf));
    this.mediator.pub(this.subscribers || [], EVT.AFTER_INIT, this);
  };

  /**
   * 添加精灵到场景
   *
   * @method append
   * @param {Spirit} spirit 精灵实例
   */
  Scene.prototype.append = function(spirit){
    this.mediator.pub(this.subscribers || [], EVT.BEFORE_APPEND_CHILD, this, spirit);
    this.$.append(spirit.$);
    this.mediator.pub(this.subscribers || [], EVT.AFTER_APPEND_CHILD, this, spirit);
  };

  /**
   * 附加场景
   *
   * @method appendTo
   * @param {String|Object|jQuery} 含$属性的对象 或 jQuery对象 或 选择字符串 或 DOM对象
   */
  Scene.prototype.appendTo = function(parent){
    this.mediator.pub(this.subscribers || [], EVT.BEFORE_RENDER, this, parent);
    this.$.appendTo(parent.$ || parent);
    this.mediator.pub(this.subscribers || [], EVT.AFTER_RENDER, this, parent); 
  }; 

  /**
   * 清理组件
   *
   * @method removeChild
   * @param {Object} 含$属性的对象
   */
  Scene.prototype.removeChild = function(spirit){
    this.mediator.pub(this.subscribers || [], EVT.BEFORE_REMOVE_CHILD, this, spirit);
    spirit.$.remove();
    this.mediator.pub(this.subscribers || [], EVT.AFTER_REMOVE_CHILD, this, spirit);
  }

  /**
   * 清理场景，并清理场景订阅的事件
   *
   * @method remove
   */
  Scene.prototype.remove = function(){
    this.mediator.pub(this.subscribers || [], EVT.BEFORE_DISPOSE, this);
    this.$.remove();
    this.mediator.unsub(this.subscriber);
    this.mediator.pub(this.subscribers || [], EVT.AFTER_DISPOSE, this);
  };

  /**
   * 订阅事件
   *
   * @method sub
   * @param {String} channel 事件名称
   * @param {Function(evt, [presetParam...], [param...])} callback 回调函数
   * @param {Any} [presetParam*] 预设参数
   */
  Scene.prototype.sub = function(channel, callback, presetParam){
    this.mediator.sub.apply(this.mediator, [this.subscriber].concat(_utils.array.toArray(arguments)));
  };

  /**
   * 发布事件
   *
   * @method pub
   * @param {Array} subscribers 订阅者
   * @param {String} channel 事件名称
   * @param {Any} [param*] 参数
   */
  Scene.prototype.pub = function(subscribers, channel, param){
    this.mediator.pub.apply(this.mediator, arguments);
  }

  module.exports = Scene; 
});
