/*!
 * Noctia JS
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
  click: [],
  toggle: [],
  transitionend: [],
  focusin: [],
  focusout: [],
  scroll: []
};



/*
<<<<< === COMPONENTS EVENTS === >>>>>
*/
function fixedDetailsEvent(elm) {
  const content = elm._content || (elm._content = elm.querySelector(".noctia-fixed-details-content"));
  if (!content) return;

  clearTimeout(elm._timeout);
  if (elm.open) {
    content.style.height = content.scrollHeight + "px";
    elm._timeout = setTimeout(() => {
      content.style.opacity = "1";
      content.style.transform = "scale(1)";
    }, 400);
  } else {
    content.style.height = "0";
    content.style.opacity = "0";
    content.style.transform = "scale(0)";
  }
}

function fixedDetailsContentEvent(elm) {
  const par = elm.closest("details.noctia-fixed-details");
  if (!par || !par.open) return;
  elm.style.height = "auto";
}

NoctiaEvents.toggle.push((e) => {
  const elm = e.target;
  if (!elm.matches("details.noctia-fixed-details")) return;
  fixedDetailsEvent(elm);
});

NoctiaEvents.transitionend.push((e) => {
  const elm = e.target;
  if (!elm.matches(".noctia-fixed-details-content")) return;
  if (e.propertyName !== "height") return;
  fixedDetailsContentEvent(elm);
});





function focusInput(elm) {
  elm.style.borderColor = "var(--noctia-focus-color)";
  if (
    (elm.tagName === "INPUT" && ["submit", "reset"].includes(elm.type)) ||
    ["date", "month", "week", "time", "color"].includes(elm.type) ||
    elm.tagName === "SELECT"
  ) {
    elm.style.backgroundColor = "var(--noctia-focus-bg-color)";
  }

  if (elm.matches(":focus-visible")) {
    elm.style.outline = "var(--noctia-focus-visible-outline)";
  }
}

function blurInput(elm) {
  elm.style.borderColor = '';
  elm.style.backgroundColor = '';
  elm.style.outline = '';
}

function isInputTarget(elm) {
  const input = [
    "input[type=text]",
    "input[type=email]",
    "input[type=search]",
    "input[type=url]",
    "input[type=password]",
    "input[type=file]",
    "input[type=number]",
    "input[type=radio]",
    "input[type=checkbox]",
    "input[type=date]",
    "input[type=month]",
    "input[type=week]",
    "input[type=time]",
    "input[type=color]"
  ];

  return (
    input.some(type => elm.matches(`${type}.noctia-fixed-input`)) ||
    input.some(type => elm.matches(`form.noctia-fixed-form ${type}`)) ||
    elm.matches("form.noctia-fixed-form textarea") ||
    elm.matches("form.noctia-fixed-form select") ||
    elm.matches("textarea.noctia-fixed-textarea") ||
    elm.matches("select.noctia-fixed-select")
  )
}

NoctiaEvents.focusin.push((e) => {
  const elm = e.target;
  if (!isInputTarget(elm)) return;
  focusInput(elm);
});

NoctiaEvents.focusout.push((e) => {
  const elm = e.target;
  if (!isInputTarget(elm)) return;
  blurInput(elm);
});





function openHM(elm) {
  const ctrl = elm.getAttribute("aria-controls");
  if (!ctrl) return;

  const menu = document.querySelector(`.noctia-hm-menu#${ctrl}`);
  if (!menu) return;

  menu.classList.add("open");
  html.style.overflow = "hidden";
  toggleHMOverlay(menu, true);
}

function closeHM(menu) {
  if (!menu || !menu.classList.contains("noctia-hm-menu")) return;

  menu.classList.remove("open");
  html.style.removeProperty("overflow");
  toggleHMOverlay(menu, false);
}

function toggleHMOverlay(menu, value = false) {
  const overlay = menu.nextElementSibling;
  if (!overlay || !overlay.classList.contains("noctia-hm-overlay")) return;

  overlay.classList.toggle("active", value);
}

NoctiaEvents.click.push((e) => {
  const elm = e.target.closest("button.noctia-hm-open-btn");
  if (!elm) return;
  openHM(elm);
});

NoctiaEvents.click.push((e) => {
  const elm = e.target.closest("button.noctia-hm-close-btn, .noctia-hm-menu a");
  if (!elm) return;

  const menu = elm.closest(".noctia-hm-menu");
  closeHM(menu);
});

NoctiaEvents.click.push((e) => {
  const elm = e.target.closest(".noctia-hm-overlay");
  if (!elm) return;

  const menu = elm.parentElement.querySelector(".noctia-hm-menu");
  closeHM(menu);
});





NoctiaEvents.click.push((e) => {
  const elm = e.target.closest("[data-copy]"); 
  if (!elm) return;
  copyText(elm.dataset.copy || elm._text, elm, elm._inner);
});





function codeBlockEvent(elm) {
  const codeBlock = elm.closest("figure.noctia-code-block");
  if (!codeBlock) return;

  const code = codeBlock.querySelector(".noctia-code-container code");
  if (!code) return;

  copyText(code.textContent, elm, "Copy");
}

NoctiaEvents.click.push((e) => {
  const elm = e.target.closest("button[data-copy-block]");
  if (!elm) return;
  codeBlockEvent(elm);
});





function scrollTopEvent() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
}

NoctiaEvents.click.push((e) => {
  const elm = e.target.closest(".noctia-scroll-top");
  if (!elm) return;
  scrollTopEvent();
});
/*
<<<<< === COMPONENTS EVENTS === >>>>>
*/



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

registerEvent("click");
registerEvent("toggle");
registerEvent("transitionend");
registerEvent("focusin");
registerEvent("focusout");
registerEvent("scroll");



/*
<<<<< === Wait DOM COMPONENTS === >>>>>
*/
function breadCrumbUI() {
  const clsName = "noctia-bread-crumb-separator";
  const items = document.querySelectorAll(`nav.noctia-bread-crumb ul > :not(.${clsName})`);
  if (!items.length) return;

  items.forEach((item, i) => {
    if (i === 0) return;

    const prev = item.previousElementSibling;
    if (prev?.classList.contains(clsName)) return;

    const sep = document.createElement("span");
    sep.classList.add(clsName);
    sep.textContent = ">";
    sep.setAttribute("aria-hidden", "true");
    item.before(sep);
  });
}





function hamburgerMenuUI() {
  const open = document.querySelectorAll("button.noctia-hm-open-btn");
  fixHMBtn(open, "Open", 3);

  const close = document.querySelectorAll("button.noctia-hm-close-btn");
  fixHMBtn(close, "Close", 2);

  const menus = document.querySelectorAll(".noctia-hm-menu");
  addHMOverlay(menus);
}

function fixHMBtn(btns, val, line) {
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.replaceChildren();
    btn.setAttribute("aria-label", `${val} menu`);
    btn.style.setProperty("width", "auto", "important");
    for (let i = 1; i <= line; i++) {
      const span = document.createElement("span");
      span.setAttribute("aria-hidden", "true");
      btn.appendChild(span);
    }
  });
}

function addHMOverlay(menus) {
  if (!menus.length) return;

  menus.forEach(menu => {
    const next = menu.nextElementSibling;
    if (!next || next.classList.contains("noctia-hm-overlay")) return;
    const div = document.createElement("div");
    div.setAttribute("aria-hidden", "true");
    div.classList.add("noctia-hm-overlay");
    menu.after(div);
  });
}





function setDataCopy() {
  const datas = document.querySelectorAll("[data-copy]");
  if (!datas.length) return;

  datas.forEach(data => {
    data._text = data.textContent;
    data._inner = data.innerHTML;
  });
}





function codeBlockUI() {
  const btns = document.querySelectorAll("button[data-copy-block]");
  btns.forEach(btn => {
    btn.replaceChildren("Copy");
  });
}





function codeDescriptionUI() {
  const dls = document.querySelectorAll("dl.noctia-code-description");
  if (!dls.length) return;

  dls.forEach(dl => {
    const dts = dl.querySelectorAll("dt");
    if (!dts.length) return;

    dts.forEach(dt => {
      let dd = 1;
      let next = dt.nextElementSibling;
      while (next && next.tagName === "DD") {
        dd++;
        next = next.nextElementSibling;
      }
      dt.style.gridRow = `span ${dd}`;
    });
  });  
}





function scrollTopUI() {
  const btns = document.querySelectorAll(".noctia-scroll-top");
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.replaceChildren();
    btn.setAttribute("aria-label", "Scroll to top");
    btn.style.setProperty("width", "auto", "important");
    const span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    btn.appendChild(span);
  });
}





function licenseUI() {
  const lics = document.querySelectorAll("p.noctia-license");
  if (!lics.length) return;

  lics.forEach(lic => {
    const now = new Date().getFullYear();
    if (!/^© /.test(lic.textContent)) lic.innerHTML = `© ${now} ` + lic.innerHTML;
    if (!/\.$/.test(lic.textContent)) lic.innerHTML = lic.innerHTML + ".";

    const holder = lic.querySelector(".noctia-license-holder");
    if (holder && !/\. $/.test(holder.textContent)) holder.innerHTML += ". ";
  });
}





function toastNotificationUI() {
  const isExist = document.querySelector(".noctia-toast-notification");
  if (isExist) return;

  const tst = document.createElement("div");
  tst.classList.add("noctia-toast-notification");
  tst.setAttribute("role", "status");
  document.body.append(tst);
}
/*
<<<<< === Wait DOM COMPONENTS === >>>>>
*/



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
  breadCrumbUI();
  hamburgerMenuUI();
  setDataCopy();
  codeBlockUI();
  codeDescriptionUI();
  scrollTopUI();
  licenseUI();
  toastNotificationUI();

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