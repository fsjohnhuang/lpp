define(function(require, exports, module){
  var $ = require('$');
  var handlebars = require('handlebars');
  require('../HandlebarsRegisterHelper');

  var _html = '<div style="position: absolute; left: {{setLeftorRight left right}}; top: {{setCssNum top}};'
    + 'border:solid 1px #888;width: {{setCssNum width}};height:{{setCssNum height}};"></div>';

  var Shadow = function (conf) {
    conf = conf || {};
    this.$ = $(handlebars.compile(_html)(conf));
    _conf = {
      old: {
             left: null,
             top: null,
             height: null,
             width: null
           }
    };
    $.extend(this, _conf);

    return this;
  };

  Shadow.prototype.init = function (conf) {
    var _conf = $.extend({}, conf);
    // save old value
    this.old = {
      top: this.top,
      left: this.left,
      height: this.height,
      width: this.width
    };
    if (typeof (_conf.top) != 'undefined' && _conf.top != null)
    {
      this.top = _conf.top;
    }
    if (typeof (_conf.left) != 'undefined' && _conf.left != null)
    {
      this.left = _conf.left;
    }
    if (typeof (_conf.height) != 'undefined' && _conf.height != null)
    {
      this.height = _conf.height;
    }
    if (typeof (_conf.width) != 'undefined' && _conf.width != null)
    {
      this.width = _conf.width;
    }

    this.$.css(_conf);
  }

  Shadow.prototype.attach = function (parent) {
    !parent.css && $(parent).append(this.$) || parent.append(this.$);
  };

  Shadow.prototype.fadeIn = function (during, callback) {
    during = during || 1;
    this.$.fadeIn(during, callback);
  };
  Shadow.prototype.fadeOut = function (during, callback) {
    during = during || 1;
    this.$.fadeOut(during, callback);
  }
  Shadow.prototype.animate = function (conf, during, callback) {
    var _conf = $.extend({}, conf);
    during = during || 1;
    // save old value
    this.old = {
      top: this.top,
      left: this.left,
      height: this.height,
      width: this.width
    };
    if (typeof (_conf.top) != 'undefined' && _conf.top != null)
    {
      this.top = _conf.top;
    }
    if (typeof (_conf.left) != 'undefined' && _conf.left != null)
    {
      this.left = _conf.left;
    }
    if (typeof (_conf.height) != 'undefined' && _conf.height != null)
    {
      this.height = _conf.height;
    }
    if (typeof (_conf.width) != 'undefined' && _conf.width != null)
    {
      this.width = _conf.width;
    }

    this.$.animate(_conf, during, callback);
  }

  module.exports = Shadow;
});
