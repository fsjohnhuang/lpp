/*
 * @param config{Object}
 *          itemId{String} ddl的HTML元素ID
 *          selectedTxt{String} ddl的默认选中项显示文本
 *          selectedVal{String} ddl的默认选中项值
 *          afterRollback{Function} 回滚后触发
 *              @param  selectedTxt{String} 选中项显示文本
 *                      selectedVal{String} 选中项值
 *          option_afterClick{Function} 选中某项后触发的回调函数
 *              @param  selectedTxt{String} 选中项显示文本
 *                      selectedVal{String} 选中项值
 *          afterReset{Function} 重置下拉列表后触发的回调函数
 *              @param  selectedTxt{String} 选中项显示文本
 *                      selectedVal{String} 选中项值
 *          afterEmpty{Function} 清空下拉列表后触发的回调函数
 * @return {Object}
 *          ddlEl{DivHTMLElement} ddl的HTML元素对象
 *          selectedTxt{String} ddl的选中项显示文本
 *          selectedVal{String} ddl的选中项值
 *          bind{Function} 数据绑定操作
 *              @param  jsonData{Array[{Object}]} 数据
 *                      txtField{String} 数据中显示文本的键
 *                      valField{String} 数据中值的键
 *          reset{Function} 重置下拉列表
 *          empty{Function} 清空下拉列表
 *          select{Function} 选中某一项，会触发option_afterClick回调函数
 *              @param  selectedTxt{String} 选中项显示文本
 *                      selectedVal{String} 选中项值
 *                      isBeHistory{Boolean} 是否成为历史记录
 *                      isFireEvent{Boolean} 是否触发option_afterClick回调函数
 *          history{Array[{Object}]} 存储选中操作历史
 *              {Object}成员：  id{String} 数据缓存区中数据集ID
 *                              selectedTxt{String}
 *                              selectedVal{String}
 *          dataBuffer{Object} 数据缓存区
 *              成员：  id{String}
 *                      [text{String},value{String}]
 *          curDataId{String} 当前数据集ID
 */
function lppDDL(config){
    var itemId = config.itemId || ["ddl", +(new Date())].join("_"),
    selectedTxt = config.selectedTxt || "请选择",
    selectedVal = config.selectedVal || "-1",
    _option_afterClick = config.option_afterClick,
    _afterReset = config.afterReset,
    _afterEmpty = config.afterEmpty,
    _isSecondConfirm = (config.isSecondConfirm ? true : false),
    _afterRollback = config.afterRollback,
    seletedTxtId = [itemId, "txt"].join("_"),
    optionsId = [itemId, "options"].join("_");
    
    var _returnObj = {}; // 返回的结果实体
    
    // 构建HTML结构
    var _ddl,_ddl_display,_ddl_selectedTxt,_ddl_arrow,_ddl_options;
    var _clearboth = document.createElement("DIV");
    lpp.addClass(_clearboth, "clearboth")
    
    _ddl_display = document.createElement("DIV");
    lpp.addClass(_ddl_display, "ddl_display");
    
    _ddl_options = document.createElement("UL");
    _ddl_options.setAttribute("id", optionsId);
    
    _ddl_arrow = document.createElement("A");
    lpp.addClass(_ddl_arrow, "ddl_arrow");
    _ddl_arrow.setAttribute("href", "javascript:void(0);");
    lpp.on(_ddl_arrow, "click", (function(ddl_options, ddl_display){
        var _ddl_options = ddl_options,_ddl_display = ddl_display;
        
        return function(){
            var e = event || arguments[0];
            var eTarget = lpp.getEventTarget(e);
            if (lpp.hasClass(eTarget, "ddl_arrow_expand")){
                lpp.removeClass(eTarget, "ddl_arrow_expand");
                lpp.hide({
                    el: _ddl_options,
                    time: 100,
                    afterHide: lpp.createDelegate(function(){
                        lpp.css(this, "borderBottomWidth", "0");
                    }, _ddl_display)
                });
            }
            else{
                if (_ddl_options.childNodes.length === 0) return;
                lpp.addClass(eTarget, "ddl_arrow_expand");
                lpp.show({
                    el: _ddl_options,
                    time: 100,
                    beforeShow: lpp.createDelegate(function(){
                        lpp.css(this, "borderBottomWidth", "1px");
                    }, _ddl_display)
                });
            }
        };
    })(_ddl_options, _ddl_display));
    
    _ddl_selectedTxt = document.createElement("DIV");
    lpp.addClass(_ddl_selectedTxt, "ddl_selectedTxt");
    _ddl_selectedTxt.setAttribute("id", seletedTxtId);
    _ddl_selectedTxt.innerText = selectedTxt;
    lpp.on(_ddl_selectedTxt, "click", (function(ddl_options, ddl_display,ddl_arrow){
        var _ddl_options = ddl_options,_ddl_display = ddl_display;
        
        return function(){
            if (lpp.hasClass(ddl_arrow, "ddl_arrow_expand")){
                lpp.removeClass(ddl_arrow, "ddl_arrow_expand");
                lpp.hide({
                    el: _ddl_options,
                    time: 100,
                    afterHide: lpp.createDelegate(function(){
                        lpp.css(this, "borderBottomWidth", "0");
                    }, _ddl_display)
                });
            }
            else{
                if (_ddl_options.childNodes.length === 0) return;
                lpp.addClass(ddl_arrow, "ddl_arrow_expand");
                lpp.show({
                    el: _ddl_options,
                    time: 100,
                    beforeShow: lpp.createDelegate(function(){
                        lpp.css(this, "borderBottomWidth", "1px");
                    }, _ddl_display)
                });
            }
        };
    })(_ddl_options, _ddl_display, _ddl_arrow)); 
    
    _ddl = document.createElement("DIV");
    lpp.addClass(_ddl, "dropDownList");
    _ddl.setAttribute("id", itemId);
    lpp.on(_ddl, "leave", (function(ddl_options, ddl_display,ddl_arrow){
        var _ddl_options = ddl_options,_ddl_display = ddl_display;
        
        return function(){
            if (lpp.hasClass(ddl_arrow, "ddl_arrow_expand")){
                lpp.removeClass(ddl_arrow, "ddl_arrow_expand");
                lpp.hide({
                    el: _ddl_options,
                    time: 100,
                    afterHide: lpp.createDelegate(function(){
                        lpp.css(this, "borderBottomWidth", "0");
                    }, _ddl_display)
                });
            }
        };
    })(_ddl_options, _ddl_display, _ddl_arrow));
    
    _ddl_display.appendChild(_ddl_selectedTxt);
    _ddl_display.appendChild(_ddl_arrow);
    _ddl_display.appendChild(_clearboth);
    
    _ddl.appendChild(_ddl_display);
    _ddl.appendChild(_ddl_options);
    
    // 构造返回结果
    _returnObj.curDataId = "";
    _returnObj.dataBuffer = {};
    _returnObj.history = [];
    _returnObj.ddlEl = _ddl;
    _returnObj.selectedTxt = selectedTxt;
    _returnObj.selectedVal = selectedVal;
    _returnObj.reset = (function(){
        return function(){
            var _self = this;
         
            _self["history"].push({dataId: _self["curDataId"], text: _self.selectedTxt, value: _self.selectedVal});
            
            // 初始化选择栏
            _ddl_selectedTxt.innerHTML = selectedTxt;
            _self.selectedTxt = selectedTxt;
            _self.selectedVal = selectedVal;
            
            var _options = _ddl_options.childNodes;
            for (var i = _options.length - 1; i >= 0; --i){
                lpp.removeClass(_options[i], "selected");
            }
            
            if (_afterReset){
                _afterReset(_self.selectedTxt, _self.selectedVal);
            }
        };
    })();
    
    _returnObj.empty = (function(){
        return function(){
            var _self = this;
            
            _self["history"].push({dataId: _self["curDataId"], text: _self.selectedTxt, value: _self.selectedVal});
            
            // 初始化选择栏
            _ddl_selectedTxt.innerHTML = selectedTxt;
            _self.selectedTxt = selectedTxt;
            _self.selectedVal = selectedVal;
            
            _ddl_options.innerHTML = "";
            
            if (_afterEmpty){
                setTimeout(_afterEmpty,0);
            }
        };
    })();
    
    _returnObj.bind = (function(){
        return function(config){
            var dataJson = (config ? config.dataJson || null : null),
            _txtField = (config ? config.txtField || "text" : "text"),
            _valField = (config ? config.valField || "value" : "value"),
            _dataId = (config ? config.dataId || (+(new Date())).toString() : (+(new Date())).toString());
            var _self = this;
            
            var dataType = lpp.getType(dataJson);
            if (dataType !== "function"){
                this.empty();
                
                return false;
            }
            
            if (_self["curDataId"] !== ""){
                _self["history"].push({dataId: _self["curDataId"], text: _self.selectedTxt, value: _self.selectedVal});
            }
            
            
            if (_self.dataBuffer.hasOwnProperty(_dataId)){
                dataJson = _self.dataBuffer[_dataId];
            }
            else{
                dataJson = dataJson();
                if (lpp.getType(dataJson) !== "array" || (lpp.getType(dataJson) === "array" && dataJson.length === 0)){
                    this.empty();
                    
                    return false;
                }
                _self.dataBuffer[_dataId] = dataJson;
            }
            _self.curDataId = _dataId;
            
            
            // 初始化选择栏
            _ddl_selectedTxt.innerHTML = selectedTxt;
            _self.selectedTxt = selectedTxt;
            _self.selectedVal = selectedVal;
            
            var _txt,_val,_option;
            _ddl_options.innerHTML = "";
            for(var i = 0; i < dataJson.length; ++i){
                _txt = dataJson[i][_txtField];
                _val = dataJson[i][_valField];
                _option = document.createElement("LI");
                _option.setAttribute("val", _val);
                _option.innerText = _txt;
                lpp.on(_option, "mouseover", function(){
                    var e = event || arguments[0];
                    
                    lpp.addClass(lpp.getEventTarget(e), "hover");;
                });
                lpp.on(_option, "mouseout", function(){
                    var e = event || arguments[0];
                    lpp.removeClass(lpp.getEventTarget(e), "hover");
                });
                lpp.on(_option, "click", (function(ddl_display,ddl_selectedTxt, ddl_options, ddl_arrow, self, option_afterClick, isSecondConfirm){
                    var _ddl_display = ddl_display,
                    _ddl_selectedTxt = ddl_selectedTxt,
                    _ddl_options = ddl_options,
                    _ddl_arrow = ddl_arrow,
                    _option_afterClick = option_afterClick,
                    _isSecondConfirm = isSecondConfirm;
                    var _self = self;
                    
                    return function(){
                        var e = event || arguments[0];
                        var eTarget = lpp.getEventTarget(e);
                        
                        // 保存历史值
                        _self["history"].push({dataId: _self["curDataId"], text: _self.selectedTxt, value: _self.selectedVal});
                        
                        _self.selectedTxt = eTarget.innerHTML;
                        _self.selectedVal = eTarget.getAttribute("val");
                        
                        _ddl_selectedTxt.innerHTML = _self.selectedTxt;
                        lpp.removeClass(_ddl_arrow, "ddl_arrow_expand");
                        _ddl_options.style.display = "none";
                        _ddl_display.style.borderBottomWidth = "0";
                        
                        var _options = _ddl_options.childNodes;
                        for (var i = _options.length - 1; i >= 0; --i){
                            lpp.removeClass(_options[i], "selected");
                        }
                        lpp.addClass(eTarget, "selected");
                        
                        if (_option_afterClick){
                            _option_afterClick(_self.selectedTxt, _self.selectedVal);
                        }
                    };
                })(_ddl_display, _ddl_selectedTxt, _ddl_options, _ddl_arrow, _self, _option_afterClick, _isSecondConfirm));
                
                _ddl_options.appendChild(_option);
            }
            
            return true;
        };
    })();
    
    _returnObj.select = (function(){
        return function(selectTxt, selectVal, isBeHistory, isFireEvent){
            var _selectTxt,_selectVal;
            if (typeof arguments[0] === "string"){
                _selectTxt = arguments[0];
                _selectVal = arguments[1];
            }
            else if (lpp.getType(arguments[0]) === "object"){
                _selectTxt = arguments[0]["text"];
                _selectVal = arguments[0]["value"];
            }
            else{
                return false;
            }
            
            if (isBeHistory){ 
                this["history"].push({dataId: this["curDataId"], text: this.selectedTxt, value: this.selectedVal});
            }
            
            this.selectedTxt = _selectTxt;
            this.selectedVal = _selectVal;
            _ddl_selectedTxt.innerHTML = this.selectedTxt;
            lpp.removeClass(_ddl_arrow, "ddl_arrow_expand");
            _ddl_options.style.display = "none";
            _ddl_display.style.borderBottomWidth = "0";
                        
            var _options = _ddl_options.childNodes;
            var eTarget = null;
            for (var i = _options.length - 1; i >= 0; --i){
                lpp.removeClass(_options[i], "selected");
                if (_options[i].getAttribute("val") === this.selectedVal && _options[i].innerText === this.selectedTxt){
                    eTarget = _options[i];
                }
            }
            lpp.addClass(eTarget, "selected");
                        
            if (_option_afterClick && isFireEvent){
                _option_afterClick(this.selectedTxt, this.selectedVal);
            }
            
            return true;
        };
    })();
    
    _returnObj.rollback = (function(){
        return function(index){
            var _index = index || 0;
            if (lpp.getType(this.history) !== "array" || this.history.length === 0 || _index >= this.history.length) return false;
            
            var txtVal = this.history[_index];
            
            this.selectedTxt = txtVal.text;
            this.selectedVal = txtVal.value;
            _ddl_selectedTxt.innerHTML = this.selectedTxt;
            lpp.removeClass(_ddl_arrow, "ddl_arrow_expand");
            _ddl_options.style.display = "none";
            _ddl_display.style.borderBottomWidth = "0";
            var _options = _ddl_options.childNodes;
            var eTarget = null;
            for (var i = _options.length - 1; i >= 0; --i){
                lpp.removeClass(_options[i], "selected");
                if (_options[i].innerText === this.selectedTxt && _options[i].getAttribute("val") === this.selectedVal){
                    eTarget = _options[i];
                }
            }
            lpp.addClass(eTarget, "selected");
            
            this.history.length = index + 1;
            
            if (_afterRollback){
                _afterRollback(this.selectedTxt, this.selectedVal);
            }
                
            return true;
        };
    })();
    
    return _returnObj;
}