/**
 * @module lpp
 * @submodule movie
 */
define(function(require, exports, module){
  var $ = require('$');
  var SceneEvt = require('./SceneEvt');

  /**
   * 场景的事件基类, 接入Director的场景的事件必须继承该基类
   *
   * @class DirectorSceneEvt
   * @static
   */
  var STATUS = {
    INIT: 'init.director_scene',
    RENDER: 'render.director_scene',
    HIDE_CURTAIN: 'hideCurtain.director_scene',
    LOAD_DATA_FAIL: 'loadDataFail.director_scene',
    LOAD_DATA_SUCCESS: 'loadDataSuccess.director_scene',
    ERR: 'err.director_scene',
    INIT_SPIRIT: 'initSpirit.director_scene'
  };
  $.extend(STATUS, SceneEvt);

  module.exports = STATUS
});
