define(function(require, exports, module){
  var _utils = {};
  _utils.cls = require('../Cls');

  /**
   * 404错误
   * @class E404
   * @constructor
   */
  var E404 = function(){
    if (this === window){
      return new E404();
    }

    Error.call(this, 'Not Found');
    this.status = 404;
    this.name = 'NotFoundErr';
  };
  _utils.cls.inherit(E404, Error);

  module.exports = E404;
});
