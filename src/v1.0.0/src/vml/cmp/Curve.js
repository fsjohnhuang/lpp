// 曲线
typeof (lpp) == 'undefined' && eval('lpp={};');
typeof (lpp.vml) == 'undefined' && eval('lpp.vml={};');
(function (ns, $) {
    var _vhtml = '<v:curve id="${id|def(isNull)}" name="${name|def(isNull)}" from="${from|def(isNull, throwEx <- pls set from)}" to="${to|def(isNull, throwEx <- pls set to)}" '
        + ' filled="${fillColor|if(isNull, F, T)}" fillColor="${fillColor|def(isNull)}" strokeColor="${strokeColor|def(isNull, #000000)}" style="${style|def(isNull)}" '
        + ' control1="${ctrl1|def(isNull)}" control2="${ctrl2|def(isNull)}" '
        + '></v:curve>';

    ns.Curve = function (conf) {
        var self = this;
        var _conf = $.extend({}, conf);
        self.$ = $(lpp.compile(_vhtml, _conf));

        return self;
    };
})(lpp.vml, jQuery);