// 二级标记:路径
typeof (lpp) == 'undefined' && eval('lpp={};');
typeof (lpp.vml) == 'undefined' && eval('lpp.vml={};');
(function (ns, $) {
    var _vhtml = '<v:path id="${id|def(isNull)}" name="${name|def(isNull)}" v="${v|def(isNull, throwEx <- pls set v)}"/>';

    ns.Stroke = function (conf) {
        var self = this;
        var _conf = $.extend({}, conf);
        self.$ = $(lpp.compile(_vhtml, _conf));

        return self;
    };
})(lpp.vml, jQuery);