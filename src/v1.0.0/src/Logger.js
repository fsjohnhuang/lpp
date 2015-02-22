define(function(require, exports, module){
  /* 
   * 日志对象
   */
  module.exports = (function(){
    return typeof logger !== 'undefined' && logger || {
      trace: function(){},
      debug: function(){},
      info: function(){},
      error: function(){},
      fatal: function(){}
    };    
  })();

  /*
   * 获取记录入参信息的日志格式
   */
  exports.fmtArgsLog = function(funcName, key, val){
    var seperator = ';', fmtStr = '方法名:' + funcName, argsLen = arguments.length;
    if (argsLen <= 1) return fmtStr;

    var argArray = Array.prototype.slice.call(arguments, 1);
    var len = argsLen - 1;
    for (var i = 0; i < len; i++) {
      if (i % 2){
        fmtStr += ':' + val;
      }
      else{
        fmtStr += separator + '参数' + argArray[i];
      }
    }
    if (len !== 0 && len % 2){
      fmtStr += ':undefined';
    }
    return fmtStr;
  };
});
