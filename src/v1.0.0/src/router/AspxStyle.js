define(function(require, exports, module){
  var _utils = {};
  _utils.str = require('../Str');
  _utils.array = require('../Array');
  _utils.isRegExp = function(el){
    return Object.prototype.toString.apply(el) === '[object RegExp]';
  };

  /** 浅对象复制
   * @param {Object} obj
   * @returns {Object}
   */ 
  var _clone = function(obj){
    var copy = {};
    for(p in obj){
      copy[p] = obj[p];
    }
    return copy;
  };

  /** 将fragment分解为id和key value两部分
   * @param {String} fragment, 形如Index.aspx?id=1&Type=2
   * @returns {Object}, 形如{id: index.aspx, keyVal: {id:1, Type:2}}
   */
  var _parseFragment2IdAndKeyVal = function(fragment){
    var id, queryString;
    // 将fragment分解为id和queryString两部分
    if (fragment === ''){
      id = '';
      queryString = undefined;
    }
    else{
      var match = /^(\/?\w+?[^?/]*(?:\/\w+?[^?/]*)*)(?:\?([^?]*))?$/.exec(fragment);
      if (!match || match.length === 0) return [];

      id = match[1].toLocaleLowerCase();
      queryString = match[2];
    }

    // 将queryString分解为键值对
    var keyVal = {} //键值对
      , keyValStrs = typeof queryString === 'undefined' && [] || queryString.split('&');
    for (var i = 0, len = keyValStrs.length; i < len; i++) {
      var tmpKeyVal = keyValStrs[i].split('=');
      if (tmpKeyVal.length){
        keyVal[tmpKeyVal[0]] = tmpKeyVal[1];
      }
    }

    return {
      id: id,
      keyVal: keyVal
    };
  };

  /** 在StrRoutes中获取与当前URL匹配的路由信息
   * @param {Object} curUrl, 当前URL信息(已经进行toLocaleLowerCase处理)
   * @param {String} id, fragment分解出的id(已经进行toLocaleLowerCase处理)
   * @param {Array} strRoutes, 全字符串路由信息集合(已经进行toLocaleLowerCase处理)
   * @param {Boolean} isSingleMatch, 是否单匹配模式
   * @returns {Array}, 匹配的路由信息集合
   */
  var _getRoutesByStrRoutes = function(curUrl, id, strRoutes, isSingleMatch){
    var routes = [], props = ['protocol', 'host', 'port', 'pathname', 'id'];
    curUrl.id = id;

    for (var i = 0, len = strRoutes.length; i < len; i++) {
      var strRoute = strRoutes[i];
      var pass = _utils.array.all(props, function(el){
        if (el !== 'id' && strRoute[el] === '') return true;

        return curUrl[el] === strRoute[el];
      });
      if (pass){
        routes.push(strRoute);
        if (isSingleMatch) break;
      }
    }
    
    return routes;
  };

  /** 在RegExpRoutes中获取与当前URL匹配的路由信息
   * @param {Object} curUrl, 当前URL信息(已经进行toLocaleLowerCase处理)
   * @param {String} id, fragment分解出的id(已经进行toLocaleLowerCase处理)
   * @param {Array} RegExpRoutes, 含正则表达式的路由信息集合(已经进行toLocaleLowerCase处理)
   * @param {Boolean} isSingleMatch, 是否单匹配模式
   * @returns {Array}, 匹配的路由信息集合
   */
  var _getRoutesByRegExpRoutes = function(curUrl, id, regExpRoutes, isSingleMatch){
    var routes = [], props = ['protocol', 'host', 'port', 'pathname', 'id'];
    curUrl.id = id;

    for (var i = 0, len = regExpRoutes.length; i < len; i++) {
      var regExpRoute = regExpRoutes[i];
      var pass = _utils.array.all(props, function(el){
        if (_utils.isRegExp(regExpRoute[el])){
          return regExpRoute[el].test(curUrl[el]);
        }
        else{
          if (el !== 'id' && regExpRoute[el] === '') return true;
          return regExpRoute[el] === curUrl[el];
        }
      });
      if (pass){
        routes.push(regExpRoute);
        if (isSingleMatch) break;
      }
    }
    
    return routes;
  };


  /** 将key解析为由id和paramNames组成的对象
   * @param {String} key, 形如Index.aspx?id=1&Type=2
   * @returns {Object}, 形如{id: 'index.aspx', paramNames: ['id', 'Type']}
   */
  exports.parseMapKey2Entry = function (key){
      var paramNames = [], id = ''
        , match = /^(\/?\w+?[^?$/{}]*(?:\/\w+?[^?$/{}]*)*)(?:\?([^?]*))?$/.exec(key);
      if (match) {
        id = match[1] && match[1].toLocaleLowerCase() || id;
        if (typeof (match[2]) !== 'undefined'){
          var paramVals = match[2].split('&');
          var paramVal, paramMatch;
          for (var i = 0, len = paramVals.length; i < len; i++) {
            paramVal = paramVals[i];
            paramMatch = /^\s*\$\{\s*(\S+)\s*\}\s*$/.exec(paramVal);
            if (paramMatch && paramMatch.length){
              paramNames.push(paramMatch[1]);
            }
          }
        }
      }

      return {
        id: id,
        paramNames: paramNames
      };
  };

  /** 解析当前URL并获取匹配的路由回调函数集合
   * @param {String} fragment
   * @param {Object} routes, 路由信息对象，内含strRoutes和regExpRoutes两个路由信息集合
   * @param {Boolean} isSingleMatch, 是否单匹配模式
   * @returns {Array} 路由回调函数集合
   */
  exports.parseCurURL2Funcs = function(fragment, routes, isSingleMatch){
    fragment = _utils.str.trim(fragment);
    var idAndKeyVal = _parseFragment2IdAndKeyVal(fragment);

    var curUrl = {
      protocol: location.protocol.toLocaleLowerCase(),
      host: location.host.toLocaleLowerCase(),
      port: location.port.toLocaleLowerCase(),
      pathname: location.pathname.toLocaleLowerCase()
    };
    // 搜索全字符串形式的路径信息
    var matchRoutes = _getRoutesByStrRoutes(_clone(curUrl), idAndKeyVal.id, routes.strRoutes, isSingleMatch);

    // 搜索含正在表达式的路径信息
    if (matchRoutes.length === 0 || !isSingleMatch){
      matchRoutes = matchRoutes.concat(_getRoutesByRegExpRoutes(_clone(curUrl), idAndKeyVal.id, routes.regExpRoutes, isSingleMatch));
    }

    // 组装路径回调函数
    var funcs = [];  
    for (var i = 0, len = matchRoutes.length; i < len; i++) {
      var matchRoute = matchRoutes[i];
      var params = {};
      _utils.array.each(matchRoute.paramNames, function(el){
        var val = idAndKeyVal.keyVal[el];
        params[el] = val && decodeURI(val) || val;
      });
      funcs.push({ action: matchRoute.action, params: params });
    }
    
    return funcs;
  };

  /** 将id和params序列化为fragment
   * @param {String} id
   * @param {Object} params
   * @param {Object} 路由信息容器
   * @returns {String}
   */
  exports.stringify2Fragment = function(id, params, routes){
    return _stringify2Fragment(id, params);
  };
  var _stringify2Fragment = function(id, params){
    var separator = '&', paramArray = [], result = '';
    for (var prop in params) {
      paramArray.push(encodeURI(prop + '=' + params[prop]));
    }
    result = paramArray.join(separator);
    result = id.toLocaleLowerCase() + (_utils.str.trim(result) === '' ? '' : '?' + result);

    return result;
  };
});
