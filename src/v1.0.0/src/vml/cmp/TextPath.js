﻿// 二级标记:文本路径
typeof (lpp) == 'undefined' && eval('lpp={};');
typeof (lpp.vml) == 'undefined' && eval('lpp.vml={};');
(function (ns, $) {
    var _vhtml = '<v:textBox id="${id|def(isNull)}" name="${name|def(isNull)}" style="${style|def(isNull)}" inset="${inset|def(isNull)}">${text|def(isNull)}</v:textBox>';

    ns.TextPath = function (conf) {
        var self = this;
        var _conf = $.extend({}, conf);
        self.$ = $(lpp.compile(_vhtml, _conf));

        return self;
    };
})(lpp.vml, jQuery);