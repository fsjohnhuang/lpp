// 集合容器
typeof (lpp) == 'undefined' && eval('lpp={};');
typeof (lpp.vml) == 'undefined' && eval('lpp.vml={};');
(function (ns, $) {
    var _vhtml = '<v:group id="${id|def(isNull)}" coordsize="${coordsize|def(isNull, throwEx <- pls set coordsize)}" name="${name|def(isNull)}" style="${style|def(isNull)}"></v:group>';

    ns.Group = function (conf) {
        var self = this;
        var _conf = $.extend({}, conf);
        self.$ = $(lpp.compile(_vhtml, _conf));

        return self;
    };
})(lpp.vml, jQuery);