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


  /** 将key解析为由id和paramNames组成的对象
   * @param {String} key, 形如Index.aspx?id=1&Type=2
   * @returns {Object}, 形如{id: 'index.aspx', paramNames: ['id', 'Type']}
   */
  exports.parseMapKey2Entry = function (key){
    var paramNames = [], id = ''
      , keyLastIdx = key.length - 1
      , match = /^(\/?\w+?[^$/{}]*(?:\/\w+?[^$/{}]*)*)(\/\$\{.*)?$/.exec(key.lastIndexOf('/') === keyLastIdx ? key.substring(0, keyLastIdx) : key);
    if (match && match.length === 3) {
      id = match[1];
      if (typeof (match[2]) != 'undefined'){
        var paramVars = match[2].split('/');
        var paraVal, paramMatch;
        for (var i = 0, len = paramVars.length; i < len; i++) {
          paramVal = paramVars[i];
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
    var strRoutes = _utils.array.grep(routes.strRoutes, function(el){
      var idx = fragment.indexOf(el.id);
      return idx === 0 && (el.id.length === fragment.length || fragment.substr(el.id.length, 1) === '/');
    });
    var regExpRoutes = _utils.array.grep(routes.regExpRoutes, function(el){
      var idx = fragment.indexOf(el.id);
      return idx === 0 && (el.id.length === fragment.length || fragment.substr(el.id.length, 1) === '/');
    });
    var tmpMatchRoutes = [];
    for (var i = 0, len = strRoutes.length; i < len; i++) {
      strRoutes[i].type = 1;
      tmpMatchRoutes.push(strRoutes[i]); 
    };
    for (var i = 0, len = regExpRoutes.length; i < len; i++) {
      regExpRoutes[i].type = 0;
      tmpMatchRoutes.push(regExpRoutes[i]); 
    };
    tmpMatchRoutes.sort(function(a, b){
      return b.id.length - a.id.length;
    });

    var curUrl = {
      protocol: location.protocol.toLocaleLowerCase(),
      host: location.host.toLocaleLowerCase(),
      port: location.port.toLocaleLowerCase(),
      pathname: location.pathname.toLocaleLowerCase()
    };
    var matchRoutes = [], tmpMatchRoute, props = ['protocol', 'host', 'port', 'pathname'], pass = false;
    for (var i = 0, len = tmpMatchRoutes.length; i < len && (isSingleMatch && !matchRoutes.length || !isSingleMatch); i++) {
      tmpMatchRoute = tmpMatchRoutes[i];
      if (tmpMatchRoute.type){
        // 全字符串形式的路径信息
        pass = _utils.array.all(props, function(el){
          return tmpMatchRoute[el] === '' && true || curUrl[el] === tmpMatchRoute[el];
        });
        if (pass){
          delete tmpMatchRoute.type;
          matchRoutes.push(tmpMatchRoute);
        }
      }
      else{
        // 含正则表达式形式的路径信息
        pass = _utils.array.all(props, function(el){
          if (_utils.isRegExp(tmpMatchRoute[el])){
            return tmpMatchRoute[el].test(curUrl[el]);
          }
          else{
            return tmpMatchRoute[el] === '' && true || curUrl[el] === tmpMatchRoute[el];
          }
        });
        if (pass){
          delete tmpMatchRoute.type;
          matchRoutes.push(tmpMatchRoute);
        }
      }
    }

    // 组装路径回调函数
    var funcs = [];  
    for (var i = 0, len = matchRoutes.length; i < len; i++) {
      var matchRoute = matchRoutes[i];
      var params = {};
      var index = fragment.indexOf(matchRoute.id);
      var queryString = fragment.substring(index + matchRoute.id.length);
      var vals = [];
      if (queryString.length > 1){
        queryString = queryString.substring(1);
        vals = queryString.split('/');
        if (vals.length === 2 && vals[1] === ''){
          vals.length = 1;
        }
      }
      for (var j = 0, jLen = matchRoute.paramNames.length; j < jLen; j++) {
        var paramName = matchRoute.paramNames[j];
        var val = vals[j];
        params[paramName] =  val && decodeURI(val) || val;
      };
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
    var route;
    for (var i = 0, len = routes.strRoutes.length; i < len && !route; i++) {
      if (routes.strRoutes[i].id === id){
        route = routes.strRoutes[i];
      }
    }
    for (var i = 0, len = routes.regExpRoutes.length; i < len && !route; i++) {
      if (routes.regExpRoutes[i].id === id){
        route = routes.regExpRoutes[i];
      }
    }
    if (!route){
      return location.hash;
    }
    
    var vals = [];
    for (var i = 0, len = route.paramNames.length; i < len; i++) {
      var paramName = route.paramNames[i];
      var val = null;
      for(var prop in params){
        if (prop === paramName)
        {
          val = params[prop];
          break;
        }
      }
      if (val === null) break;

      vals.push(val);
    };

    var rs = id + (id.substring(id.length - 1) === '/' ? '' : '/') + _utils.array.map(vals, function(el){ return  encodeURI(el);}).join('/');
    return rs;
  };
});
