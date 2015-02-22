/*
 *  @param config{Object} 配置参数体
 *      itemId{String} 组件ID
 *      useBuffer{Boolean} true启用缓存，false禁用缓存
 *      pageSize{Integer} 每页条目数,默认为48
 *      style{string} 外容器的style
 *      item_click{Function} 点击数据记录后触发
 *          @param  text{String}
 *                  value{String}
 *  @return {Object}
 *      el{DivHTMLElement} 滑动面板Dom对象
 *      bind{Function} 数据绑定函数
 *          @reader{Function} 数据源读取函数
 *              @return {Array[{text{String}, value{String}}]}
 *          @dataId{String} 缓存区数据集Id
 *      curPageIndex{Integer} 当前页码，从0开始
 *      pageSize{Integer} 每页条目数,默认为48
 *      totalPage{Integer} 总页数
 *      totalRec{Integer}  记录总数
 *      buffer{Object{dataId{String}:{Array[{text{String}, value{String}]}}} 缓存区，仅当useBuffer为true时存在
 *      curDataId{String} 当前数据集Id，仅当userBuffer为true时存在
 */
function LPPSlidePanel(config){
    var _itemId = lpp.getConfigVal(config, "itemId", ["LppSlidePanel", +new Date()].join("_")),
    _lArrowId = [_itemId, "l"].join("_"),
    _rArrowId = [_itemId, "r"].join("_"),
    _maskId = [_itemId, "mask"].join("_"),
    _contentId = [_itemId, "content"].join("_"),
    _useBuffer = lpp.getConfigVal(config, "userBuffer", false, "boolean"),
    _pageSize = lpp.getConfigVal(config, "pageSize", 48, "number")
    _item_click = lpp.getConfigVal(config, "item_click", function(){}, "function"),
    _style = lpp.getConfigVal(config, "style", "", "string");
    
    // 构造HTML结构
    var _slidePanel,_lArrow,_mask,_content,_rArrow;
    
    _slidePanel = lpp.createEl({
        className: "slidePanel",
        id: _itemId,
        attrs: {style: _style}
    });
    _lArrow = lpp.createEl({
        className: ["hide", "l", "arrow"],
        id: _lArrowId
    });
    _mask = lpp.createEl({
        className: "mask",
        id: _maskId
    });
    _content = lpp.createEl({
        className: "content",
        id: _contentId
    });
    _rArrow = lpp.createEl({
        className: ["hide", "r", "arrow"],
        id: _rArrowId
    });
    
    _mask.appendChild(_content);
    _slidePanel.appendChild(_lArrow);
    _slidePanel.appendChild(_mask);
    _slidePanel.appendChild(_rArrow);
    
    
    // 滑动面板实例对象
    var _instance = {};
    
    var _fns = (function(){
        var _config = {pageSize: _pageSize,
            useBuffer: _useBuffer,
            lArrow: _lArrow,
            rArrow: _rArrow,
            content: _content,
            mask: _mask,
            item_click: _item_click};
                
        var fns = {};
        fns.bind = function(reader, dataId){
            var _data = null;
            if (_config._userBuffer){
                if (!this.hasOwnProperty("buffer")){
                    this.buffer = {};
                }
                if (this.buffer.hasOwnProperty(dataId)){
                    _data = this.buffer[dataId];
                }
                else{
                    _data = reader();
                    this.buffer[dataId] = _data;
                }
            }
            else{
                _data = reader();
            }
            
            this.totalPage = parseInt(_data.length / this.pageSize) + (_data.length % this.pageSize !== 0 ? 1 : 0);
            this.curPageIndex = 0;
            this.curDataId = dataId;
            this.totalRec = _data.length;
            lpp.css(_config.content, "width", (this.totalPage * 640) + "px");
            
            if (this.totalPage > 1){
                lpp.removeClass(_config.rArrow, "hide");
                lpp.on(_config.rArrow, "mouseover", function(){
                    var e = event || arguments[0];
                    var eTarget = lpp.getEventTarget(e);
                    
                    lpp.addClass(eTarget, "r");
                });
                
                lpp.on(_config.rArrow, "mouseout", function(){
                    var e = event || arguments[0];
                    var eTarget = lpp.getEventTarget(e);
                    
                    lpp.removeClass(eTarget, "r");
                });
                
                lpp.on(_config.rArrow, "click", lpp.createDelegate(function(content, el, fns){
                    var _curPageIndex = this.curPageIndex;
                    var _totalPage = this.totalPage;
                    var _nextPageIndex = _curPageIndex + 1;
                    
                    fns.goTo.call(this, _nextPageIndex, _config.content);
                }, _instance, _config.content, _config.rArrow, fns));
                
                lpp.on(_config.lArrow, "click", lpp.createDelegate(function(content, el, fns){
                    var _curPageIndex = this.curPageIndex;
                    var _totalPage = this.totalPage;
                    var _nextPageIndex = _curPageIndex - 1;
                    
                    fns.goTo.call(this, _nextPageIndex, _config.content);
                }, _instance, _config.content, _config.lArrow, fns));
                
                lpp.on(_config.lArrow, "mouseout", function(){
                    var e = event || arguments[0];
                    var eTarget = lpp.getEventTarget(e);
                    
                    lpp.removeClass(eTarget, "l");
                });
            }
            
            var unit = null;
            var keyword = null;
            for (var i = 0; i < _data.length; ++i){
                if (i % 48 === 0){
                    unit = lpp.createEl({
                        className: "unit"
                    });
                    _config.content.appendChild(unit);
                }
                
                keyword = lpp.createEl({
                    tagName: "A",
                    attrs: {
                        href: "javascript:void(0);"
                    },
                    html: _data[i].text
                });
                if (!lpp.isNothing(_config.item_click)){
                    lpp.on(keyword, "click", lpp.createCallback(_config.item_click, _data[i].text, _data[i].value));
                }
                unit.appendChild(keyword);
            }
        };
        
        fns.goTo = function(index, content){
            var _index = index || 0;
            var _time = 1000;
            var _shift = 630;
            if (_index === 0){
                _config.lArrow.onmouseover = function(){};
                lpp.addClass(_config.lArrow, "hide");
                _config.rArrow.onmouseover = function(){
                     var e = event || arguments[0];
                    var eTarget = lpp.getEventTarget(e);
                    
                    lpp.addClass(eTarget, "r");
                };
                lpp.removeClass(_config.rArrow, "hide");
                lpp.slide({
                    el: content,
                    time: _time,
                    x: "+=" + _shift,
                    pos: "relative",
                    beforeSlide: lpp.createCallback(function(lArrow, rArrow){
                        lpp.css(lArrow, "visibility", "hidden");
                        lpp.css(rArrow, "visibility", "hidden");
                    }, _config.lArrow, _config.rArrow),
                    afterSlide: lpp.createCallback(function(lArrow, rArrow){
                        lpp.css(rArrow, "visibility", "visible");
                    }, _config.lArrow, _config.rArrow)
                });
            }
            else if (_index === this.totalPage - 1){
                _config.rArrow.onmouseover = function(){};
                lpp.addClass(_config.rArrow, "hide");
                
                _config.lArrow.onmouseover = function(){
                    var e = event || arguments[0];
                    var eTarget = lpp.getEventTarget(e);
                    
                    lpp.addClass(eTarget, "l");
                };
                lpp.removeClass(_config.lArrow, "hide");
                lpp.slide({
                    el: content,
                    time: _time,
                    x: "-=" + _shift,
                    pos: "relative",
                    beforeSlide: lpp.createCallback(function(lArrow, rArrow){
                        lpp.css(lArrow, "visibility", "hidden");
                        lpp.css(rArrow, "visibility", "hidden");
                    }, _config.lArrow, _config.rArrow),
                    afterSlide: lpp.createCallback(function(lArrow, rArrow){
                        lpp.css(lArrow, "visibility", "visible");
                    }, _config.lArrow, _config.rArrow)
                });
            }
            else{
                _config.rArrow.onmouseover = function(){
                    var e = event || arguments[0];
                    var eTarget = lpp.getEventTarget(e);
                    
                    lpp.addClass(eTarget, "r");
                };
                _config.lArrow.onmouseover = function(){
                    var e = event || arguments[0];
                    var eTarget = lpp.getEventTarget(e);
                    
                    lpp.addClass(eTarget, "l");
                };
                lpp.removeClass(_config.lArrow, "hide");
                lpp.removeClass(_config.rArrow, "hide");
                lpp.slide({
                    el: content,
                    time: _time,
                    x: (this.curPageIndex > _index ? "+" : "-") + "=" + _shift,
                    pos: "relative",
                    beforeSlide: lpp.createCallback(function(lArrow, rArrow){
                        lpp.css(lArrow, "visibility", "hidden");
                        lpp.css(rArrow, "visibility", "hidden");
                    }, _config.lArrow, _config.rArrow),
                    afterSlide: lpp.createCallback(function(lArrow, rArrow){
                        lpp.css(lArrow, "visibility", "visible");
                        lpp.css(rArrow, "visibility", "visible");
                    }, _config.lArrow, _config.rArrow)
                });
            }
            
            this.curPageIndex = _index;
        };
        
        return fns;
    })();
    
    
    _instance.el = _slidePanel;
    _instance.pageSize = _pageSize;
    _instance.bind = _fns.bind;
    
    return _instance;
}
