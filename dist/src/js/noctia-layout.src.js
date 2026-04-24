/*!
 * Noctia Layout JS
 * Version: 2.0.0
 * © 2026 Lanlanwi
 * Created: 2025-11-06
 * Last Updated: 2026-04-24
 * Licensed under the MIT License
 * https://opensource.org/licenses/MIT
 */





(function (global) {

const version = "v2.0.0";

const NoctiaDev = false;
function log(text) {
  if (!NoctiaDev) return;
  console.log(String(text));
}

const html = document.documentElement;

function setup() {
  const Noctia = global.Noctia ?? {};
  global.Noctia = Noctia;

  if (Noctia.state === undefined) {
    Noctia.state = {
      setup: false,
      componentsInitialized: false,
      layoutInitialized: false
    };
  }

  if (Noctia.state.setup) return;
  Noctia.state.setup = true;

  Noctia.events = {
    click: [],
    toggle: [],
    transitionend: [],
    focusin: [],
    focusout: [],
    scroll: []
  };

  Noctia.initUI = [];
  Noctia.resizeUI = [];

  Noctia.debounce = (func, wait) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  }

  setupToast(Noctia);
  setupCopyText(Noctia);
}

function setupToast(Noctia) {
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
      log(`Toast: ${formattedText || trimedText}`);
      return;
    }

    clearTimeout(elm._timeout);
    elm.textContent = formattedText || trimedText;
    elm.style.opacity = "1";
    elm._timeout = setTimeout(() => {
      elm.style.opacity = "0";
    }, 3000);
    log(`Toast: ${formattedText || trimedText}`);
  }
}

function setupCopyText(Noctia) {
  Noctia.copyText = (text, elm, inner) => {
    const formattedText = String(text);
    if (!formattedText) return;

    function response(val) {
      if (!elm) return;
      elm._timeout && clearTimeout(elm._timeout);
      elm.textContent = val;
      elm._timeout = setTimeout(() => {
        elm.innerHTML = inner ?? elm._inner;
      }, 1200);
    }

    (async () => {
      try {
        await navigator.clipboard.writeText(formattedText);
        Noctia.toast(`Copied: ${formattedText}`);
        response("Copied!");
        log(`Copied: ${formattedText}`);
      } catch (error) {
        console.error(error);
        Noctia.toast(`Error: ${error}`);
        response("Failed!");
      }
    })();
  }
}

setup();





/*
<<<<< === LAYOUT === >>>>>
*/
function setupLayout(Noctia) {
  if (Noctia.state.layoutInitialized) return;
  Noctia.state.layoutInitialized = true;

  setupLayoutEvents(Noctia);
  setupLayoutUI(Noctia);

  log("✓ Layout set up");  
}



/* LAYOUT EVENTS */
function setupLayoutEvents(Noctia) {
  /* Auto Hiding Fixed Nav */
  function autoHidingNavEvent(elm) {
    let curY = window.scrollY;

    if (!elm._state) return;
    const lastY = elm._state.lastY;
    const delta = elm._state.delta;

    const scrolledDown = curY - lastY > delta;
    const scrolledUp = lastY - curY > delta;

    const atTop = curY <= 1;
    const atBot = (window.innerHeight + curY) >= document.body.scrollHeight - 1;

    if (scrolledUp || atTop || atBot) {
      if (elm.classList.contains("hide")) log("Nav: Show");
      elm.classList.remove("hide");
      elm._state.lastY = curY;
    } else if (scrolledDown) {
      if (!elm.classList.contains("hide")) log("Nav: Hide");
      elm.classList.add("hide");
      elm._state.lastY = curY;
    }
  }

  Noctia.events.scroll.push((e) => {
    const els = Noctia.autoHidingEls;
    if (!els || els.length === 0) return;
    els.forEach(autoHidingNavEvent);
  });

}



/* LAYOUT UI */
function setupLayoutUI(Noctia) {
  /* Fixed Nav */
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
          nav.style.setProperty("display", "none", "important");
        } else {
          document.body.style[padding] = `${nav.offsetHeight - 1}px`;
          if (i === 0) html.style.setProperty("--noctia-fixed-nav-scroll-margin-top", `${nav.offsetHeight}px`);
        }
      });
    });
  }

  Noctia.initUI.push(fixedNavUI);
  Noctia.resizeUI.push(fixedNavUI);


  /* Auto Hiding Fixed Nav */
  function setAutoHidingNav() {
    global.Noctia.autoHidingEls = [];

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
      global.Noctia.autoHidingEls.push(nav);
    });
  }

  Noctia.initUI.push(setAutoHidingNav);
  Noctia.resizeUI.push(setAutoHidingNav);

}

setupLayout(global.Noctia);
/*
<<<<< === LAYOUT === >>>>>
*/





(function (Noctia) {
  if (!Noctia.state.setup) return;

  /* Dispatcher */
  function dispatch(type, e) {
    const handlers = Noctia.events[type];
    if (!handlers || handlers.length === 0) return;
    for (const fn of handlers) fn(e);
  }

  /* Register */
  const registered = new Set();
  function registerEvent(type) {
    if (!Noctia.events[type]) return;
    if (registered.has(type)) return;
    registered.add(type);

    if (type === "focusin" || type === "focusout" || type === "toggle") {
      document.addEventListener(type, (e) => {
        dispatch(type, e);
      }, { capture: true });
    } else if (type === "scroll") {
      let ticking = false;
      window.addEventListener(type, (e) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          dispatch(type, e);
          ticking = false;
        });
      });
    } else {
      document.addEventListener(type, (e) => {
        dispatch(type, e);
      });
    }
  }

  registerEvent("click");
  registerEvent("toggle");
  registerEvent("transitionend");
  registerEvent("focusin");
  registerEvent("focusout");
  registerEvent("scroll");


  /* Init */
  if (!Noctia._resizeDebounce) {
    Noctia._resizeDebounce = Noctia.debounce(resizeEvent, 100);
  }
  Noctia.init = () => {
    initDOM();

    window.removeEventListener("resize", Noctia._resizeDebounce);
    window.addEventListener("resize", Noctia._resizeDebounce);
    console.log(`:）Initialized Noctia(Layout) ${version}`);
  }

  function initDOM() {
    toastNotificationUI();
    setVersion();
    for (const ui of  Noctia.initUI) ui();
  }

  function resizeEvent() {
    for (const ui of  Noctia.resizeUI) ui();
  }

  function toastNotificationUI() {
    const isExist = document.querySelector(".noctia-toast-notification");
    if (isExist) return;

    const tst = document.createElement("div");
    tst.classList.add("noctia-toast-notification");
    tst.setAttribute("role", "status");
    document.body.append(tst);
  }

  function setVersion() {
    const elm = document.querySelectorAll(".noctia-version");
    if (!elm.length) return;

    elm.forEach(e => {
      e.textContent = version
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", Noctia.init, { once: true });
  } else {
    Noctia.init();
  }

})(global.Noctia);

})(window);