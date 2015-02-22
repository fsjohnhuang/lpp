// 任意形状
typeof (lpp) == 'undefined' && eval('lpp={};');
typeof (lpp.vml) == 'undefined' && eval('lpp.vml={};');
(function (ns, $) {
    var _vhtml = '<v:shape id="${id|def(isNull)}" name="${name|def(isNull)}" filled="${fillColor|if(isNull, F, T)}" fillColor="${fillColor|def(isNull)}"'
        + ' strokeColor="${strokeColor|def(isNull, #000000)}" style="${style|def(isNull)}" path="${path|def(isNull, throwEx <- pls set path)}">'
        + '</v:shape>';

    ns.Shape = function (conf) {
        var self = this;
        var _conf = $.extend({}, conf);
        self.$ = $(lpp.compile(_vhtml, _conf));

        return self;
    };
})(lpp.vml, jQuery);