define(function(require, exports, module){
  var handlebars = require('handlebars');
  require('../HandlebarsRegisterHelper');

  var _html = '<div data-type="Tips" style="{{style}}position: absolute; width: {{setCssNum width}}; height: {{setCssNum height}}; top: {{setCssNum top}};'
    + '{{setLeftorRight left right}}">'
      + '<img src="{{src}}" style="z-index: -1; position: absolute;width:100%;height:100%;" />'
      + '<div style="font-size: 12px; position: absolute; margin:0; padding: 7px; padding-left: {{paddingLeft}}px; width: 100%; height: 100%;">{{{html}}}</div>'
    +'</div>';
  
  exports.assembleHtml = function(conf){
    return handlebars.compile(_html)(conf);
  };
});
