"use strict";var user,params=new URLSearchParams(window.location.search),userDocCache={};window.history&&history.replaceState({},"",window.location.href.substr(0,window.location.href.length-window.location.search.length));class Toast{constructor(t,o,s,i="",e=""){this.message=t,this.type=o,this.duration=s,this.icon=i,this.action=e,this.showToast()}showToast(){$(".toast").remove();let t=document.createElement("div"),o=document.createElement("div");o.classList.add("toast"),t.classList.add("toast-overlay"),o.classList.add(this.type),""!=this.icon&&(o.innerHTML+=`<img loading="lazy" alt="icon" src="${this.icon}" class="toast-icon" alt="Toast Popup Icon">`),o.innerHTML+=this.message,""!=this.action&&document.body.appendChild(t),document.body.appendChild(o),setTimeout((()=>{$(o).css({animation:"slideOut 0.5s forwards"})}),this.duration),setTimeout((()=>{t.remove(),o.remove(),""!=this.action&&""!=this.action&&(window.location.href=this.action)}),this.duration+500)}}class ErrorToast extends Toast{constructor(t,o,s,i=""){super(t+=": "+o,"default",s,"/img/icon/toast/error-icon.svg",i)}}class WarningToast extends Toast{constructor(t,o,s=""){super(t,"default",o,"/img/icon/toast/warning-icon.svg",s)}}class Popup{constructor(t,o,s,i="",e=""){"object"==typeof t?(this.title=t[0],this.message=t[1]):this.message=t,this.type=o,this.duration=s,this.icon=i,this.action=e,this.showPopup()}showPopup(){$(".popup, .popup-overlay").remove();let t=$("<div></div>",{class:"popup-overlay "+this.type}),o=$("<div></div>",{class:"popup"}),s=$("<div></div>",{id:"popup-buttons"});for(let t of this.action)$("<button></button>",{class:"popup-button "+(t[2]?t[2]:""),onclick:t[0],text:t[1]}).appendTo(s);this.icon&&$(`<img loading="lazy" alt='Popup Icon' src="${this.icon}" class="popup-icon">`).appendTo(o),this.title&&$("<div></div>",{text:this.title,class:"popup-title"}).appendTo(o),$("<div></div>",{text:this.message,class:"popup-text"}).appendTo(o),s.appendTo(o),this.action&&t.appendTo(document.body),o.appendTo(document.body),setTimeout((()=>{$(o).css({animation:"popupout 0.25s forwards"}),$(t).css({animation:"fadeout 0.5s forwards"})}),this.duration),setTimeout((()=>{o.remove(),t.remove()}),this.duration+500)}}function removePopup(){$(".popup").css({animation:"popupout 0.25s forwards"}),$(".popup-overlay").css({animation:"fadeout 0.5s forwards"}),setTimeout((()=>{$(".popup").remove(),$(".popup-overlay").remove()}),500)}$(document.body).on("click",".popup-overlay",(function(){removePopup()})),$("[placeholdaction]").click((function(){new Toast("This feature hasn't been implemented yet, sorry! 🤫","default",1500,"/img/icon/toast/unimplemented-icon.svg")})),$(document.body).on("click","*:not(a)[href]",(function(){window.location.href=$(this).attr("href")})),$(document.body).on("click","#prompt-overlay",(function(){$(this).next("#prompt-container").addClass("prompt-out").add(this).animate({opacity:0},250,(function(){$(this).remove(),$("body").attr("style","")}))})),window.addEventListener("load",(function(){setTimeout((function(){window.scrollTo(0,1)}),0)})),$(".checkbox-icon, .checkbox-label").keydown((function(t){13==t.keyCode&&(t.preventDefault(),$(this).parent().filter(".checkbox-label").click(),$(this).focus())}));
