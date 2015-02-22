// 圆弧
typeof (lpp) == 'undefined' && eval('lpp={};');
typeof (lpp.vml) == 'undefined' && eval('lpp.vml={};');
(function (ns, $) {
    var _vhtml = '<v:arc id="${id|def(isNull)}" name="${name|def(isNull)}" startAngle="${startAngle|def(isNull, 0)}" endAngle="${endAngle|def(isNull, 0)}" filled="${fillColor|if(isNull, F, T)}" fillColor="${fillColor|def(isNull)}" strokeColor="${strokeColor|def(isNull, #000000)}" style="${style|def(isNull)}"></v:arc>';

    ns.Arc = function (conf) {
        var self = this;
        var _conf = $.extend({}, conf);
        self.$ = $(lpp.compile(_vhtml, _conf));

        return self;
    };
})(lpp.vml, jQuery);