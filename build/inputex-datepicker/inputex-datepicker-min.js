YUI.add("inputex-datepicker",function(e,t){var n=e.inputEx,r=e.Lang;n.DatePickerField=function(e){n.DatePickerField.superclass.constructor.call(this,e)},e.extend(n.DatePickerField,n.DateField,{setOptions:function(t){n.DatePickerField.superclass.setOptions.call(this,t),this.messages=e.mix(this.messages,e.Intl.get("inputex-datepicker")),this.options.className=t.className?t.className:"inputEx-Field inputEx-DateField inputEx-PickerField inputEx-DatePickerField",this.options.readonly=r.isUndefined(t.readonly)?!0:t.readonly,this.options.calendar=t.calendar||this.messages.defaultCalendarOpts,this.options.zIndex=t.zIndex||4},renderOverlay:function(){this.oOverlay=new e.Overlay({visible:!1,zIndex:this.options.zIndex}),this.oOverlay.render(this.fieldContainer),this.oOverlay.on("visibleChange",function(t){t.newVal?(this.beforeShowOverlay(),this.calendar.show(),this.oOverlay.set("align",{node:this.buttonWrapper,points:[e.WidgetPositionAlign.TL,e.WidgetPositionAlign.BL]}),this.outsideHandler=this.oOverlay.get("boundingBox").on("mousedownoutside",function(e){e.target!==this.button&&this.oOverlay.hide()},this)):(this.calendar.hide(),this.outsideHandler&&this.outsideHandler.detach())},this)},_toggleOverlay:function(){this.oOverlay||(this.renderOverlay(),this.renderCalendar());var e=this.oOverlay.get("visible")?"hide":"show";this.oOverlay[e]()},renderComponent:function(){n.DatePickerField.superclass.renderComponent.call(this),this.buttonWrapper=e.Node.create('<span class="inputEx-DatePicker-ButtonWrapper"><button type="button" class="inputEx-DatePicker-Button"></button></span>'),this.buttonWrapper.appendTo(this.wrapEl),this.button=this.buttonWrapper.one(".inputEx-DatePicker-Button"),this.button.on("click",this._toggleOverlay,this),this.options.readonly&&e.one(this.el).on("click",this._toggleOverlay,this)},renderCalendar:function(){if(!!this.calendarRendered)return;var t={showPrevMonth:!0,showNextMonth:!0,date:new Date},n=e.mix(this.options.calendar,t);this.calendar=new e.Calendar(n),n.customRenderer&&this.calendar.set("customRenderer",n.customRenderer),this.calendar.render(this.oOverlay.get("contentBox")),n.plugin&&this.calendar.plug(n.plugin.pluginClass,e.mix({datepicker:this},n.plugin.pluginOptions)),this.calendar.on("selectionChange",function(e){var t=e.newSelection[0];this.setValue(t),this.oOverlay.hide()},this),this.calendarRendered=!0},beforeShowOverlay:function(){if(!!this.calendar){var e=this.getValue(!0),t=this.validate();t&&!!e&&(this.calendar.set("date",e),this.calendar._clearSelection(!0),this.calendar._addDateToSelection(e,1),this.calendar._renderSelectedDates())}},close:function(){this.oOverlay&&this.oOverlay.hide()},disable:function(){n.DatePickerField.superclass.disable.call(this),this.button.set("disabled",!0)},enable:function(){n.DatePickerField.superclass.enable.call(this),this.button.set("disabled",!1)}}),n.registerType("datepicker",n.DatePickerField)},"@VERSION@",{requires:["inputex-date","event-outside","node-event-delegate","overlay","calendar"],ix_provides:"datepicker",skinnable:!0,lang:["en","fr","de","ca","es","fr","it","nl"]});
