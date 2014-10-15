YUI.add("inputex-field",function(e,t){var n=e.Lang,r=e.inputEx;r.Field=function(t){this.messages=e.Intl.get("inputex-field"),this.setOptions(t||{}),this.render(),this.publish("updated"),this.initEvents(),t.parentEl&&(n.isString(t.parentEl)?document.getElementById(t.parentEl).appendChild(this.getEl()):t.parentEl.appendChild(this.getEl())),n.isUndefined(this.options.value)||this.setValue(this.options.value,!1)},r.Field.prototype={setOptions:function(t){this.options={},this.options.name=t.name,this.options.value=t.value,this.options.id=t.id||e.guid(),this.options.label=t.label,this.options.description=t.description,this.options.wrapperClassName=t.wrapperClassName,this.options.disabled=n.isUndefined(t.disabled)?!1:!!t.disabled,this.messages.required=t.messages&&t.messages.required?t.messages.required:this.messages.required,this.messages.invalid=t.messages&&t.messages.invalid?t.messages.invalid:this.messages.invalid,this.options.className=t.className?t.className:"inputEx-Field",this.options.required=n.isUndefined(t.required)?!1:t.required,this.options.showMsg=n.isUndefined(t.showMsg)?!1:t.showMsg,this.options.messagePosition=t.messagePosition||"right"},setFieldName:function(){},render:function(){this.divEl=r.cn("div",{className:this.options.wrapperClassName||"inputEx-fieldWrapper"}),this.options.id&&(this.divEl.id=this.options.id),n.isString(this.options.label)&&(this.labelDiv=r.cn("div",{id:this.divEl.id+"-label",className:"inputEx-label"}),this.labelEl=r.cn("label",{"for":this.divEl.id+"-field"},null,this.options.label===""?"&nbsp;":this.options.label),this.labelDiv.appendChild(this.labelEl),this.divEl.appendChild(this.labelDiv)),this.fieldContainer=r.cn("div",{className:this.options.className}),this.renderComponent(),this.options.required&&e.one(this.divEl).addClass("inputEx-required"),this.options.description&&this.fieldContainer.appendChild(r.cn("div",{id:this.divEl.id+"-desc",className:"inputEx-description"},null,this.options.description)),this.divEl.appendChild(this.fieldContainer),this.divEl.appendChild(r.cn("div",null,{clear:"both"}," ")),this.options.disabled&&this.disable()},fireUpdatedEvt:function(){var e=this;setTimeout(function(){e.fire("updated",e.getValue(),e)},20)},renderComponent:function(){},getEl:function(){return this.divEl},initEvents:function(){},getValue:function(){},setValue:function(e,t){this.setClassFromState(),t!==!1&&this.fireUpdatedEvt()},setClassFromState:function(t){var n;this.previousState&&(n="inputEx-"+(this.previousState===r.stateRequired?r.stateInvalid:this.previousState),e.one(this.divEl).removeClass(n)),t=t||this.getState();if(t!==r.stateEmpty||!e.one(this.divEl).hasClass("inputEx-focused"))n="inputEx-"+(t===r.stateRequired?r.stateInvalid:t),e.one(this.divEl).addClass(n);this.options.showMsg&&this.displayMessage(this.getStateString(t)),this.previousState=t},getStateString:function(e){return e===r.stateRequired?this.messages.required:e===r.stateInvalid?this.messages.invalid:""},getState:function(){return this.isEmpty()?this.options.required?r.stateRequired:r.stateEmpty:this.validate()?r.stateValid:r.stateInvalid},validate:function(){return!this.options.required||!this.isEmpty()},onFocus:function(){var t=e.one(this.getEl());t.removeClass("inputEx-empty"),t.addClass("inputEx-focused")},onBlur:function(){e.one(this.getEl()).removeClass("inputEx-focused"),this.setClassFromState()},onChange:function(){this.fireUpdatedEvt()},close:function(){},disable:function(){return this.disabled=!0,this},enable:function(){return this.disabled=!1,this},isDisabled:function(){return!!this.disabled},focus:function(){},destroy:function(){var t=this.getEl();this.detachAll(),e.Event.purgeElement(t,!0),e.one(t).inDoc()&&t.parentNode.removeChild(t)},displayMessage:function(e){var t=this.options.messagePosition;if(!this.fieldContainer)return;if(!this.msgEl){this.msgEl=r.cn("div",{className:t==="below"?"inputEx-message-below":"inputEx-message"});var n=this.divEl.getElementsByTagName("div");t==="below"?this.fieldContainer.appendChild(this.msgEl):this.divEl.insertBefore(this.msgEl,n[n.length-1>=0?n.length-1:0])}this.msgEl.innerHTML=e},show:function(){this.divEl.style.display=""},hide:function(){this.divEl.style.display="none"},clear:function(e){this.setValue(n.isUndefined(this.options.value)?"":this.options.value,e)},isEmpty:function(){return this.getValue()===""},setParentField:function(e){this.parentField=e},getParentField:function(){return this.parentField}},e.augment(r.Field,e.EventTarget,null,null,{}),r.Field.groupOptions=[{type:"string",label:"Name",name:"name",value:"",required:!0},{type:"string",label:"Label",name:"label",value:""},{type:"string",label:"Description",name:"description",value:""},{type:"boolean",label:"Required?",name:"required",value:!1},{type:"boolean",label:"Show messages",name:"showMsg",value:!1}]},"@VERSION@",{requires:["inputex","intl"],skinnable:!0,lang:["en","fr","de","ca","es","fr","it","nl","pt-BR"]});
