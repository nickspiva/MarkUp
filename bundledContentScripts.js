!function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(i,r,function(t){return e[t]}.bind(null,r));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t),console.log("in build sticker...");var i=e=>{let{text:t,left:n,top:i,width:r,height:o,id:c,shareType:s,userId:l,mine:d}=e;const u=function(e){let t=document.createElement("DIV");const{left:n,top:i,width:r,height:o,mine:c}=e;return t.style.top=i,t.style.height=o,t.style.width=r,t.style.left=n,t.style.backgroundColor=c?"lightgrey":"lightblue",t}(e);u.setAttribute("id",`stickercontainer${c}`);const a=document.createElement("DIV");a.setAttribute("id",`sticker${c}`),a.innerHTML=t;const m=document.createElement("DIV"),p=document.createElement("Button"),f=document.createElement("Button"),g=document.createElement("Button");function h(e){const t=document.getElementById(`sticker${c}`);let n=a.innerHTML;t.innerHTML="";let i=document.createElement("TEXTAREA");i.setAttribute("id",`stickerInput${c}`),i.innerHTML=n,i.setAttribute("value",n),i.className="stickerInput",t.appendChild(i),p.innerHTML="done",p.removeEventListener("click",h),p.addEventListener("click",y)}function y(e){const t=document.getElementById(`sticker${c}`);p.innerHTML="edit";const n=document.getElementById(`stickerInput${c}`);t.innerHTML=n.value,n.remove(),p.removeEventListener("click",y),p.addEventListener("click",h)}document.body.appendChild(u),u.appendChild(a),u.appendChild(m),d&&(m.appendChild(p),m.appendChild(f)),m.appendChild(g),a.className="sticker",u.className="stickerContainer",m.className="stickerButtonContainer",p.className="stickerButton edit",f.className="stickerButton delete",g.className="stickerButton archive",p.innerHTML="edit",f.innerHTML="delete",g.innerHTML="archive",d&&(p.addEventListener("click",h),f.addEventListener("click",e=>handleDelete(e))),g.addEventListener("click",e=>{console.log("clicked")}),u.onmousedown=function(e){if("stickerButton"===e.target.className)return;const t=this;t.style.zIndex+=1;let n=e.clientX-t.getBoundingClientRect().left,i=e.clientY-t.getBoundingClientRect().top,r=t.getBoundingClientRect().width,o=t.getBoundingClientRect().height;function c(e,r){t.style.left=e-n+"px",t.style.top=r-i+"px"}function s(e){c(e.pageX,e.pageY)}n>.8*r&&i>.75*o||(c(e.pageX,e.pageY),document.addEventListener("mousemove",s),t.onmouseup=function(){document.removeEventListener("mousemove",s),t.onmouseup=null})}};function r(e){e.forEach(e=>{console.log("assembling sticker"),i({text:e.message,left:e.xPos,top:e.yPos,width:e.width,height:e.height,id:e.id,shareType:e.shareType,userId:e.userId,mine:e.mine})})}document.onreadystatechange=function(){if("complete"===document.readyState){var e=chrome.runtime.connect({name:"loadedURL"});e.postMessage({subject:"site ready",url:document.location.href}),e.onMessage.addListener((function(e){r(e.urlStickers.data)}))}},chrome.runtime.onMessage.addListener((async function(e,t,n){"adding new sticker"===e.subject&&r([e.sticker.data])}))}]);