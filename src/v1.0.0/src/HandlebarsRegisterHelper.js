define(function(require, exports, module){
  "use strict";

  var handlebars = require('handlebars');

  var _setCssNum = function(val, defaultVal){
    defaultVal = typeof defaultVal !== 'object' && defaultVal || '0px';
    var ret = defaultVal, val = val && val.toString() || '';
    if (/^-?\d+(\.\d+)?$/.test(val)){
      ret = val  + 'px';
    }
    else if (/^-?\d+(\.\d+)?px$/.test(val)){
      ret = val;
    }
    else if (/^\d+(\.\d+)?%$/.test(val)){
      ret = val;
    }

    return ret;
  };

  handlebars.registerHelper('setCssNum', _setCssNum);

  handlebars.registerHelper('setBool', function(val, defaultVal){
    if (defaultVal === null || typeof defaultVal === 'undefined'){
      defaultVal = true;
    }
    var ret = defaultVal;
    if (typeof val !== 'undefined'){
      ret = !!val;
    }

    return ret.toString();
  });

  handlebars.registerHelper('setStr', function(str, defaultStr){
    defaultStr = defaultStr || '';
    var ret = defaultStr;
    if (str !== null && typeof str !== 'undefined'){
      ret = str;
    }
    
    return ret;
  });

  handlebars.registerHelper('setRange', function(val, range, defaultVal){
    var ret = defaultVal;
    if (val !== null && typeof val !== 'undefined' && range.indexOf(val) >= 0){
      ret = val;
    }

    return ret;
  });

  // 设置left和right属性
  handlebars.registerHelper('setLeftorRight', function(left, right){
    var lType = typeof left, rType = typeof right;
    if ('undefined' !== lType && null !== left){
      return 'left:' + _setCssNum(left) + ';';
    }
    else if('undefined' !== rType && null !== right){
      return 'right:' + _setCssNum(right) + ';';
    }
    else{
      return '';
    }
  });

  // 设置backgroud属性
  handlebars.registerHelper('setBg', function(bg){
    var type = typeof(bg), rs;
    if (type === 'undefined' || null === bg){
      rs = '';
    }
    else if (type === 'string'){
      if (bg.indexOf('#') === 0){
        rs = ['background-color:', bg, ';'];
      }
      else{
        rs = ['background:url(', bg, ') no-repeat 50% 50%'];
      }
      rs = rs.join('');
    }
    else{
      rs = handlebars.compile('background:url({{url}}) {{repeat}} {{x}} {{y}};')(bg);
    }

    return rs;
  });

  // 生成Img tag
  handlebars.registerHelper('createImg', function(img){
    if (typeof img === 'undefined' || img === null) return '';

    return handlebars.compile('<img src="{{src}}" alt="{{alt}}" title="{{title}}" style="position: absolute;{{style}}" />')(img);
  });

  // 设置默认值
  handlebars.registerHelper('setDefault', function(val, defaultVal){
    if (typeof val === 'undefined' || val === null) return defaultVal;
    return val;
  });
});
