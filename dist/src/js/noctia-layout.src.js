/*!
 * Noctia JS Layout
 * Version: 2.0.0
 * © 2026 Lanlanwi
 * Created: 2025-11-06
 * Last Updated: 2026-04-18
 * Licensed under the MIT License
 * https://opensource.org/licenses/MIT
 */





(function (global) {
if (global.Noctia) return;
const Noctia = {};

const html = document.documentElement;

const NoctiaEvents = {
  scroll: []
};



/*
<<<<< === LAYOUT EVENTS === >>>>>
*/
function autoHidingNavEvent(elm) {
  let curY = window.scrollY;

  if (!elm._state) return;
  const lastY = elm._state.lastY;
  const delta = elm._state.delta;

  const scrolledDown = curY - lastY > delta;
  const scrolledUp = lastY - curY > delta;

  const atTop = curY <= 1;
  const atBot = (window.innerHeight + curY) >= document.body.scrollHeight - 1;

  if (scrolledDown) {
    elm.classList.add("hide");
    elm._state.lastY = curY;
  } else if (scrolledUp || atTop || atBot) {
    elm.classList.remove("hide");
    elm._state.lastY = curY;
  }
}

NoctiaEvents.scroll.push((e) => {
  autoHidingEls.forEach(autoHidingNavEvent);
});
/*
<<<<< === LAYOUT EVENTS === >>>>>
*/



/* Dispatcher */
function dispatch(type, e) {
  const handlers = NoctiaEvents[type];
  if (!handlers || handlers.length === 0) return;
  for (const fn of handlers) fn(e);
}

/* Register */
const registered = new Set();

function registerEvent(type) {
  if (!NoctiaEvents[type]) return;
  if (registered.has(type)) return;
  registered.add(type);

  if (type === "focusin" || type === "focusout") {
    document.addEventListener(type, (e) => {
      dispatch(type, e);
    }, { passive: true, capture: true });
  } else if (type === "scroll") {
    let ticking = false;
    window.addEventListener(type, (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        dispatch(type, e);
        ticking = false;
      });
    }, { passive: true });
  } else {
    document.addEventListener(type, (e) => {
      dispatch(type, e);
    }, { passive: true });
  }
}

registerEvent("scroll");



/*
<<<<< === Wait DOM LAYOUT === >>>>>
*/
function fixedNavUI() {
  [
    [".noctia-fixed-nav-top", "paddingTop"],
    [".noctia-fixed-nav-bot", "paddingBottom"]
  ].forEach(([selector, padding], i) => {
    const navs = document.querySelectorAll(selector);
    if (!navs.length) return;

    navs.forEach((nav, j) => {
      const hasContent = nav.children.length > 0 || nav.textContent.trim().length > 0;
      if (j !== 0 || !hasContent) {
        nav.style.display = "none";
      } else {
        document.body.style[padding] = `${nav.offsetHeight - 1}px`;
        if (i === 0) html.style.setProperty("--noctia-fixed-nav-scroll-margin-top", `${nav.offsetHeight}px`);
      }
    });
  });
}

let autoHidingEls = [];
function setAutoHidingNav() {
  autoHidingEls = [];

  [
    ".noctia-fixed-nav-top", 
    ".noctia-fixed-nav-bot"
  ].forEach(selector => {
    const nav = document.querySelector(selector);
    if (!nav || !nav.classList.contains("auto-hiding")) return;

    nav._state = {
      lastY: 0,
      delta: nav.offsetHeight * 1.5
    }
    autoHidingEls.push(nav);
  });
}
/*
<<<<< === Wait DOM LAYOUT === >>>>>
*/



function initDOM() {
  fixedNavUI();
  setAutoHidingNav();
}

function resizeEvent() {
  fixedNavUI();
  setAutoHidingNav();
}

let resizeDebounce = debounce(resizeEvent, 100);
Noctia.init = () => {
  initDOM();

  window.removeEventListener("resize", resizeDebounce);
  window.addEventListener("resize", resizeDebounce);
}



if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", Noctia.init, { once: true });
} else {
  Noctia.init();
}





function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  }
}



function copyText(text, elm, inner) {
  const formattedText = String(text);
  if (!formattedText) return;

  function response(val) {
    if (!elm) return;
    elm._timeout && clearTimeout(elm._timeout);
    elm.textContent = val;
    elm._timeout = setTimeout(() => {
      elm.innerHTML = inner ?? elm._inner ?? text;
    }, 1200);
  }

  (async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      Noctia.toast(`Copied: ${formattedText}`);
      response("Copied!");
    } catch (error) {
      console.error(error);
      Noctia.toast(`Error: ${error}`);
      response("Failed!");
    }
  })();
}





Noctia.toast = (text = "") => {
  const trimedText = String(text).trim();
  if (!trimedText) return;

  let formattedText;
  if (trimedText.length > 40) {
    formattedText = trimedText.slice(0, 40) + "...";
  }

  const elm = document.querySelector(".noctia-toast-notification");

  if (!elm) {
    alert(formattedText || trimedText);
    return;
  }

  clearTimeout(elm._timeout);
  elm.textContent = formattedText || trimedText;
  elm.style.opacity = "1";
  elm._timeout = setTimeout(() => {
    elm.style.opacity = "0";
  }, 3000);
}



global.Noctia = Noctia;
})(window);