// 二级标记:边框
typeof (lpp) == 'undefined' && eval('lpp={};');
typeof (lpp.vml) == 'undefined' && eval('lpp.vml={};');
(function (ns, $) {
    var _vhtml = '<v:fill id="${id|def(isNull)}" name="${name|def(isNull)}" strokeColor="${strokeColor|def(isNull, #000000)}" strokeWeight="${strokeWeight|def(isNull, 1)}"/>';

    ns.Stroke = function (conf) {
        var self = this;
        var _conf = $.extend({}, conf);
        self.$ = $(lpp.compile(_vhtml, _conf));

        return self;
    };
})(lpp.vml, jQuery);