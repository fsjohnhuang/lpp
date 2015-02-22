/**
 * 事件队列,用于序列化执行事件
 * @module lpp
 * @submodule base
 */
define(function(require, exports, module){
  "use strict";

  require('./shim');

  var _utils = {};
  _utils.array = require('./Array');
  _utils.str = require('./Str');

  /**
   * 从队列头获取第一个事件方法配置项
   *
   * @method _next
   * @private
   * @param {Array} queue 队列
   * @return {Object} 事件方法配置项
   */
  var _next = function(queue){
    if (queue.length){
      return queue.shift();
    }
  };

  /**
   * 执行事件函数
   *
   * @method _exec
   * @private
   * @param {Object} funcConf 事件函数配置项
   */
  var _exec = function(funcConf){
    setTimeout(function(){
      funcConf.func(funcConf.scope, funcConf.args);
    }, 0);
  };

  /**
   * 释放阻塞
   *
   * @method _release
   * @private
   */
  var _release = function(){
    var conf = this;
    var nextFuncConf = _next(conf.queue);
    if (nextFuncConf){
      _exec(nextFuncConf);
    }
    else{
      conf.isBlock = false;
    }
  };

  /**
   * 封装事件函数
   *
   * @method _assembleRegisteredFunc
   * @private
   * @param {Function} func 原事件函数
   * @param {Object} conf 事件队列的内部配置项
   * @return {Function} 封装后的事件函数
   */
  var _assembleRegisteredFunc = function(func, conf){
    return function(scope, args){
      conf.isBlock = true;
      args.unshift(conf.release);
      func.apply(scope, args);
    };  
  };

  /**
   * 注册事件到队列管理（带事件函数的this设置）
   *
   * @method _registerWith
   * @private
   * @param {String} name 事件名
   * @param {Function} func 事件函数，函数签名(release, presetArgs, args)
   * @param {Any} [scope=null] this
   * @param {Any} [presetArg*] 预设置的入参值
   */
  var _registerWith = function(name, func, scope, presetArg){
    var conf = this, _presetArgs = [], scope = scope || null;
    if (arguments.length >= 4){
      _presetArgs = _utils.array.toArray(arguments, 3);
    }

    conf.funcMaps[name] = {
      func: _assembleRegisteredFunc(func, conf),
      scope: scope,
      presetArgs: _presetArgs
    };
  };

  /**
   * 注册事件到队列管理
   * 
   * @method _register
   * @private
   * @param {String} name 事件名
   * @param {Function} func 事件函数，函数签名(release, presetArgs, args)
   * @param {Any} [presetArg*] 预设置的入参值
   */
  var _register = function(name, func, presetArg){
    var conf = this, _presetArgs = [], scope = null;
    if (arguments.length >= 3){
      _presetArgs = _utils.array.toArray(arguments, 2);
    }

    conf.funcMaps[name] = {
      func: _assembleRegisteredFunc(func, conf),
      scope: scope,
      presetArgs: _presetArgs
    };
  }

  /**
   * 触发事件
   *
   * @method _call
   * @private
   * @param {String} name 事件名；{Array} 多个事件名和入参，内部项{name:事件名,args:[入参...]}
   * @param {Any} args* 入参
   */
  var _call = function(name, args){
    var conf = this;
    var arr = [];
    if (Object.prototype.toString.call(name) === '[object Array]'){
      arr = name;
    }
    else{
      arr.push({ name: name, args: _utils.array.toArray(arguments, 1) });
    }
    for (var i = 0, len = arr.length; i < len; i++) {
      var funcMap = conf.funcMaps[arr[i].name];
      if (!funcMap) continue; 
      
      var funcConf = {
        func: funcMap.func,
        scope: funcMap.scope,
        args: funcMap.presetArgs.concat(arr[i].args)
      };
      conf.queue.push(funcConf);
    }
    if (!conf.isBlock){
      conf.isBlock = 1;
      _exec(_next(conf.queue));
    }
  };

  /**
   * 创建事件队列对象
   * 
   * @class EvtQueue
   * @static
   * @method create
   * @return {EvtQueue} 事件队列对象<br/>
   * 事件队列对象含<br/>
   * 方法：
   * registerWith<br/>
   * register<br/>
   * call
   */
  exports.create = function (){
    var conf = {
      funcMaps: {},
      queue: [],
      isBlock: false
    }
    conf.release = _release.bind(conf); 

    return {
      /**
       * 注册事件到队列（可绑定执行上下文的this属性）
       *
       * @method registerWith
       * @param {String} name 事件名
       * @param {Function} func 事件函数，函数签名(release, presetArgs, args)
       * @param {Any} [scope=null] this
       * @param {Any} [presetArg*] 预设置的入参值
       */
      registerWith: _registerWith.bind(conf),
      /**
       * 注册事件到队列
       *
       * @method register
       * @param {String} name 事件名
       * @param {Function} func 事件函数，函数签名(release, presetArgs, args)
       * @param {Any} [presetArg*] 预设置的入参值
       */
      register: _register.bind(conf),
      /**
       * 触发事件
       *
       * @method call
       * @param {String} name 事件名；{Array} 多个事件名和入参，内部项{name:事件名,args:[入参...]}
       * @param {Any} [args*] 入参
       */
      call: _call.bind(conf)
    };
  };
});
