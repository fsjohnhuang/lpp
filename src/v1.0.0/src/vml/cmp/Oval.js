// 圆形
typeof (lpp) == 'undefined' && eval('lpp={};');
typeof (lpp.vml) == 'undefined' && eval('lpp.vml={};');
(function (ns, $) {
    var _vhtml = '<v:oval id="${id|def(isNull)}" name="${name|def(isNull)}" filled="${fillColor|if(isNull, F, T)}" fillColor="${fillColor|def(isNull)}" '
        + ' stroked="${strokeWeight|if(isNull, F, T)}" strokeColor="${strokeColor|def(isNull, #000000)}" style="${style|def(isNull)}">'
        + '${shadow|def(isNull)}${inner|def(isNull)}'
        + '</v:oval>';
    var _vshadow = '<v:shadow id="${id|def(isNull)}" name="${name|def(isNull)}" on="T" type="${type|def(isNull, single)}" color="${color|def(isNull, #b3b3b3)}" offset="${offset}"/>';

    ns.Oval = function (conf) {
        var self = this;
        var _conf = $.extend({}, conf);
        if (_conf.shadow) {
            _conf.shadow.offset = _conf.shadow.offset || '5px, 5px';
            _conf.shadow = lpp.compile(_vshadow, _conf.shadow);
        }
        self.$ = $(lpp.compile(_vhtml, _conf));

        return self;
    };
})(lpp.vml, jQuery);