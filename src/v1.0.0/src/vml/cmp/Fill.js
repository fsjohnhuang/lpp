// 二级标记:填充
typeof (lpp) == 'undefined' && eval('lpp={};');
typeof (lpp.vml) == 'undefined' && eval('lpp.vml={};');
(function (ns, $) {
    var _vhtml = '<v:fill id="${id|def(isNull)}" name="${name|def(isNull)}" angle="${angle|def(isNull, 0)}" type="${type|def(isNull, gradient)}" color2="${color2|def(isNull, #b3b3b3)}"/>';

    ns.Shadow = function (conf) {
        var self = this;
        var _conf = $.extend({}, conf);
        self.$ = $(lpp.compile(_vhtml, _conf));

        return self;
    };
})(lpp.vml, jQuery);