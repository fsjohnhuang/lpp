define(function(require, exports, module){
  var $ = require('$');
  var handlebars = require('handlebars');
  require('../HandlebarsRegisterHelper');

  var MovieMediator = require('./MovieMediator');
  var CurtainEvt = require('./evt/CurtainEvt');

  /**
   * 默认动画时间
   *
   * @attribute
   * @private
   * @type Number
   * @readOnly
   */
  var DEFAULT_DURING = 400;
  /**
   * HTML模板
   *
   * @attribute
   * @private
   * @type String
   * @readOnly
   */
  var HTML = '<div data-type="Curtain" style="display: none;z-index: 999; position: absolute; width: 100%; height: 100%; filter:(opacity=70);opacity:0.7;{{{setBg bg}}}">'
    + '{{{createImg img}}}'
    + '{{html}}'
  + '</div>';

  /**
   * 幕布
   *
   * @class Curtain
   * @constructor
   * @param {Object} conf 配置项
   * @return {Curtain} 幕布对象
   */
  var Curtain = function (conf){
    var _conf = {
      bg: '#888',
      img: {
        src: './lpp/movie/imgs/wait.gif',
        style: 'display: block; width: 26px; width: 26px; left: 50%; top: 50%; margin: -18px 0 0 -18px;'
      }
    };
    if (conf){
      if (conf.bg){
        _conf.bg = conf.bg;
      }
      if (conf.img){
        _conf.img = conf.img;
      }
      if (conf.html){
        _conf.html = conf.html;
        if (!conf.img){
          delete _conf.img;
        }
      }
    }

    this.id = 'Curtain' + (+new Date());
    this.$ = $(handlebars.compile(HTML)(_conf));
  };

  /**
   * 挂幕布
   *
   * @method show
   * @param {Number} during 动画时间
   * @param {Function} callback 动画结束后触发
   */
  Curtain.prototype.show = function(during, callback){
    MovieMediator.pub([], CurtainEvt.BEFORE_SHOW, this);

    this.$.fadeIn(during || DEFAULT_DURING, function(){
      MovieMediator.pub([], CurtainEvt.AFTER_SHOW, this);
      callback && callback;
    }.bind(this));
  };
  /**
   * 卸幕布
   *
   * @method hide
   * @param {Number} during 动画时间
   * @param {Function} callback 动画结束后触发
   */
  Curtain.prototype.hide = function(during, callback){
    MovieMediator.pub([], CurtainEvt.BEFORE_HIDE, this);

    var _during = typeof during !== 'number' && DEFAULT_DURING || during;
    var _callback = typeof during === 'function' && during || callback;
    this.$.fadeOut(_during, function(){
      MovieMediator.pub([], CurtainEvt.AFTER_HIDE, this);
      _callback &&  _callback();
    }.bind(this));
  };



  module.exports = Curtain;
});
