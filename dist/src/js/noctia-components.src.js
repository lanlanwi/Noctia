/*!
 * Noctia Components JS
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
<<<<< === COMPONENTS === >>>>>
*/
function setupComponents(Noctia) {
  if (Noctia.state.componentsInitialized) return;
  Noctia.state.componentsInitialized = true;

  setupComponentsEvents(Noctia);
  setupComponentsUI(Noctia);

  log("✓ Components set up");  
}



/* COMPONENTS EVENTS */
function setupComponentsEvents(Noctia) {
  /* Details */
  function detailsEvent(elm) {
    const content = elm._content || (elm._content = elm.querySelector(".noctia-details-content"));
    if (!content) return;

    clearTimeout(elm._timeout);
    if (elm.open) {
      content.style.height = content.scrollHeight + "px";
      elm._timeout = setTimeout(() => {
        content.style.opacity = "1";
        content.style.transform = "scale(1)";
      }, 400);
      log("Details = Open");
    } else {
      content.style.height = "0";
      content.style.opacity = "0";
      content.style.transform = "scale(0)";
      log("Details = Close");
    }
  }

  function detailsContentEvent(elm) {
    const par = elm.closest("details.noctia-details");
    if (!par || !par.open) return;
    elm.style.height = "auto";
  }

  Noctia.events.toggle.push((e) => {
    const elm = e.target;
    if (!elm.matches("details.noctia-details")) return
    detailsEvent(elm);
  });

  Noctia.events.transitionend.push((e) => {
    const elm = e.target;
    if (!elm.matches(".noctia-details-content")) return;
    if (e.propertyName !== "transform") return;
    detailsContentEvent(elm);
  });


  /* Focus Input */
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
    log(`${elm.tagName}: Focused`);
  }

  function blurInput(elm) {
    elm.style.borderColor = '';
    elm.style.backgroundColor = '';
    elm.style.outline = '';
    log(`${elm.tagName}: Blured`);
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
      input.some(type => elm.matches(`${type}.noctia-input`)) ||
      input.some(type => elm.matches(`form.noctia-form ${type}`)) ||
      elm.matches("form.noctia-form textarea") ||
      elm.matches("form.noctia-form select") ||
      elm.matches("textarea.noctia-textarea") ||
      elm.matches("select.noctia-select")
    )
  }

  Noctia.events.focusin.push((e) => {
    const elm = e.target;
    if (!isInputTarget(elm)) return;
    focusInput(elm);
  });

  Noctia.events.focusout.push((e) => {
    const elm = e.target;
    if (!isInputTarget(elm)) return;
    blurInput(elm);
  });


  /* Hamburger Menu */
  function openHM(elm) {
    const ctrl = elm.getAttribute("aria-controls");
    if (!ctrl) return;

    const menu = document.querySelector(`.noctia-hm-menu#${ctrl}`);
    if (!menu || !menu.querySelector(".noctia-hm-close-btn")) return;

    menu.classList.add("open");
    html.style.overflow = "hidden";
    toggleHMOverlay(menu, true);
    log("Hamburgermenu: Open");
  }

  function closeHM(menu) {
    if (!menu || !menu.classList.contains("noctia-hm-menu")) return;

    menu.classList.remove("open");
    html.style.removeProperty("overflow");
  toggleHMOverlay(menu, false);
    log("Hamburgermenu: Close");
  }

  function toggleHMOverlay(menu, value = false) {
    const overlay = menu.nextElementSibling;
    if (!overlay || !overlay.classList.contains("noctia-hm-overlay")) return;

    overlay.classList.toggle("active", value);
  }

  Noctia.events.click.push((e) => {
    const elm = e.target.closest("button.noctia-hm-open-btn");
    if (!elm) return;
    openHM(elm);
  });

  Noctia.events.click.push((e) => {
    const elm = e.target.closest("button.noctia-hm-close-btn, .noctia-hm-menu a");
    if (!elm) return;

    const menu = elm.closest(".noctia-hm-menu");
    closeHM(menu);
  });

  Noctia.events.click.push((e) => {
    const elm = e.target.closest(".noctia-hm-overlay");
    if (!elm) return;

    const menu = elm.parentElement.querySelector(".noctia-hm-menu");
    if (!menu) return;
    closeHM(menu);
  });


  /* Data Copy */
  Noctia.events.click.push((e) => {
    const elm = e.target.closest("[data-copy]"); 
    if (!elm) return;
    Noctia.copyText(elm.dataset.copy || elm._text, elm, elm._inner);
  });


  /* Code Block */
  function codeBlockEvent(elm) {
    const codeBlock = elm.closest("figure.noctia-code-block");
    if (!codeBlock) return;

    const code = codeBlock.querySelector(".noctia-code-container code");
    if (!code) return;

    log("Code Block ↓");
    Noctia.copyText(code.textContent, elm, "Copy");
  }

  Noctia.events.click.push((e) => {
    const elm = e.target.closest("button[data-copy-block]");
    if (!elm) return;
    codeBlockEvent(elm);
  });


  /* Scroll Top */
  function scrollTopEvent() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
    log("Scroll to Top: true");
  }

  Noctia.events.click.push((e) => {
    const elm = e.target.closest(".noctia-scroll-top");
    if (!elm) return;
    scrollTopEvent();
  });

}



/* COMPONENTS UI */
function setupComponentsUI(Noctia) {
  /* Bread Crumb */
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

  Noctia.initUI.push(breadCrumbUI);


  /* Hamburger Menu */
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

  Noctia.initUI.push(hamburgerMenuUI);


  /* Data Copy */
  function setDataCopy() {
    const datas = document.querySelectorAll("[data-copy]");
    if (!datas.length) return;

    datas.forEach(data => {
      data._text = data.textContent;
      data._inner = data.innerHTML;
    });
  }

  Noctia.initUI.push(setDataCopy);


  /* Code Block */
  function codeBlockUI() {
    const btns = document.querySelectorAll("button[data-copy-block]");
    btns.forEach(btn => btn.replaceChildren("Copy"));
  }

  Noctia.initUI.push(codeBlockUI);


  /* Code Description */
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

  Noctia.initUI.push(codeDescriptionUI);


  /* Scroll Top */
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

  Noctia.initUI.push(scrollTopUI);


  /* License */
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

  Noctia.initUI.push(licenseUI);

}

setupComponents(global.Noctia);
/*
<<<<< === COMPONENTS === >>>>>
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
    console.log(`:）Initialized Noctia(Components) ${version}`);
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