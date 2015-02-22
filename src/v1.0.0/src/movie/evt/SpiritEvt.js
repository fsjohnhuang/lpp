/**
 * @module lpp
 * @submodule movie
 */
define(function(require, exports, module){

  /**
   * 精灵的事件
   *
   * @class Spirit
   * @static
   */
  var STATUS = {
    INIT: 'init.baseSpirit',
    RENDER: 'render.baseSpirit',
    LOAD_DATA_FAIL: 'loadDataFail.baseSpirit',
    LOAD_DATA_SUCCESS: 'loadDataSuccess.baseSpirit',
    ERR: 'err.baseSpirit'
  };

  module.exports = STATUS
});
