!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";function o(e="default sticker",t="100px",n="100px",o="200px",l="200px"){let s=document.createElement("DIV");const i=e=>{let t;return"sticker"==e.target.className?(console.log("coming from sticker"),console.log("event: ",e)):(console.log("coming from save button"),console.log("sticker container: ",e.target.parentNode),console.log("inner html: ",e.target.previousElementSibling.innerText),t={message:e.target.previousElementSibling.innerText,left:e.target.parentNode.style.left,top:e.target.parentNode.style.top,height:e.target.parentNode.style.height,width:e.target.parentNode.style.width,user:"inProgress"}),t};let c=parseFloat(1e4*Math.random());s.setAttribute("id",`sticker${c}`),s.style.padding="20px",s.style.top=n,s.style.height=l,s.style.width=o,s.style.left=t,s.style.borderColor="blue",s.style.position="absolute",s.style.backgroundColor="lightgrey",s.style.border="5px solid black",s.style["border-radius"]="3px",s.style.overflow="auto",s.style.resize="both",s.style.zIndex=999,s.className="stickerContainer";let u=document.createElement("DIV");s.appendChild(u),document.body.appendChild(s),u.innerHTML=e,u.setAttribute("id","sticker"),u.className="sticker",u.style.height="100%",u.style.width="100%",u.ondragstart=function(){return!1},u.ondblclick=d,s.onmousedown=r;let a=document.createElement("Button");a.style.position="absolute",a.style.bottom="5%",a.innerHTML="save",s.appendChild(a);let m=document.createElement("Button");m.style.position="absolute",m.style.bottom="5%",m.innerHTML="delete",m.style.right="5%",m.innerHTML="delete",s.appendChild(m),m.addEventListener("click",(function(){console.log("clicked"),m.parentNode.parentNode.removeChild(s)})),a.addEventListener("click",(function(e){console.log("clicked"),console.log("event: ",e),chrome.runtime.sendMessage({URL:window.location.href,sticker:i(e)})}))}function r(e){"sticker"===e.target.className&&(document.addEventListener("mousemove",l,!1),document.addEventListener("mouseup",s),console.log("event: ",e),e.target.parentNode.style.borderColor="blue")}function l(e){let t=e.clientX,n=e.clientY,o=e.target.parentNode;o.style.left=`${t-Number(o.style.width.split("p")[0])/2}px`,o.style.top=`${n-Number(o.style.height.split("p")[0])/2}px`}function s(e){document.removeEventListener("mousemove",l,!1),e.target.parentNode.style.borderColor="black"}function i(){console.log("focused: ",document.activeElement)}function c(e){let t=document.getElementById("stickerInput"),n=document.getElementById("sticker");if("stickerInput"===e.target.id){console.log(document.getElementById("stickerInput").value),document.removeEventListener("focusin",i,!0),document.removeEventListener("focusout",c,!0);let e=t.value;n.innerHTML=e}}function d(e){console.log("dblclick event: ",e);let t=e.target;if(console.log("sticker: ",t),"stickerInput"!==t.id){let e,n=t.innerHTML;t.innerHTML="",e=document.createElement("TEXTAREA"),e.setAttribute("id","stickerInput"),e.innerHTML=n,e.setAttribute("value",n),t.appendChild(e),e.style.width="100%",e.style.height="100%",e.style.resize="none",e.focus()}document.addEventListener("focusin",i,!0),document.addEventListener("focusout",c,!0),console.log("sticker: ",t)}n.r(t),document.onload=o(),console.log("running content script"),chrome.runtime.sendMessage({from:"content",subject:"setSticker"}),chrome.runtime.onMessage.addListener((e,t,n)=>{console.log("message incoming"),console.log(e),e.sticker.user&&(console.log("adding sticker"),document.onload=o(e.sticker.message,e.sticker.left,e.sticker.top,e.sticker.width,e.sticker.height))}),console.log("sent message!")}]);