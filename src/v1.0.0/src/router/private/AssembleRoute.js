define(function(require, exports, module){

  /** 整合通过lpp.Router.map({String}, {Function})设置的路由信息
   * @param {String} key
   * @param {Function} action
   * @param {Function} parseMapKey2Entry
   * @returns {Object} 路由信息
   */
  exports.assembleStrKeyRoute = function(key, action, parseMapKey2Entry){
    var route = parseMapKey2Entry(key);
    route.protocol = '';
    route.host = '';
    route.port = '';
    route.pathname = '';
    route.action = action;
    route.fullId = route.id;

    return route;
  };

  /** 整合通过lpp.Router.map({Object}, {Function})设置的路由信息
   * @param {Object} key
   * @param {Function} action
   * @param {Function} parseMapKey2Entry
   * @returns {Object} 路由信息, 内含hasRegExp和route属性
   */
  exports.assembleObjKeyRoute = function(key, action, parseMapKey2Entry){
    var route = parseMapKey2Entry(key.key), props = ['protocol', 'host', 'port', 'pathname'];
    var hasRegExp = false;
    var fullId = '';
    for (var i = 0, len = props.length; i < len; i++) {
      var prop = props[i], isRegExp = key[prop] && !!key[prop].test || false;
      hasRegExp = hasRegExp || isRegExp;
      if (isRegExp){
        route[prop] = key[prop];
      }
      else{
        route[prop] = key[prop] && key[prop].toLocaleLowerCase() || '';
      }
      fullId += route[prop].toString();
    };
    route.action = action;
    route.fullId = fullId + route.id;

    return {
      hasRegExp: hasRegExp,
      route: route
    };
  };

  /** 整合通过lpp.Router.map({Array})设置的路由信息
   * @param {Object} key
   * @param {Function} parseMapKey2Entry
   * @returns {Object} 路由信息, 内含hasRegExp和route属性
   */
  exports.assembleComplexKeyRoute = function(key, parseMapKey2Entry){
    return exports.assembleObjKeyRoute(key, key.action, parseMapKey2Entry);
  };
});
