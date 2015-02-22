/**
 * @module lpp
 * @submodule base
 */
define(function(require, exports, module){
  var _utils = {};
  _utils.array = require('./Array');
  _utils.str = require('./Str');

  /**
   * Sub/Pub中间件模块，用于对各模块进行解耦
   *
   * @class Mediator
   * @constructor
   */
  var Mediator = function(){
    if (this === window){
      return new Mediator();
    }

    this.invokedOnce = 0; // 判断是有调用过once方法
    this.channels = {};
    this.subscribers = {};
  };

  /**
   * 解析渠道名称和命名空间
   *
   * @method _parseChannel
   * @private
   * @param {String} channel 渠道名称和命名空间
   * @param {Boolean} [strict=false] 为false或channel形如evt时，返回值会包含'':evt项
   * @return {Object} 形如{命名空间: 渠道名称}
   */
  var _parseChannel = function(channel, strict){
    strict  = strict || false;
    var parts = channel.split('.');
    var name = _utils.str.trim(parts[0]);
    var rs = {};
    if (parts.length === 1 || !strict){
      rs = {
        '': name
      };
    }
    for (var i = 1, len = parts.length; i < len; i++) {
      rs[_utils.str.trim(parts[i])] = name;
    }

    return rs;
  };

  /**
   * 订阅
   *
   * @method sub
   * @param {String} subscriber 事件订阅者
   * @param {String} channel 支持命名空间，channel名称.命名空间1.命名空间2 转换为 channel名称.命名空间1 和 channel名称.命名空间2
   * @param {Function} fn
   * @param {Any} [presetParam*] 预设参数
   */
  Mediator.prototype.sub = function(subscriber, channel, fn, presetParam){
    var ns = _parseChannel(channel);
    for (var p in ns){
      this.channels[p] = this.channels[p] || {};
      this.channels[p][ns[p]] = this.channels[p][ns[p]] || [];
      this.channels[p][ns[p]].push({
        callback: fn,
        evt: {
          namespace: p
        },
        presetParams: _utils.array.toArray(arguments, 3),
        subscriber: subscriber
      });

      // 记录订阅者所订阅的事件
      this.subscribers[subscriber] = this.subscribers[subscriber] || [];
      this.subscribers[subscriber].push({
        ns: p,
        evtName: ns[p],
        fnIndex: this.channels[p][ns[p]].length - 1
      });
    }
  };

  Mediator.prototype.once = function(subscriber, channel, fn, presetParam){
    this.invokedOnce = 1;
    var ns = _parseChannel(channel);
    for (var p in ns){
      this.channels[p] = this.channels[p] || {};
      this.channels[p][ns[p]] = this.channels[p][ns[p]] || [];
      this.channels[p][ns[p]].push({
        callback: fn,
        evt: {
          namespace: p
        },
        presetParams: _utils.array.toArray(arguments, 3),
        subscriber: subscriber,
        once: 1
      });

      // 记录订阅者所订阅的事件
      this.subscribers[subscriber] = this.subscribers[subscriber] || [];
      this.subscribers[subscriber].push({
        ns: p,
        evtName: ns[p],
        fnIndex: this.channels[p][ns[p]].length - 1
      });
    }
  };

  /**
   * 取消订阅者的所有订阅
   *
   * @method unsub
   * @param {String} subscriber 订阅者
   */
  Mediator.prototype.unsub = function(subscriber){
    var subscriberConfs = this.subscribers[subscriber];
    if (!subscriberConfs) return;

    for (var i = 0, len = subscriberConfs.length; i < len; i++) {
      var subscriberConf = subscriberConfs[i];
      this.channels[subscriberConf.ns][subscriberConf.evtName].splice(subscriberConf.fnIndex, 1);  
    }
    delete this.subscribers[subscriber];
  };

  /**
   * 发布
   *
   * @method pub
   * @param {Array} subscribers 得到通知的订阅者名单, 若为null或[]则通知所有订阅者
   * @param {String} channel
   * @param {Any} [param*]
   */
  Mediator.prototype.pub = function(subscribers, channel, param){
    var ns = _parseChannel(channel, true);
    var fnConfs = [];
    var onceConfs= [];
    
    for (var p in ns){
      if (p !== '' && ns[p] === ''){
        // 触发.ns的事件
        for (var name in this.channels[p]){
          if (this.channels[p] && this.channels[p][name]){
            fnConfs = fnConfs.concat(this.channels[p][name]);

            for (var i = 0, len = this.channels[p][name].length; i < len && this.invokedOnce; i++) {
              if (this.channels[p][name][i].once){
                onceConfs.push({
                  ns: p,
                  name: name,
                  fnIndex: i
                });
              }
            }
          }
        }
      }
      else if (p === '' && ns[p] !== '' && ns[p].indexOf('!') === -1){
        // 触发evt的事件
        for (var prop in this.channels){
          for (var name in this.channels[prop]){
            if (name === ns[p]){
              if (this.channels[prop] && this.channels[prop][name]){
                fnConfs = fnConfs.concat(this.channels[prop][name]);

                for (var i = 0, len = this.channels[prop][name].length; i < len && this.invokedOnce; i++) {
                  if (this.channels[prop][name][i].once){
                    onceConfs.push({
                      ns: prop,
                      name: name,
                      fnIndex: i
                    });
                  }
                }
              }
            }
          }
        }
      }
      else if (p === '' && ns[p] !== ''){
        // 触发evt!的事件
        if (this.channels[''] && this.channels[''][ns[p]]){
          fnConfs = fnConfs.concat(this.channels[''][ns[p]]);

          for (var i = 0, len = this.channels[''][ns[p]].length; i < len && this.invokedOnce; i++) {
            if (this.channels[''][ns[p]][i].once){
              onceConfs.push({
                ns: '',
                name: ns[p],
                fnIndex: i
              });
            }
          }
        }
      }
      else{
        // 触发evt.ns的事件
        if (this.channels[p] && this.channels[p][ns[p]]){
          fnConfs = fnConfs.concat(this.channels[p][ns[p]]);

          for (var i = 0, len = this.channels[p][ns[p]].length; i < len && this.invokedOnce; i++) {
            if (this.channels[p][ns[p]][i].once){
              onceConfs.push({
                ns: p,
                name: ns[p],
                fnIndex: i
              });
            }
          }
        }
      }
    }

    for (var i = 0, len = fnConfs.length; i < len; i++) {
      var fnConf = fnConfs[i];
      if (subscribers && subscribers.length > 0){
        var invoke = false;
        for (var j = 0, jLen = subscribers.length; j < jLen && !invoke; j++) {
          var tmpSubscriber = subscribers[j];
          if (tmpSubscriber.indexOf('.') === 0
              && fnConf.subscriber.indexOf('.') > 0
              && fnConf.subscriber.substring(fnConf.subscriber.indexOf('.')) === tmpSubscriber){
            invoke = true;
          }
          else if (tmpSubscriber === fnConf.subscriber){
            invoke = true;
          }
        }
        invoke && fnConf.callback.apply(null, [fnConf.evt].concat(fnConf.presetParams.concat(_utils.array.toArray(arguments, 2))));
      }
      else{
        fnConf.callback.apply(null, [fnConf.evt].concat(fnConf.presetParams.concat(_utils.array.toArray(arguments, 2))));
      }
    }
    for (var i = 0, len = onceConfs.length; i < len; i++) {
      var onceConf = onceConfs[i];
      this.channels[onceConf.ns][onceConf.name].splice(onceConf.fnIndex, 1);
    }
  };

  module.exports = Mediator;
});
