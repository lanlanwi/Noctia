/*!
 * Noctia Layout JS
 * Version: 2.0.0
 * © 2026 Lanlanwi
 * Created: 2025-11-06
 * Last Updated: 2026-04-11
 * Licensed under the MIT License
 * https://opensource.org/licenses/MIT
 */
function noctiaDebounce(t,e){let n;return function(...o){const i=this;clearTimeout(n),n=setTimeout(()=>{t.apply(i,o)},e)}}function noctiaFixedNav(){[[".noctia-fixed-nav-top","paddingTop"],[".noctia-fixed-nav-bot","paddingBottom"]].forEach(([t,e],n)=>{document.querySelectorAll(t).forEach((t,o)=>{const i=t.children.length>0||t.textContent.trim().length>0;0===o&&i?(document.body.style[e]=t.offsetHeight-1+"px",0===n&&document.documentElement.style.setProperty("--noctia-fixed-nav-scroll-margin-top",`${t.offsetHeight}px`)):t.style.setProperty("display","none","important")})})}function noctiaHideNav(){let t=[];if([".noctia-fixed-nav-top",".noctia-fixed-nav-bot"].forEach(e=>{const n=document.querySelector(e);n&&n.classList.contains("auto-hiding")&&t.push(n)}),!t.length)return;let e=[];t.forEach(t=>{e.push({nav:t,lastY:0,delta:1.5*t.offsetHeight})}),e.length&&window.addEventListener("scroll",()=>{let t=window.scrollY;e.forEach(e=>{const{nav:n,delta:o}=e,i=t-e.lastY>o,a=e.lastY-t>o,c=t<=1,d=window.innerHeight+t>=document.body.scrollHeight-1;i?(n.classList.add("hide"),e.lastY=t):(a||c||d)&&(n.classList.remove("hide"),e.lastY=t)})})}noctiaHideNav(),window.addEventListener("resize",noctiaDebounce(noctiaFixedNav,100)),window.addEventListener("load",()=>{noctiaFixedNav(),noctiaHideNav()});
//# sourceMappingURL=noctia-layout.js.map