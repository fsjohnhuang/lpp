define(function(require, exports, module){
  var lpp_Str = {};
  module.exports = lpp_Str;

  lpp_Str.toUpperCase = function (orig, idx) {
    if (idx < 0 || idx >= orig.length) return orig;

    var _origArray = orig.split('');
    _origArray[idx] = _origArray[idx].toUpperCase();

    return _origArray.join('');
  };

  lpp_Str.trim = function(str, trim){
    if (trim){
      if ('[]{}$^\\. * ?( )'.indexOf(trim) >= 0){
        trim = '\\' + trim;
      }
    }
    else{
      trim = '\\s';
    }

    var match = new RegExp('^' + trim + '*(.*?)' + trim + '*$').exec(str);
    return match[1];
  };
});
