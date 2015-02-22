/**
 * @module lpp
 * @module router
 * @author fsjohnhuang
 * @description 路由器
 * 这里将url切割为下列2个部分
 * ns 命名空间, 分割为4个部分
 *  protocol: 协议
 *  host: 主机名/域名
 *  port: 端口号
 *  pathname: 目录路径
 * hash: 包含#的锚, 又分割为下列2个部分
 *  hashPrefix: 锚前缀，#!
 *  fragment: 锚,又分割为下列2个部分
 *    id: 锚id (不区分大小写)
 *    queryString: 查询参数(区分大小写)
 *
 * 映射关系的key分为id和paramNames两部分
 */
define(function(require, exports, module){
  var _utils = {};
  _utils.str = require('../Str');
  _utils.array = require('../Array');
  _utils.isObj = function(el){
    return Object.prototype.toString.apply(el) === '[object Object]';
  }

  var _logger = require('../Logger');

  // 组装路由信息的私有模块
  var _assembleRoute = require('./private/AssembleRoute');
  // 路由风格处理模块
  var _style = require('./RESTfulStyle');


  var router = {};
  module.exports = router;

  /**
   * 下列属性用于兼容IE7及以下版本的浏览器
   */
  var _listenInterval = 500 // IE9下监听hash变化的默认时间间隔(单位：毫秒)
    , _timeoutID
    , _prevFragment = ''; // 旧的hash fragment

  /**
   * 下列属性用于全局属性保存
   */
  /**
   * @name _routes
   * @description 路由信息容器
   * @private
   * @type {Object}, 内含strRoutes和regExpRoutes两个路由信息集合
   * @example 
   * strRoutes和regExpRoutes的内部元素为
   * {
   *  {String} fullId
   *  {String|RegExp} protocol
   *  {String|RegExp} host
   *  {String|RegExp} port
   *  {String|RegExp} pathname
   *  {String|RegExp} id
   *  {String[]} paramNames
   *  {Function} action
   * }
   * 按id的长度由长到短排序
   */
  var _routes = {
    strRoutes: [],
    regExpRoutes: []
  };

  var _hashPrefix = '#!' // hash中的hash prefix
    , _history = { list: [], idx: -1 } // hash变化的历史记录
    , _isAppend2History = 1; // 0:当前hash变化不添加到历史记录中; 1:当前hash变化添加到历史记录中

  // 执行action前后的回调函数
  var _beforeAction = [], _afterAction = [];

  /**
   * 匹配模式（不区分大小写），s或single时表示成功匹配就中断匹配过程并调用相应的回调函数
   * m或multiple表示成功匹配后调用相应的回调函数，并继续执行匹配过程并调用其余匹配成功的回调函数
   *
   * @property matchMode
   * @static
   * @type String
   * @default "s"
   */
  router.matchMode = 's';

  /**
   *  各路由回调函数的第一个入参，用于函数间通讯
   */
  router.state = {};

  /**
   * 匹配失败的响应函数
   */
  router.matchFail = null;
  var _matchFail = function(state){
    _logger.info('match fail!');
    router.matchFail && router.matchFail(state);
  };
  /**
   * 执行action时报异常的响应函数
   */
  router.err = null;
  var _err = function(state, params, ex){
    _logger.error('', ex);
    router.err && router.err(state, params, ex);
  };

  /**
   * 添加执行跳转前的监听回调函数
   *
   * @method listenBeforeAction
   * @param {Function(oldFragment, fragment, funcs} fn
   */
  router.listenBeforeAction = function(fn){
    _beforeAction.push(fn);
  };
  /**
   * 添加执行跳转后的监听回调函数
   *
   * @method listenAfterAction
   * @param {Function(oldFragment, fragment)} fn
   */
  router.listenAfterAction = function(fn){
    _afterAction.push(fn);
  };

  /**
   * 设置路由回调函数映射信息
   * 入参形式1
   * @param {String} key, 路由
   * @param {Function(state, params)} action, 回调函数
   *
   * 入参形式2
   * @param {Object} key, 路由,内部属性protocol,host,prot,pathname,key
   * @param {Function(state, params)} action, 回调函数
   *
   * 入参形式3
   * @param {Object} key, 路由和回调函数,内部属性protocol,host,prot,pathname,key,action
   *
   * 入参形式4
   * @param {Array} key, 路由和回调函数集合,内部元素属性protocol,host,prot,pathname,key,action
   */ 
  router.map = function (key, action) {
    // 整合路由信息
    var addingStrRoutes = [], addingRegExpRoutes = [], tmpRoute;
    if (arguments.length === 2){
      if (typeof (key) === 'string'){
        addingStrRoutes.push(_assembleRoute.assembleStrKeyRoute(key, action, _style.parseMapKey2Entry));
      }
      else if (_utils.isObj(key)){
        tmpRoute = _assembleRoute.assembleObjKeyRoute(key, action, _style.parseMapKey2Entry);
        if (tmpRoute.hasRegExp){
          addingRegExpRoutes.push(tmpRoute.route);
        }
        else{
          addingStrRoutes.push(tmpRoute.route);
        }
      }
    }
    else if (arguments.length === 1){
      if (!key.length){
        key = [key];
      }
      for (var i = 0, len = key.length; i < len; i++) {
        tmpRoute = _assembleRoute.assembleComplexKeyRoute(key[i], _style.parseMapKey2Entry);
        if (tmpRoute.hasRegExp){
          addingRegExpRoutes.push(tmpRoute.route);
        }
        else{
          addingStrRoutes.push(tmpRoute.route);
        }
      }
    }

    // 按分类将路由信息添加到_route.strRoutes和_route.regExpRoutes中
    for (var i = 0, len = addingStrRoutes.length; i < len; i++) {
      _routes.strRoutes = _utils.array.insertBefore(_routes.strRoutes, addingStrRoutes[i], function(el, newEl){
          return el.id.length <= newEl.id.length;  
      });
    };
    for (var i = 0, len = addingRegExpRoutes.length; i < len; i++) {
      _routes.regExpRoutes = _utils.array.insertBefore(_routes.regExpRoutes, addingRegExpRoutes[i], function(el, newEl){
          return el.id.length <= newEl.id.length;  
      });
    };

    // 开启listen接口
    if (router.listen) return;
    router.listen = _listen;
  };

  /* 
   * @param {Number|Boolean} [during]
   * @param {Boolean} [silent=false], 是否开启静默模式监听hash变化（默认为否）
   * 注意：开启静默模式后，会开启entry接口用于触发进入当前页面事件,调用entry或redirect接口后，entry接口将被关闭
   */
  var _listen = function (during, silent) {
    var _during = typeof during === 'number' && during || null;
    if (typeof during === 'boolean'){
      silent = during;
    }
    else{
      silent = silent || false;
    }

    var fragment = location.hash.replace(_hashPrefix, '');
    !silent && _redirect('', fragment);
    if (silent){
      //开启静默模式后，会开启entry接口用于触发进入当前页面事件,调用entry或redirect接口后，entry接口将被关闭
      router.entry = function(fragment){
        _redirect('', fragment);
        delete router.entry;
      };
    }
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf('MSIE') > 0 && parseInt(_utils.str.trim(userAgent.split(';')[1].replace('MSIE', ''))) < 9) {
      _prevFragment = fragment;
      _compatIE76(_during);
    }
    else {
      window.onhashchange = function () {
        var oldURL = arguments[0].oldURL;
        _redirect(oldURL.substring(oldURL.indexOf(_hashPrefix) + _hashPrefix.length)
              , location.hash.replace(_hashPrefix, ''));
      };
    }
    
    // 关闭listen接口，开启stop接口
    delete router.listen;
    router.stop = _stop;
  };

  /**
   * 停止监听
   */
  _stop = function(){
    clearTimeout(_timeoutID);
    window.onhashchange = null;

    // 开启listen接口，关闭stop接口
    router.listen = _listen;
    delete router.stop;
  };

  /**
   * @description 实现同页面hash跳转
   * @param {String} key 当key为映射关系fragment中的id;当params不存在时，key还可以为完整的fragment
   * @param {Object} [params]
   * @returns {lpp.Router} 当前路由器
   */
  router.redirect = function (key, params) {
    if (router.entry){
      delete router.entry;
    }

    var hash;
    if (params){
      hash = _hashPrefix + _style.stringify2Fragment(key, params, _routes);
    }
    else{
      hash = _hashPrefix + encodeURI(key);
    }
    _modifyHash(hash);
  };

  /**
   * @description 实现不同页面的跳转
   * @param {String} url url地址
   * @returns {undefined}
   */
  router.assign = function (url){
    location.assign(url);
  };


  /**
   * 单页历史接口
   */
  router.history = {
    // 后退
    back: function () {
            var nextIdx = _history.idx - 1;
            if (nextIdx < 0) return;

            _history.idx = nextIdx;
            _isAppend2History = 0;
            _modifyHash(_hashPrefix + _history.list[nextIdx]);
          },
    // 前进
    forward: function () {
               var nextIdx = _history.idx + 1;
               if (nextIdx === _history.list.length) return;

               _history.idx = nextIdx;
               _isAppend2History = 0;
               _modifyHash(_hashPrefix + _history.list[nextIdx]);
             },
    // 跳到某历史记录
    go: function(nextIdx){
          if (nextIdx < 0 || nextIdx >= _history.length) return;

          _history.idx = nextIdx;
          _isAppend2History = 0;
          _modifyHash(_hashPrefix + _history.list[nextIdx]);
        },
    clear: function(){
             _history.list = [];
             _history.idx = -1;
           },
    // 显示历史记录
    list: function () {
            return _history.list.concat([]);
          }
  };


  /**
   * @name _isSingleMatch
   * @description 获取路由器的匹配模式
   * @private
   * @method
   * @returns {Boolean}
   */
  var _isSingleMatch = function(){
    var cond = _utils.str.trim(router.matchMode.toLocaleLowerCase());
    var isSingleMatch = !_utils.array.some(['m', 'multiple'], cond);

    _logger.info(isSingleMatch ? 'is single match' : 'is multiple match');

    return isSingleMatch;
  };

  /** 记录单页浏览历史
   * @param {String} hash, URL的hash
   */
  var _append2History = function (hash) {
    var len = _history.list.length;
    _history.list[len] = hash.replace(_hashPrefix, '');
    _history.idx = len;
  };

  /** 修改URL的hash
   * @param {String} hash
   */
  var _modifyHash = function (hash) {
    location.hash = hash;
  };

  /** 执行路由回调函数 
   * @param {Array} funcs, 回调函数信息体集合。回调函数信息体含action和params属性
   */
  var _exec = function (funcs) {
    var func;
    try{
      if (funcs.length === 0){
        router.matchFail && router.matchFail(router.state);
      }
      else{
        for (var i = 0, len = funcs.length; i < len; i++) {
          func = funcs[i];
          func.action(router.state, func.params);
        }
      }
    }
    catch(ex){
      _err(router.state, func ? func.params : {}, ex);
    }
  };

  /** 通过fragment调用路由回调函数
   * @param {String} fragment
   */
  var _redirect = function (oldFragment, fragment) {
    if (_isAppend2History) {
      _append2History(fragment);
    }
    else {
      _isAppend2History = 1;
    }
    var funcs = _style.parseCurURL2Funcs(fragment, _routes, _isSingleMatch());
    for (var i = 0, len = _beforeAction.length; i < len; ++i){
      _beforeAction[i](oldFragment, fragment, funcs);
    }
    _exec(funcs);
    for (var i = 0, len = _afterAction.length; i < len; ++i){
      _afterAction[i](oldFragment, fragment);
    }
  };

  /** 兼容IE7和6，监听URL的hash变化
   * @param {Number} [interval=_listenInterval], 轮询时间间隔
   */
  var _compatIE76 = function (interval) {
    var check = function () {
      var curFragment = location.hash.replace(_hashPrefix, '');
      var changedIframeHash = _iframeWrapper.check();
      var oldFragment = curFragment;
      if (!changedIframeHash && curFragment === _prevFragment) {
        _timeoutID = setTimeout(check, interval || _listenInterval);
        return;
      }
      
      if (changedIframeHash){
        var href = location.href.replace(location.hash, '');
        location.replace(href + (_iframeWrapper.curHash.replace(_hashPrefix, '').replace('#', '') === '' ? '' : _iframeWrapper.curHash));
        _prevFragment = _iframeWrapper.curHash.replace(_hashPrefix, '').replace('#', '');
      }
      else{
        _prevFragment = curFragment;
        _iframeWrapper.change(location.hash);
      }
      _redirect(oldFragment, _prevFragment);
      _timeoutID = setTimeout(check, interval || _listenInterval);
    };

    _iframeWrapper.init();
    _iframeWrapper.change(location.hash);
    _timeoutID = setTimeout(check, interval || _listenInterval);
  };
  /**
   * 通过iframe实现浏览器back、prev键的跟踪变化
   */
  var _iframeWrapper = {
    curHash: '',
    history: [],
    init: function(){
            var div = document.createElement('div');
            div.style.display = 'none';
            div.innerHTML = '<iframe id="compactIE76" style="display:none;" src="javascript:false"/>';
            document.body.appendChild(div);
          },
    /**
     * 当浏览器地址栏的hash变化时，修改iframe的location.hash,从而实现浏览器back、prev键的跟踪变化
     *
     * @param {String} hash
     */
    change: function(hash){
              if (window.compactIE76.location.hash === hash) return;

              // 通过open、close方法实现浏览器back、prev键的跟踪变化
              window.compactIE76.document.open();
              window.compactIE76.document.close();
              window.compactIE76.location.hash = hash;
              this.history.push(hash);
              this.curHash = hash;
            },
    /**
     * 定时检查iframe的location.hash是否变化了,因为按浏览器的back、prev键时会修改iframe的location.hash
     */
    check: function(){
              var curHash = window.compactIE76.location.hash;
              var oldHash = this.curHash;
              this.curHash = curHash;
              return curHash !== oldHash;
            }
  };

});
