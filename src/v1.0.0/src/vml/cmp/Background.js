// 背景
typeof (lpp) == 'undefined' && eval('lpp={};');
typeof (lpp.vml) == 'undefined' && eval('lpp.vml={};');
(function (ns, $) {
    var _vhtml = '<v:background id="${id|def(isNull)}" name="${name|def(isNull)}"  filled="${fillColor|if(isNull, F, T)}" fillColor="${fillColor|def(isNull)}" style="${style|def(isNull)}"></v:background>';

    ns.Background = function (conf) {
        var self = this;
        var _conf = $.extend({}, conf);
        self.$ = $(lpp.compile(_vhtml, _conf));

        return self;
    };
})(lpp.vml, jQuery);