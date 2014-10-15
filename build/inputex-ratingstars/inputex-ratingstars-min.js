YUI.add("inputex-ratingstars",function(e,t){var n=e.Lang,r=e.inputEx;r.RatingStars=function(e){r.RatingStars.superclass.constructor.call(this,e),this.resetStars()},e.extend(r.RatingStars,r.Field,{setOptions:function(t){r.RatingStars.superclass.setOptions.call(this,t),this.messages=e.mix(this.messages,e.Intl.get("inputex-ratingstars")),n.isArray(t.nStars)&&t.nStars[0]&&n.isString(t.nStars[0])?(this.options.nStars=t.nStars.length,this.options.starsMessages=t.nStars):this.options.nStars=t.nStars||5,this.options.averageValue=n.isNumber(t.averageValue)?Math.round(t.averageValue*10)/10:null,this.options.disableRate=t.disableRate||!1,this.options.nRates=t.nRates,this.options.name=t.name||"stars",this.dontReset=!1,this.disabled=t.disabled||!1,this.options.message=t.message||this.messages.ratingMsg,this.options.disableMessage=t.disableMessage,this.options.className=t.className?t.className:"inputEx-Field inputEx-RatingStars",this.setMessage()},setMessage:function(){var e=this.options.message.split("%");this.options.message="",this.options.averageValue&&(this.options.message=this.options.message+e[0]+this.options.averageValue+"/"+this.options.nStars),this.options.nRates&&(this.options.message=this.options.message+e[1]+this.options.nRates+e[2])},renderComponent:function(){this.starsEls=[],this.el=r.cn("div");for(var t=0;t<this.options.nStars;t++){var n=r.cn("div",{id:"star-"+t,className:"inputEx-star"}),i=this;n.index=t,n.onHover=function(){i.onHoverStar(this.index)},n.onClick=function(){i.onClickRating(this.index+1)},this.starsEls.push(n);var s=r.cn("a",{href:"#"+t},null,t);n.appendChild(s),this.el.appendChild(n),e.one(n).on("mouseover",n.onHover,n,!0),e.one(n).on("click",n.onClick,n,!0)}e.one(this.el).on("mouseout",this.resetStars,this,!0),this.fieldContainer.appendChild(this.el),this.divMess=this.fieldContainer.appendChild(r.cn("div",{id:this.divEl.id+"-mess",className:"inputEx-message"},null,this.options.message))},onHoverStar:function(t){if(!this.disabled){if(!this.value)for(var n=0;n<this.options.nStars;n++){var r=this.starsEls[n],i=r.firstChild;n<t+1?(e.one(r).addClass("hover"),e.one(i).setStyle("width","100%")):(e.one(r).removeClass("on"),e.one(r).removeClass("hover"))}this.options.starsMessages&&this.showMessage('<span class="inputEx-starMess">'+this.options.starsMessages[t]+"</span>")}else this.options.disableMessage&&this.showMessage('<span class="inputEx-disableMessage">'+this.options.disableMessage+"</span>")},initEvents:function(e,t){this.publish("rateEvt")},resetStars:function(t){if(this.dontReset)return;var r=n.isNumber(t)?t:this.options.averageValue,i=Math.floor(r),s=Math.floor((this.options.averageValue-i)*10),o;s>0&&(i+=1,o=s+"0%");for(var u=0;u<this.options.nStars;u++){var a=this.starsEls[u],f=a.firstChild;e.one(a).removeClass("hover"),u<i?e.one(a).addClass("on"):e.one(a).removeClass("on"),u==i-1&&o&&e.one(f).setStyle("width",o)}this.showMessage()},showMessage:function(e){if(!e)var e=this.options.message;this.divMess.innerHTML=e},onAsync:function(){this.showMessage('<span class="thanks">'+this.messages.sendingRate+"</span>")},onEndAsync:function(){this.afterRating()},onClickRating:function(e){if(this.disabled)return;this.setValue(e),this.dontReset=!0,this.disable(),this.fire("rate",e)},afterRating:function(){this.showMessage('<span class="thanks">'+this.messages.thanksRate+"</span>")},setValue:function(e){r.RatingStars.superclass.setValue.call(this,e),this.value=e},getValue:function(){return this.value}}),r.registerType("ratingstars",r.RatingStars)},"@VERSION@",{requires:["inputex-field"],skinnable:!0,ix_provides:"ratingstars",lang:["en","fr","de","ca","es","fr","it","nl","pt-BR"]});
