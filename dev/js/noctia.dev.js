/*!
 * noctia
 * Version: 1.2.0
 * Copyright (c) 2026 Lanlanwi
 * Created: 2025-11-06
 * Last Updated: 2026-08-23
 * Licensed under the MIT License
 * https://opensource.org/licenses/MIT
 */

// src/ts/utils/abort.ts
function abortManager() {
  let controller = null;
  return {
    create() {
      controller == null ? void 0 : controller.abort();
      controller = new AbortController();
    },
    cancel() {
      controller == null ? void 0 : controller.abort();
      controller = null;
    },
    get signal() {
      if (!controller) {
        throw new Error("abortManager: Call create() before accessing signal.");
      }
      return controller.signal;
    }
  };
}

// src/ts/utils/focus-trap.ts
function getFocusables(elm) {
  const target = '[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const elms = elm.querySelectorAll(target);
  return [...elms].filter(
    (e) => !e.hasAttribute("disabled") && e.getClientRects().length > 0 && e.tabIndex >= 0
  );
}
function enhanceFocusTrap(container) {
  throwIf(!(container instanceof HTMLElement), "enhanceFocusTrap: Expected an HTMLElement.");
  function onKeyDown(e) {
    if (e.key !== "Tab") return;
    const focusables = getFocusables(container);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (first === last) {
      e.preventDefault();
      first.focus();
      return;
    }
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
      return;
    }
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
      return;
    }
  }
  let previousFocus = null;
  function enable() {
    var _a;
    disable();
    if (document.activeElement instanceof HTMLElement) {
      previousFocus = document.activeElement;
    }
    container.addEventListener("keydown", onKeyDown);
    (_a = getFocusables(container)[0]) == null ? void 0 : _a.focus();
  }
  function disable() {
    container.removeEventListener("keydown", onKeyDown);
    previousFocus == null ? void 0 : previousFocus.focus();
  }
  return {
    enable,
    disable
  };
}

// src/ts/utils/frame.ts
function nextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}
function nextTwoFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

// src/ts/utils/id.ts
function createId() {
  try {
    return crypto.randomUUID();
  } catch (e) {
    return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

// src/ts/utils/syntax-highlight.ts
var RULES = [
  {
    type: "comment",
    start: "/*",
    end: "*/"
  },
  {
    type: "comment",
    start: "//",
    end: "\n"
  },
  {
    type: "comment",
    start: "--",
    end: "\n"
  },
  {
    type: "comment",
    start: "#",
    end: "\n"
  },
  {
    type: "comment",
    start: "<!--",
    end: "-->"
  },
  {
    type: "string",
    start: '"',
    end: '"',
    escape: "\\"
  },
  {
    type: "string",
    start: "'",
    end: "'",
    escape: "\\"
  },
  {
    type: "string",
    start: "`",
    end: "`",
    escape: "\\"
  }
];
RULES.sort((a, b) => b.start.length - a.start.length);
function findRule(text, index, rules) {
  return rules.find((rule) => text.startsWith(rule.start, index));
}
function readToken(text, index, rule) {
  let end = index + rule.start.length;
  while (end < text.length) {
    if (rule.escape && text.startsWith(rule.escape, end)) {
      end += rule.escape.length + 1;
      continue;
    }
    if (text.startsWith(rule.end, end)) {
      end += rule.end.length;
      break;
    }
    end++;
  }
  return {
    type: rule.type,
    value: text.slice(index, end)
  };
}
function readText(text, index, rules) {
  let end = index;
  while (end < text.length) {
    if (findRule(text, end, rules)) break;
    end++;
  }
  return {
    type: "text",
    value: text.slice(index, end)
  };
}
function parse(text, rules) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const rule = findRule(text, i, rules);
    const token = rule ? readToken(text, i, rule) : readText(text, i, rules);
    if (token.value.length > 0) {
      tokens.push(token);
    }
    i += token.value.length;
  }
  return tokens;
}
function apply(node) {
  var _a;
  const text = (_a = node.textContent) != null ? _a : "";
  const tokens = parse(text, RULES);
  const frag = document.createDocumentFragment();
  tokens.forEach((token) => {
    if (token.type === "text") {
      frag.append(token.value);
      return;
    }
    const span = document.createElement("span");
    span.className = `token-${token.type} syntax-auto`;
    span.textContent = token.value;
    frag.append(span);
  });
  node.replaceWith(frag);
}
function applySyntaxHighlight(elm) {
  throwIf(!(elm instanceof HTMLElement), "applySyntaxHighlight: Expected an HTMLElement.");
  const textNodes = [];
  const walker = document.createTreeWalker(elm, NodeFilter.SHOW_TEXT);
  let node;
  while (node = walker.nextNode()) {
    if (node instanceof Text) {
      textNodes.push(node);
    }
  }
  textNodes.forEach((textNode) => {
    apply(textNode);
  });
}
function removeSyntaxHighlight(elm) {
  throwIf(!(elm instanceof HTMLElement), "removeSyntaxHighlight: Expected an HTMLElement.");
  const auto = elm.querySelectorAll(".syntax-auto");
  auto.forEach((e) => {
    e.replaceWith(e.textContent);
  });
}

// src/ts/utils/throw-error.ts
function throwIf(val, message = "") {
  if (val) {
    throw new Error(String(message));
  }
}

// src/ts/utils/transition.ts
function parseTime(value) {
  const n = parseFloat(value) || 0;
  return value.trim().endsWith("ms") ? n : n * 1e3;
}
function getTransitionTime(elm) {
  if (!(elm instanceof HTMLElement)) return 0;
  const style = getComputedStyle(elm);
  const durations = style.transitionDuration.split(",");
  const delays = style.transitionDelay.split(",");
  return Math.max(
    0,
    ...durations.map((dur, i) => parseTime(dur) + parseTime(delays[i % delays.length]))
  );
}
function waitTransition(elm, signal) {
  throwIf(!(elm instanceof HTMLElement), "waitTransition: Expected an HTMLElement.");
  return new Promise((resolve, reject) => {
    if (signal == null ? void 0 : signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const duration = getTransitionTime(elm);
    if (duration === 0) {
      resolve();
      return;
    }
    const onAbort = () => {
      clearTimeout(timer2);
      signal == null ? void 0 : signal.removeEventListener("abort", onAbort);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal == null ? void 0 : signal.addEventListener("abort", onAbort, { once: true });
    const timer2 = setTimeout(() => {
      signal == null ? void 0 : signal.removeEventListener("abort", onAbort);
      resolve();
    }, duration + 10);
  });
}

// src/ts/features/data-copy.ts
function getText(elm) {
  var _a;
  if (elm instanceof HTMLInputElement || elm instanceof HTMLTextAreaElement) {
    return elm.value;
  }
  return (_a = elm.textContent) != null ? _a : "";
}
function handleDataCopy(_, elm) {
  if (!(elm instanceof HTMLElement)) return;
  const text = elm.dataset.copy || getText(elm);
  void copyText(text);
}
function handleCopyTarget(_, elm) {
  if (!(elm instanceof HTMLElement)) return;
  const id = elm.dataset.copyTarget;
  if (!id) return;
  const target = document.getElementById(id);
  if (!(target instanceof HTMLElement)) return;
  const text = getText(target);
  void copyText(text);
}
var DELEGATE_ID_COPY = "data-copy-id";
var DELEGATE_ID_TARGET = "data-copy-target-id";
function initDataCopy() {
  delegateEvent("click", "[data-copy]", DELEGATE_ID_COPY, handleDataCopy);
  delegateEvent("click", "[data-copy-target]", DELEGATE_ID_TARGET, handleCopyTarget);
}

// src/ts/features/scroll-to-top.ts
function handleScrollTop(_, __) {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
}
var DELEGATE_ID_SCROLL_TOP = "scroll-top";
function initScrollToTop() {
  delegateEvent("click", "[data-scroll-top]", DELEGATE_ID_SCROLL_TOP, handleScrollTop);
}

// src/ts/features/init.ts
function initFeatures() {
  initDataCopy();
  initScrollToTop();
}

// src/ts/features/copy-text.ts
async function copyText(text) {
  throwIf(typeof text !== "string", "copyText: Expected a string.");
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied: ${text}`);
  } catch (error) {
    console.error(error);
    showToast(`Error: ${error}`);
    throw error;
  }
}

// src/ts/features/overlay.ts
var OVERLAY_CLASS = "nc-overlay";
var overlayElm = null;
function createElm() {
  const div = document.createElement("div");
  div.className = OVERLAY_CLASS;
  document.body.appendChild(div);
  return div;
}
function getElm() {
  var _a;
  if (!overlayElm) {
    overlayElm = (_a = document.querySelector(`.${OVERLAY_CLASS}`)) != null ? _a : createElm();
  }
  return overlayElm;
}
var count = 0;
function showOverlay() {
  count++;
  if (count === 1) {
    const elm = getElm();
    elm.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }
}
function hideOverlay() {
  if (count === 0) return;
  count--;
  if (count === 0) {
    const elm = getElm();
    elm.classList.remove("is-active");
    document.body.style.overflow = "";
  }
}

// src/ts/features/toast-notification.ts
var TOAST_CLASS = "nc-toast-notification";
var toastElm = null;
function createElm2() {
  const div = document.createElement("div");
  div.className = TOAST_CLASS;
  div.setAttribute("role", "status");
  div.setAttribute("aria-live", "polite");
  document.body.appendChild(div);
  return div;
}
function getElm2() {
  var _a;
  if (!toastElm) {
    toastElm = (_a = document.querySelector(`.${TOAST_CLASS}`)) != null ? _a : createElm2();
  }
  return toastElm;
}
var MAX_LETTERS = 40;
var TOAST_TIMEOUT = 3e3;
var timer;
function showToast(text) {
  throwIf(typeof text !== "string", "toast: Expected a string.");
  const trimmedText = text.trim();
  if (!trimmedText) return;
  const chars = [...trimmedText];
  const formattedText = chars.length > MAX_LETTERS ? chars.slice(0, MAX_LETTERS).join("") + "..." : trimmedText;
  const elm = getElm2();
  clearTimeout(timer);
  elm.textContent = formattedText;
  elm.classList.add("is-active");
  timer = setTimeout(() => {
    elm.classList.remove("is-active");
  }, TOAST_TIMEOUT);
}

// src/ts/core/theme.ts
var THEME_STORAGE_KEY = "noctia-theme";
var themes = ["light", "dark", "system"];
function setTheme(theme) {
  throwIf(typeof theme !== "string", "setTheme: Expected a string.");
  const html = document.documentElement;
  if (theme === "system") {
    html.removeAttribute("data-theme");
  } else {
    html.dataset.theme = theme;
  }
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
function getTheme() {
  const data = localStorage.getItem(THEME_STORAGE_KEY);
  if (themes.includes(data)) {
    return data;
  }
  return null;
}
function initTheme(defaultTheme = "light") {
  throwIf(typeof defaultTheme !== "string", "initTheme: Expected a string.");
  const theme = getTheme();
  setTheme(theme != null ? theme : defaultTheme);
}

// src/ts/core/init.ts
function initCore() {
  initTheme();
}

// src/ts/core/event-delegation.ts
var events = {};
function dispatch(type, target, evt) {
  const handlers2 = events[type];
  if (!handlers2) return;
  handlers2.forEach((handler) => {
    const elm = target.closest(handler.selector);
    if (!elm) return;
    handler.listener(evt, elm);
  });
}
var registered = /* @__PURE__ */ new Set();
function registerEvent(type) {
  if (registered.has(type)) return;
  registered.add(type);
  document.addEventListener(type, (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    dispatch(type, target, e);
  });
}
function delegateEvent(type, selector, id, listener) {
  registerEvent(type);
  undelegateEvent(type, id);
  if (!events[type]) events[type] = [];
  events[type].push({
    selector,
    id,
    listener
  });
}
function undelegateEvent(type, id) {
  const handlers2 = events[type];
  if (!handlers2) return;
  const filtered = handlers2.filter((e) => e.id !== id);
  if (filtered.length === 0) {
    delete events[type];
  } else {
    events[type] = filtered;
  }
}

// src/ts/core/scroll-event.ts
var handlers = [];
function addScrollHandler(handler, id) {
  removeScrollHandler(id);
  handlers.push({ handler, id });
}
function removeScrollHandler(id) {
  const index = handlers.findIndex((e) => e.id === id);
  if (index === -1) return;
  handlers.splice(index, 1);
}
var ticking = false;
function onScroll() {
  if (ticking || handlers.length === 0) return;
  ticking = true;
  requestAnimationFrame(() => {
    const scrollY = window.scrollY;
    handlers.forEach(({ handler }) => {
      handler(scrollY);
    });
    ticking = false;
  });
}
window.addEventListener("scroll", onScroll);

// src/ts/layouts/bar.ts
var status = {
  top: {
    exist: false,
    size: 0
  },
  bottom: {
    exist: false,
    size: 0
  }
};
function attachBar(elm) {
  throwIf(!(elm instanceof HTMLElement), "attachBar: Expected an HTMLElement.");
  const mode = elm.dataset.bar !== "bottom" ? "top" : "bottom";
  if (!status[mode] || status[mode].exist) return;
  status[mode].exist = true;
  let destroyed = false;
  function throwIfDestroyed() {
    throwIf(destroyed, "Bar has been destroyed.");
  }
  const observer = new ResizeObserver((ent) => {
    requestAnimationFrame(() => onChangeSize(ent[0]));
  });
  function onChangeSize(ent) {
    var _a, _b, _c;
    const height = (_c = (_b = (_a = ent.borderBoxSize) == null ? void 0 : _a[0]) == null ? void 0 : _b.blockSize) != null ? _c : ent.contentRect.height;
    if (elm.dataset.auto !== void 0) {
      status[mode].size = height;
    }
    const padding = mode === "top" ? "paddingTop" : "paddingBottom";
    document.body.style[padding] = `${height}px`;
  }
  const id = createId();
  function reset() {
    observer.unobserve(elm);
    removeScrollHandler(id);
  }
  function init() {
    throwIfDestroyed();
    reset();
    observer.observe(elm);
    if (elm.dataset.auto !== void 0) {
      addScrollHandler(autoHiding, id);
    }
  }
  function autoHiding(cur) {
    const top = status.top.size;
    const bot = status.bottom.size;
    const atTop = top >= cur;
    const atBot = window.innerHeight + cur >= document.body.scrollHeight - bot;
    if (atTop || atBot) {
      elm.classList.remove("is-hide");
    } else {
      elm.classList.add("is-hide");
    }
  }
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    reset();
    status[mode] = {
      exist: false,
      size: 0
    };
    const padding = mode === "top" ? "paddingTop" : "paddingBottom";
    document.body.style[padding] = "";
  }
  init();
  return {
    init,
    destroy
  };
}
function initBar(root = document) {
  const bars = root.querySelectorAll("[data-bar]");
  bars.forEach((elm) => {
    attachBar(elm);
  });
}

// src/ts/layouts/init.ts
function initLayouts(root = document) {
  throwIf(
    !(root instanceof Document || root instanceof HTMLElement),
    "initLayouts: Expected a Document or HTMLElement."
  );
  initBar(root);
}

// src/ts/components/accordion.ts
function enhanceAccordion(elm) {
  var _a;
  throwIf(
    !(elm instanceof HTMLDetailsElement),
    "enhanceAccordion: Expected an HTMLDetailsElement."
  );
  const summary = elm.querySelector(":scope > summary");
  throwIf(!summary, "enhanceAccordion: Missing <summary>.");
  const content = elm.querySelector("[data-accordion-content]");
  throwIf(!content, "enhanceAccordion: Missing [data-accordion-content].");
  const closeText = (_a = summary.textContent) != null ? _a : "";
  const openText = elm.dataset.accordion || closeText;
  let destroyed = false;
  function throwIfDestroyed() {
    throwIf(destroyed, "Accordion has been destroyed.");
  }
  function reset() {
    abort.cancel();
    summary.removeEventListener("click", onClick);
    content.style.height = "";
  }
  function init() {
    throwIfDestroyed();
    reset();
    state2 = elm.open ? "open" : "closed";
    summary.textContent = elm.open ? openText : closeText;
    summary.addEventListener("click", onClick);
  }
  function onClick(e) {
    e.preventDefault();
    toggle();
  }
  let state2 = elm.open ? "open" : "closed";
  function toggle() {
    throwIfDestroyed();
    if (state2 === "open" || state2 === "opening") {
      return close();
    } else if (state2 === "closed" || state2 === "closing") {
      return open();
    }
  }
  const abort = abortManager();
  async function open() {
    throwIfDestroyed();
    if (state2 === "open") return;
    abort.create();
    state2 = "opening";
    summary.textContent = openText;
    try {
      content.style.height = "0px";
      elm.open = true;
      await nextTwoFrame();
      if (destroyed) return;
      content.style.height = `${content.scrollHeight}px`;
      await waitTransition(content, abort.signal);
      content.style.height = "auto";
      state2 = "open";
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      throw e;
    }
  }
  async function close() {
    throwIfDestroyed();
    if (state2 === "closed") return;
    abort.create();
    state2 = "closing";
    summary.textContent = closeText;
    try {
      content.style.height = `${content.scrollHeight}px`;
      await nextTwoFrame();
      if (destroyed) return;
      content.style.height = "0px";
      await waitTransition(content, abort.signal);
      elm.open = false;
      content.style.height = "auto";
      state2 = "closed";
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      throw e;
    }
  }
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    reset();
    state2 = elm.open ? "open" : "closed";
    summary.textContent = elm.open ? openText : closeText;
  }
  init();
  return {
    init,
    open,
    close,
    toggle,
    destroy,
    get state() {
      return state2;
    },
    get isOpen() {
      return state2 === "open";
    },
    get isClosed() {
      return state2 === "closed";
    }
  };
}
function initAccordion(root = document) {
  const accordions = root.querySelectorAll("[data-accordion]");
  accordions.forEach((elm) => {
    enhanceAccordion(elm);
  });
}

// src/ts/components/breadcrumb.ts
var SEPARATOR_CLASS = "nc-separator";
function createSep(sep) {
  const span = document.createElement("span");
  span.className = SEPARATOR_CLASS;
  span.textContent = sep;
  span.setAttribute("aria-hidden", "true");
  return span;
}
function applyCrumbSep(elm) {
  throwIf(!(elm instanceof HTMLElement), "applyCrumbSep: Expected an HTMLElement.");
  const items = elm.querySelectorAll(":scope li");
  if (!items.length) return;
  function reset() {
    remove();
    const sep = elm.dataset.separator || ">";
    items.forEach((item, i) => {
      if (i === 0) return;
      item.prepend(createSep(sep));
    });
  }
  function remove() {
    elm.querySelectorAll(`.${SEPARATOR_CLASS}`).forEach((e) => e.remove());
  }
  reset();
  return {
    reset,
    remove
  };
}
function initBreadcrumb(root = document) {
  const breadcrumbs = root.querySelectorAll("nav[data-breadcrumb-sep]");
  breadcrumbs.forEach((elm) => {
    applyCrumbSep(elm);
  });
}

// src/ts/components/code-block.ts
function enhanceCodeBlock(elm) {
  throwIf(!(elm instanceof HTMLElement), "enhanceCodeBlock: Expected an HTMLElement.");
  const code = elm.querySelector(":scope pre code");
  throwIf(!code, "enhanceCodeBlock: Missing <pre><code>.");
  function highlight() {
    clearHighlight();
    applySyntaxHighlight(code);
  }
  function clearHighlight() {
    removeSyntaxHighlight(code);
  }
  highlight();
  return {
    highlight,
    clearHighlight
  };
}
function initCodeBlock(root = document) {
  const codeBlocks = root.querySelectorAll("[data-code-block]");
  codeBlocks.forEach((elm) => {
    enhanceCodeBlock(elm);
  });
}

// src/ts/components/drawer.ts
var state = /* @__PURE__ */ new WeakMap();
function attachDrawer(btn) {
  var _a;
  throwIf(!(btn instanceof HTMLButtonElement), "attachDrawer: Expected an HTMLButtonElement.");
  const id = (_a = btn.getAttribute("aria-controls")) != null ? _a : "";
  const drawer = document.getElementById(id);
  throwIf(!drawer, `attachDrawer: Expected an HTMLElement with id "${id}".`);
  const menu = drawer;
  let destroyed = false;
  function throwIfDestroyed() {
    throwIf(destroyed, "Drawer has been destroyed.");
  }
  function reset() {
    btn.removeEventListener("click", onClick);
    menu.removeEventListener("keydown", onKeyDown);
  }
  function init() {
    throwIfDestroyed();
    reset();
    btn.addEventListener("click", onClick);
    menu.addEventListener("keydown", onKeyDown);
  }
  function onClick(e) {
    const target = e.currentTarget;
    const action = target.dataset.drawer;
    if (action === "open") {
      open();
    } else if (action === "close") {
      close();
    } else {
      toggle();
    }
  }
  function onKeyDown(e) {
    if (e.key === "Escape") {
      close();
    }
  }
  function toggle() {
    throwIfDestroyed();
    const action = state.get(menu);
    if (action === "open") {
      close();
    } else {
      open();
    }
  }
  const trap = enhanceFocusTrap(menu);
  function open() {
    throwIfDestroyed();
    if (state.get(menu) === "open") return;
    state.set(menu, "open");
    menu.classList.add("is-active");
    btn.setAttribute("aria-expanded", "true");
    showOverlay();
    trap.enable();
  }
  function close() {
    throwIfDestroyed();
    if (state.get(menu) !== "open") return;
    state.set(menu, "closed");
    menu.classList.remove("is-active");
    btn.setAttribute("aria-expanded", "false");
    hideOverlay();
    trap.disable();
  }
  function destroy() {
    if (destroyed) return;
    if (state.get(menu) === "open") {
      close();
    }
    destroyed = true;
    reset();
    state.delete(menu);
  }
  init();
  return {
    init,
    toggle,
    open,
    close,
    destroy,
    get state() {
      return state.get(menu);
    },
    get isOpen() {
      return state.get(menu) === "open";
    },
    get isClosed() {
      return state.get(menu) === "closed";
    }
  };
}
function initDrawer(root = document) {
  const drawerBtns = root.querySelectorAll("button[data-drawer]");
  drawerBtns.forEach((btn) => {
    attachDrawer(btn);
  });
}

// src/ts/components/license.ts
var YEAR = (/* @__PURE__ */ new Date()).getFullYear();
function applyLicense(elm) {
  throwIf(
    !(elm instanceof HTMLParagraphElement),
    "applyLicense: Expected an HTMLParagraphElement."
  );
  const holder = elm.dataset.license;
  if (!holder) return;
  const copyright = `\xA9 ${YEAR} ${holder}.`;
  const statement = elm.dataset.statement;
  if (!statement) {
    elm.textContent = copyright;
  } else if (statement === "all") {
    elm.textContent = `${copyright} All rights reserved.`;
  } else {
    elm.textContent = `${copyright} ${statement}`;
  }
}
function initLicense(root = document) {
  const licenseElms = root.querySelectorAll("p[data-license]");
  licenseElms.forEach((elm) => {
    applyLicense(elm);
  });
}

// src/ts/components/init.ts
function initComponents(root = document) {
  throwIf(
    !(root instanceof Document || root instanceof HTMLElement),
    "initComponents: Expected a Document or HTMLElement."
  );
  initAccordion(root);
  initBreadcrumb(root);
  initCodeBlock(root);
  initDrawer(root);
  initLicense(root);
}
export {
  abortManager,
  applyCrumbSep,
  applyLicense,
  attachBar,
  attachDrawer,
  copyText,
  createId,
  enhanceAccordion,
  enhanceCodeBlock,
  getTheme,
  getTransitionTime,
  hideOverlay,
  initAccordion,
  initBar,
  initBreadcrumb,
  initCodeBlock,
  initComponents,
  initCore,
  initDataCopy,
  initDrawer,
  initFeatures,
  initLayouts,
  initLicense,
  initTheme,
  nextFrame,
  nextTwoFrame,
  setTheme,
  showOverlay,
  showToast,
  waitTransition
};
//# sourceMappingURL=noctia.dev.js.map
