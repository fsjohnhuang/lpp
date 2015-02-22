/**
 * @module lpp
 * @submodule movie
 */
define(function(require, exports, module){
  var $ = require('$');
  var handlebars = require('handlebars');
  require('../HandlebarsRegisterHelper');

  /**
   * HTML模板 
   *
   * @attribute HTML
   * @type String
   * @readOnly
   */ 
  var HTML = '<div data-type="Spirit" '
    + 'title="{{title}}" style="{{style}}position: absolute; width: {{setCssNum width}};'
    + ' height: {{setCssNum height}}; top: {{setCssNum top}};{{setLeftorRight left right}}{{setBg bg}}">'
      + '{{{createImg img}}}'
      + '{{{html}}}'
    + '</div>';

  /**
   * 精灵类
   *
   * @class Spirit
   * @constructor
   */
  var Spirit = function (conf) {
    var spirit = $(handlebars.compile(HTML)(conf));
    conf.on && spirit.on(conf.on);

    this.$ = spirit;
  };

  module.exports = Spirit;
});
