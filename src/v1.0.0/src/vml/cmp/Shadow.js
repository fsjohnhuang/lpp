// 二级标记:阴影
typeof (lpp) == 'undefined' && eval('lpp={};');
typeof (lpp.vml) == 'undefined' && eval('lpp.vml={};');
(function (ns, $) {
    var _vhtml = '<v:shadow id="${id|def(isNull)}" name="${name|def(isNull)}" on="T" type="${type|def(isNull, single)}" color="${color|def(isNull, #b3b3b3)}" offset="${offset}"/>';

    ns.Shadow = function (conf) {
        var self = this;
        var _conf = $.extend({}, conf);
        self.$ = $(lpp.compile(_vhtml, _conf));

        return self;
    };
})(lpp.vml, jQuery);