define(function(require, exports, module){
  var lpp_Array = require('lpp_Array');

  var lpp_Compile = {};
  module.exports = lpp_Compile;

  var _isNull = function (valA, valB) {
    var result = valA;
    if (typeof (valA) == 'undefined' || valA == null){
      if (typeof (valB) == 'undefined' || valB == null) {
        result = '';
      }
      else if (valB.indexOf('throwEx') >= 0) {
        var exMsgIdx = valB.indexOf('<-'), exMsg;
        if (exMsgIdx > 0) {
          exMsg = $.trim(valB.substring(exMsgIdx + 2));
        }
        throw new Error(exMsg);
      }
      else {
        result = valB;
      }
    }

    return result;
  };
  var _isNothing = function (valA, valB) {
    var result = valA;
    if (typeof (valA) == 'undefined' || valA == null || $.trim(valA) == '') {
      if (typeof (valB) == 'undefined' || valB == null) {
        result = '';
      }
      else if (valB.indexOf('throwEx') >= 0) {
        var exMsgIdx = valB.indexOf('<-'), exMsg;
        if (exMsgIdx > 0) {
          exMsg = $.trim(valB.substring(exMsgIdx + 2));
        }
        throw new Error(exMsg);
      }
      else {
        result = valB;
      }
    }

    return result;
  }

  var _compileFns = {
    'def': function (val, cond, defVal) {
      var result = val;
      switch (cond)
      {
        case 'isNull':
          result = _isNull(val, defVal);
          break;
        case 'isNothing':
          result = _isNothing(val, defVal);
          break;
        default:
          if (eval(cond))
          {
            result = defVal;
          }
          break;
      }

      return result;
    },
    'if': function (val, cond, pass, noPass) {
      var result;
      switch (cond)
      {
        case 'isNull':
          result = _isNull(val, pass);
          if (result == val) {
            result = noPass;
          }
          break;
        case 'isNothing':
          result = _isNothing(val, pass);
          if (result == val) {
            result = noPass;
          }
          break;
        default:
          if (eval(cond))
          {
            result = pass;
          }
          else {
            result = noPass;
          }
          break;
      }

      return result;
    },
    'some': function (val, cond, pass, noPass) {
      var _cond = cond.replace('[', '').replace(']', '').split(','), valid = false;
      for (var i = 0, len = _cond.length; i < len && !valid; i++) {
        valid = val == $.trim(_cond[i]);
      }

      return (valid ? pass : noPass);
    },
    'throwEx': function(val, cond, msg){
      var result = val;
      switch (cond)
      {
        case 'isNull':
          var result = val;
          if (typeof (result) == 'undefined' || result == null){
              throw new Error(msg);
          }
          break;
        default:
          if (eval(cond))
          {
            throw new Error(msg);
          }
          break;
      }

      return result;
    }
  };

  lpp_Compile.compile = function (origStr, params, fnMap) {
    if (arguments.length == 1) return origStr;

    var str = origStr, _params = [];
    var _findVar = new RegExp('\\$\\{\\s*(\\w+)\\s*\\|?.*?\\}', 'g');
    var _matchVar = _findVar.exec(origStr);
    while (_matchVar)
    {
      lpp_Array.distinctPush(_params, _matchVar[1]);
      _matchVar = _findVar.exec(origStr);
    }


    for (var i = 0, len = _params.length; i < len; ++i) {
      var prop = _params[i];
      var _withFnRegExp = new RegExp('\\$\\{' + prop + '\\s*\\|\\s*(\\w+)\\((.+?)\\)\\}', 'g')
        , _execResult = _withFnRegExp.exec(str);
      while (_execResult) {
        var _fnParams, _execResult0 = _execResult[0], _execResult1 = _execResult[1], _execResult2 = _execResult[2];
        _execResult = _withFnRegExp.exec(str);

        _fnParams = $.map(_execResult2.split(','), function (item, idx) {
          var _item = $.trim(item);
          if (_item.length > 1 && _item.indexOf('$') == 0 && typeof(params[_item.substring(1)]) != 'undefined')
        {
          _item = params[_item.substring(1)];
        }
        _item = _item.replace(/\B\$\B/g, (/\D+/.test(params[prop]) ? '"' + params[prop] + '"' : params[prop]));
        return _item;
        });
        var val;
        if (fnMap != null && fnMap[_execResult1]) {
          val = fnMap[_execResult1].apply(null, [params[prop]].concat(_fnParams));
        }
        else {
          val = _compileFns[_execResult1].apply(null, [params[prop]].concat(_fnParams));
        }
        str = str.replace(_execResult0, val);
      }

      str = str.replace(new RegExp('\\$\\{\\s*' + prop + '\\s*\\}', 'g'), params[prop]);
    }
    return str;
  };
});
