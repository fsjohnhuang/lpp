/**
 * @module lpp
 * @submodule vml
 */
define(function(require, exports, module){
  require('../shim');

  var $ = require('$');
  var IFrame = require('./IFrame');

  var _utils = {};
  _utils.cls = require('../Cls');
  var EvtQueue = require('../EvtQueue');
  var fx = require('../fx/animate');
  $.extend(fx, require('../fx/fadeOut')
    , require('../fx/fadeIn')
    , require('../fx/fadeTo')
    , require('../fx/points'));

  /**
   * VML画布
   * @since 1.0.0
   * @beta
   * @class Canvas
   * @constructor
   * @extends IFrame
   * @param {Object} conf 配置项
   */
  var Canvas = function(conf){
    if (this === window){
      return new Canvas(conf);
    }
    
    IFrame.call(this, conf);
  };

  _utils.cls.inherit(Canvas, IFrame);

  /**
   * 配置画布初始化完成回调函数
   *
   * @method ready
   * @param {Function} fn 回调函数
   */
  Canvas.prototype.ready = function(fn){
    this.base('ready', fn.bind(this));
  };

  /**
   * 添加元素到画布
   *
   * @method append
   * @param {Object} shape 含$属性的对象
   */
  Canvas.prototype.append = function(shape){
    this.base('append', shape);
    
    // 绑定动画
    shape.fxQ = EvtQueue.create();
    shape.fxQ.register('animate', function(release, dom, css, during, callback){
      var _callback = release;
      if (callback){
        _callback = function(){
          release();
          callback();
        };
      }
      fx.animate(dom, css, during, _callback);
    }, shape.$[0]);
    shape.animate = function(css, during, callback){
      this.fxQ.call('animate', css, during, callback);
      return this;
    };
    shape.fxQ.register('fadeOut', function(release, dom, during, callback){
      var _callback = release;
      if (callback){
        _callback = function(){
          release();
          callback();
        };
      }
      fx.fadeOut(dom, during, _callback);
    }, shape.$[0]);
    shape.fadeOut = function(during, callback){
      this.fxQ.call('fadeOut', during, callback);
      return this;
    };
    shape.fxQ.register('fadeIn', function(release, dom, during, callback){
      var _callback = release;
      if (callback){
        _callback = function(){
          release();
          callback();
        };
      }
      fx.fadeIn(dom, during, _callback);
    }, shape.$[0]);
    shape.fadeIn = function(during, callback){
      this.fxQ.call('fadeIn', during, callback);
      return this;
    };
    shape.fxQ.register('fadeTo', function(release, dom, alpha, during, callback){
      var _callback = release;
      if (callback){
        _callback = function(){
          release();
          callback();
        };
      }
      fx.fadeTo(dom, alpha, during, _callback);
    }, shape.$[0]);
    shape.fadeTo = function(alpha, during, callback){
      this.fxQ.call('fadeTo', alpha, during, callback);
      return this;
    };

    // 设置vml的polyline的points动画
    if (shape.points){
      shape._go = fx.points(shape.$[0], shape.points);
      shape.fxQ.register('next', function(release, during, callback){
        var _callback = release;
        if (callback){
          _callback = function(){
            release();
            callback();
          };
        }
        shape._go.next(during, _callback);
      });
      shape.fxQ.register('prev', function(release, during, callback){
        var _callback = release;
        if (callback){
          _callback = function(){
            release();
            callback();
          };
        }
        shape._go.prev(during, _callback);
      });
      shape.next = function(during, callback){
        this.fxQ.call('next', during, callback); 
        return this;
      }
      shape.prev = function(during, callback){
        this.fxQ.call('prev', during, callback); 
        return this;
      }
    }
  }

  module.exports = Canvas;
});
