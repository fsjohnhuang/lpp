/**
 * 电影模块
 * 
 * @module lpp
 * @submodule movie
 */
define(function(require, exports, module){
  var $ = require('$');
  var router = require('../router/Router');

  var CurtainEvt = require('./evt/CurtainEvt');
  var DirectorSceneEvt = require('./evt/DirectorSceneEvt');
  var MovieMediator = require('./MovieMediator');

  /**
   * @class Director
   * @static
   */

  /**
   * @attribute _curtainConfs 幕布动作配置项目, 元素属性：from,to,aciont({Function}回调函数)
   * @private
   * @type Array
   */
  var _curtainConfs;
  /**
   * @attribute _defaultCurtainAction 默认的幕布动作
   * @private
   * @type Function({Function}回调函数)
   */
  var _defaultCurtainConf;
  /**
   * @attribute _stage
   * @type {Stage}
   * @private
   */
  var _stage;

  /**
   * 订阅时用的名称
   *
   * @attribute
   * @private
   * @type String
   * @readOnly
   */
  var _subscriber = 'Director';

  /**
   * 根据来源fragment和目的key获取幕布配置项
   *
   * @method _getCutainConf
   * @private
   * @param {RegExp} from
   * @param {RegExp} to
   * @return {Object} 幕布配置项, 属性：from,to,curtainName,during
   */
  var _getCutainConf = function(from, to){
    var curtainConf = null;
    for (var i = 0, len = _curtainConfs.length; i < len && !curtainConf; i++) {
      curtainConf = _curtainConfs[i];
      curtainConf = curtainConf.from.test(from) && curtainConf.to.test(to) ? curtainConf : null;
    };

    return curtainConf;
  };

  /**
   * 封装转场动作，加入挂、卸幕布动作
   *
   * @method _assemblePromiseAction
   * @private 
   * @param {Function} oriAction 函数返回结果为jQuery的deferred对象, 对象的then函数返回值为Scene实例
   * @return {Function}
   */
  var _assemblePromiseAction = function(oriAction){
    return function(state, params){
      if (state.curScene){
        state.curScene.remove && state.curScene.remove() || state.curScene.$.remove();
        state.curScene = null;
        MovieMediator.unsub(_subscriber);
      }
      
      /* 订阅场景的生命周期事件 */
      // 场景初始化时触发
      MovieMediator.sub(_subscriber, DirectorSceneEvt.INIT, function(evt){
        // TODO
      });
      // 场景需要渲染时触发
      MovieMediator.sub(_subscriber, DirectorSceneEvt.RENDER, function(evt, state, stage, scene){
        scene.appendTo(stage);
        state.curScene = scene;
      }, state, _stage);
      // 场景需要卸幕布时触发
      MovieMediator.sub(_subscriber, DirectorSceneEvt.HIDE_CURTAIN, function(evt, stage){
        stage.hideCurtain();
      }, _stage);
      // 场景数据加载失败时触发
      MovieMediator.sub(_subscriber, DirectorSceneEvt.LOAD_DATA_FAIL, function(evt, ex){
        // TODO
      });
      // 场景数据加载成功时触发
      MovieMediator.sub(_subscriber, DirectorSceneEvt.LOAD_DATA_SUCCESS, function(evt){
      });
      // 场景抛其他异常时触发
      MovieMediator.sub(_subscriber, DirectorSceneEvt.ERR, function(evt, state, ex){
        // TODO
        exports.err && exports.err(state, {}, ex);         
      }, state);

      oriAction(state, params);
    };
  }

  /**
   * 初始化导演
   *
   * @method init
   * @param {Stage} stage 舞台对象
   * @param {Array} script 场景脚本
   * @param {Array} curtainConfs 幕布动作映射表,元素属性：from,to,action({Function} 回调函数)
   * @param {Function} defaultCurtainConf 默认幕布配置项
   */
  exports.init = function(stage, script, curtainConfs, defaultCurtainConf){
    _stage = stage;
    for (var i = 0, len = script.length; i < len; ++i){
      script[i].action = _assemblePromiseAction(script[i].action);
    }
    router.err = exports.err;
    router.map(script); 
    _curtainConfs = curtainConfs || [];
    _defaultCurtainConf = defaultCurtainConf;
  };

  /**
   * 开始话剧
   *
   * @method action
   */
  exports.action = function(){
    router.listenBeforeAction(function(oldFragment, fragment){
      var curtainConf = _getCutainConf(oldFragment, fragment);
      if (!curtainConf && _defaultCurtainConf){
        curtainConf = _defaultCurtainConf;
      }
      MovieMediator.sub('director', CurtainEvt.AFTER_SHOW, function(evt, curtain){
        MovieMediator.unsub('director');
      });
      _stage.showCurtain(curtainConf.curtainName, curtainConf.during || 800);
    });
    router.listen(true);
    var fragment = location.hash.replace('#!', '');
    router.entry(fragment);
  };

  /**
   * 切换场景
   *
   * @method redirect
   * @param {String} key, 场景标识
   * @param {Object} params, 场景特性
   */ 
  exports.redirect = function(key, params){
    router.redirect(key, params);
  };

  /**
   * 设置切换失败的处理函数
   *
   * @property err
   */
  exports.err;
});
