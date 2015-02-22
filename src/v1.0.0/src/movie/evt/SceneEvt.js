/**
 * @module lpp
 * @submodule movie
 */
define(function(require, exports, module){
  /**
   * Scene类的事件
   *
   * @class Scene
   */

  var SCENE = {
    /**
     * 场景初始化前触发
     *
     * @event BEFORE_INIT
     * @param {Object} evt 事件对象，内含namespace属性
     * @param {Scene} scene 场景对象
     */
    BEFORE_INIT: 'beforeInit.baseScene',
    /**
     * 场景初始化后触发
     *
     * @event AFTER_INIT
     * @param {Object} evt 事件对象，内含namespace属性
     * @param {Scene} scene 场景对象
     */
    AFTER_INIT:  'afterInit.baseScene',
    /**
     * 添加组件到场景前触发
     *
     * @event BEFORE_APPEND_CHILD
     * @param {Object} evt 事件对象，内含namespace属性
     * @param {Scene} scene 场景对象
     */
    BEFORE_APPEND_CHILD: 'beforeAppendChild.baseScene',
    /**
     * 添加组件到场景后触发
     *
     * @event AFTER_APPEND_CHILD 
     * @param {Object} evt 事件对象，内含namespace属性
     * @param {Scene} scene 场景对象
     */
    AFTER_APPEND_CHILD: 'afterAppendChild.baseScene',
    /**
     * 将场景添加到父节点前触发
     *
     * @event BEFORE_RENDER 
     * @param {Object} evt 事件对象，内含namespace属性
     * @param {Scene} scene 场景对象
     */
    BEFORE_RENDER: 'beforeRender.baseScene',
    /**
     * 将场景添加到父节点后触发
     *
     * @event AFTER_RENDER 
     * @param {Object} evt 事件对象，内含namespace属性
     * @param {Scene} scene 场景对象
     */
    AFTER_RENDER: 'afterRender.baseScene',
    /**
     * 场景删除组件前触发
     *
     * @event BEFORE_REMOVE_CHILD 
     * @param {Object} evt 事件对象，内含namespace属性
     * @param {Scene} scene 场景对象
     */
    BEFORE_REMOVE_CHILD: 'beforeRemoveChild.baseScene',
    /**
     * 场景删除组件后触发
     *
     * @event AFTER_REMOVE_CHILD 
     * @param {Object} evt 事件对象，内含namespace属性
     * @param {Scene} scene 场景对象
     */
    AFTER_REMOVE_CHILD: 'afterRemoveChild.baseScene',
    /**
     * 清除场景前触发
     *
     * @event BEFORE_DISPOSE 
     * @param {Object} evt 事件对象，内含namespace属性
     * @param {Scene} scene 场景对象
     */
    BEFORE_DISPOSE: 'beforeDispose.baseScene',
    /**
     * 清除场景后触发
     *
     * @event AFTER_DISPOSE 
     * @param {Object} evt 事件对象，内含namespace属性
     * @param {Scene} scene 场景对象
     */
    AFTER_DISPOSE: 'afterDispose.baseScene'
  };

  module.exports = SCENE;
});
