/**
 * @module lpp
 * @submodule fx
 */
define(function(require, exports, module){
  "use strict";

  require('../shim');
  var _utils = {};
  _utils.str = require('../Str');
  _utils.fn = require('../Fn');

  /**
   * @class fx
   * @static
   */

  /**
   * 执行动画
   *
   * @method _go
   * @private
   * @param {String} curPointStr 当前固定的points属性的值
   * @param {HtmlElement} dom
   * @param {Array} points 节点动画配置，形如[{x: 0, y: 100}, {x: 100, y: 200}]
   * @param {Number} curIdx 当前的节点索引
   * @param {Number} nextIdx 下一个节点索引
   * @param {Number} during 动画时间
   * @param {Function} callback 动画结束的回调函数
   */
  var _go = function(curPointStr, dom, points, curIdx, nextIdx, during, callback){
      var curPoint = points[curIdx];
      var nextPoint = points[nextIdx];

      var xDVal = nextPoint.x - curPoint.x;
      var yDVal = nextPoint.y - curPoint.y;
      var xStep = xDVal / during;
      var yStep = yDVal / during;

      var curX = curPoint.x, curY = curPoint.y;
      for (var i = 0, len = during; i <= len; i++) {
        _utils.fn.delay(_setPoint, i, dom, i, during, callback, curX, curY, xStep, yStep, curPointStr);
      }
    }; 
  /**
   * 设置points属性值
   *
   * @method _setPoint
   * @private
   * @param {HtmlElement} dom
   * @param {Number} delay 延迟时间
   * @param {Number} during 动画时间
   * @param {Function} callback 动画结束的回调函数
   * @param {Number} curX 当前节点的X坐标
   * @param {Number} curY 当前节点的Y坐标
   * @param {Number} xStep X轴步长 
   * @param {Number} yStep Y轴步长 
   * @param {String} curPointStr 当前固定的points属性的值
   */
  var _setPoint = function(dom, delay, during, callback, curX, curY, xStep, yStep, curPointStr){
    if (!dom.points){
      dom.setAttribute('points', curPointStr + (curX + delay * xStep) + ',' + (curY + delay * yStep));
    }
    else{
      dom.points.value = curPointStr + (curX + delay * xStep) + ',' + (curY + delay * yStep);
    }

    if (delay === during){
      callback && callback();
    }
  };
  /**
   * 动画显示下一个节点
   *
   * @method _next
   * @private
   * @param {HtmlElement} dom
   * @param {Array} points 节点动画配置，形如[{x: 0, y: 100}, {x: 100, y: 200}]
   * @param {Number} curIdx 当前的节点索引
   * @param {Number} nextIdx 下一个节点索引
   * @param {Number} during 动画时间
   * @param {Function} callback 动画结束的回调函数
   */
  var _next = function(dom, points, curIdx, nextIdx, during, callback){
    var curPointStr = '';
    for (var i = 0, len = curIdx; i <= len; i++) {
      curPointStr += points[i].x + ',' + points[i].y + ' ';
    }
    _go(curPointStr, dom, points, curIdx, nextIdx, during, callback);
  };
  /**
   * 动画显示上一个节点
   *
   * @method _prev
   * @private
   * @param {HtmlElement} dom
   * @param {Array} points 节点动画配置，形如[{x: 0, y: 100}, {x: 100, y: 200}]
   * @param {Number} curIdx 当前的节点索引
   * @param {Number} nextIdx 下一个节点索引
   * @param {Number} during 动画时间
   * @param {Function} callback 动画结束的回调函数
   */
  var _prev = function(dom, points, curIdx, prevIdx, during, callback){
    var curPointStr = '';
    for (var i = 0, len = prevIdx; i <= len; i++) {
      curPointStr += points[i].x + ',' + points[i].y + ' ';
    }
    _go(curPointStr, dom, points, curIdx, prevIdx, during, callback);
  };

  /**
   * 设置vml中polyline的points属性动画
   * 
   * @method points
   * @param {HtmlElement} dom
   * @param {Array} points points属性值，形如[{x:0, y:0}, {x: 100, y: 100}, {x:150, y:200}]
   * @param {Object} 方法集合，内含next(during, callback)和prev(during, callback)方法
   */
  exports.points = function(dom, points){
    if (typeof points === 'string'){
      var pointArray = points.split(' ');
      points = [];
      for (var i = 0, len = pointArray.length; i < len; i++) {
        var xy = pointArray[i].split(',');
        points.push({
          x: parseFloat(xy[0]),
          y: parseFloat(xy[1])
        });
      }
    }
    var conf = {
      dom: dom,
      points: points,
      curIdx: 0 
    };
    /**
     * 动画显示下一个节点
     *
     * @method next
     * @param {Number} during 动画时间
     * @param {Function} callback 回调函数
     */
    conf.next = function(during, callback){
      if (this.curIdx + 1 < this.points.length){
        _next(this.dom, this.points, this.curIdx, ++this.curIdx, during, callback);
      }
      else if (callback){
        callback();
      }
    }.bind(conf);
    /**
     * 动画显示上一个节点
     *
     * @method prev
     * @param {Number} during 动画时间
     * @param {Function} callback 回调函数
     */
    conf.prev = function(during, callback){
      if (this.curIdx - 1 >= 0){
        _prev(this.dom, this.points, this.curIdx, --this.curIdx, during, callback);
      }
      else if (callback){
        callback();
      }
    }.bind(conf);

    return conf;
  }; 
});
