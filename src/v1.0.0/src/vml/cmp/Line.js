// 直线
typeof (lpp) == 'undefined' && eval('lpp={};');
typeof (lpp.vml) == 'undefined' && eval('lpp.vml={};');
(function (ns, $) {
    var _vhtml = '<v:line id="${id|def(isNull)}" strokeColor="${strokeColor|def(isNull, #000)}" strokeWeight="${strokeWeight|def(isNull, 1)}px" from="${from}" to="${to}" style="${style}" />';

    ns.Line = function (conf) {
        var self = this;
        self.$ = $(lpp.compile(_vhtml, conf));
        self._anim = {
            setup: function (css, prop, val, during) {
                var rs = true, curVal = String(self.$[0].getAttribute(prop));
                switch (prop) {
                    case 'strokeWeight':
                        curVal = Number(curVal.replace('px', ''));
                        css[prop] = {
                            val: val,
                            curVal: curVal,
                            step: (val - curVal) / during
                        };
                        break;
                    case 'strokeColor':
                        var curRGB = lpp.Css.toRGB(curVal);
                        var targetRGB = lpp.Css.toRGB(val);

                        css[prop] = {
                            val: val,
                            curRGB: curRGB,
                            rStep: (targetRGB.red - curRGB.red) / during,
                            gStep: (targetRGB.green - curRGB.green) / during,
                            bStep: (targetRGB.blue - curRGB.blue) / during
                        };
                        break;
                    default:
                        rs = false;
                        break;
                }

                return rs;
            },
            run: function (css, prop, delay) {
                var rs = true;
                switch (prop) {
                    case 'strokeWeight':
                        css[prop].curVal += css[prop].step;
                        self.$[0].setAttribute(prop, css[prop].curVal + 'px');
                        break;
                    case 'strokeColor':
                        css[prop].curRGB.red = css[prop].curRGB.red + css[prop].rStep;
                        css[prop].curRGB.green = css[prop].curRGB.green + css[prop].gStep;
                        css[prop].curRGB.blue = css[prop].curRGB.blue + css[prop].bStep;

                        var _red = lpp.Css.rangeColor(css[prop].curRGB.red)
                            , _green = lpp.Css.rangeColor(css[prop].curRGB.green)
                            , _blue = lpp.Css.rangeColor(css[prop].curRGB.blue);
                        self.$[0].setAttribute(prop, lpp.Css.toColorHexStr(_red, _green, _blue));
                        break;
                    default:
                        rs = false;
                        break;
                }

                return rs;
            }
        };

        return this;
    };
})(lpp.vml, jQuery);