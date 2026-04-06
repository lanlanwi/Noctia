/*!
 * Noctia Layout JS
 * Version: 1.1.0
 * © 2026 Lanlanwi
 * Created: 2025-11-06
 * Last Updated: 2026-04-06
 * Licensed under the MIT License
 * https://opensource.org/licenses/MIT
 */
document.addEventListener("DOMContentLoaded",()=>{const t=document.documentElement,e=document.body;function n(){[[".noctia-fixed-nav-top","paddingTop"],[".noctia-fixed-nav-bot","paddingBottom"]].forEach(([n,o],i)=>{document.querySelectorAll(n).forEach((n,a)=>{const s=n.children.length>0||n.textContent.trim().length>0;0===a&&s?(e.style[o]=n.offsetHeight-1+"px",0===i&&t.style.setProperty("--noctia-fixed-nav-scroll-margin-top",`${n.offsetHeight}px`)):n.style.setProperty("display","none","important")})})}function o(){let t=[];if([".noctia-fixed-nav-top",".noctia-fixed-nav-bot"].forEach(e=>{const n=document.querySelector(e);n&&n.classList.contains("auto-hiding")&&t.push(n)}),!t.length)return;let n=[];t.forEach(t=>{n.push({nav:t,lastY:0,delta:1.5*t.offsetHeight})}),n.length&&window.addEventListener("scroll",()=>{let t=window.scrollY;n.forEach(n=>{const{nav:o,delta:i}=n,a=t-n.lastY>i,s=n.lastY-t>i,d=t<=1,l=window.innerHeight+t>=e.scrollHeight-1;a?(o.classList.add("hide"),n.lastY=t):(s||d||l)&&(o.classList.remove("hide"),n.lastY=t)})})}o(),window.addEventListener("resize",function(t,e){let n;return function(...o){const i=this;clearTimeout(n),n=setTimeout(()=>{t.apply(i,o)},e)}}(n,100)),window.addEventListener("load",()=>{n(),o()})});
//# sourceMappingURL=noctia-layout.js.map