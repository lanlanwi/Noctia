/*!
 * Noctia Layout JS
 * Version: 2.0.0
 * © 2026 Lanlanwi
 * Created: 2025-11-06
 * Last Updated: 2026-04-11
 * Licensed under the MIT License
 * https://opensource.org/licenses/MIT
 */





/* ===== Debounce ===== */
function noctiaDebounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  }
}





/* ===== Fixed Nav ===== */
function noctiaFixedNav() {
  [
    [".noctia-fixed-nav-top", "paddingTop"],
    [".noctia-fixed-nav-bot", "paddingBottom"]
  ].forEach(([selector, padding], i) => {
    document.querySelectorAll(selector).forEach((nav, j) => {
      const hasContent = nav.children.length > 0 || nav.textContent.trim().length > 0;
      if (j !== 0 || !hasContent) {
        nav.style.setProperty("display", "none", "important");
      } else {
        document.body.style[padding] = `${nav.offsetHeight - 1}px`;
        if (i === 0) document.documentElement.style.setProperty("--noctia-fixed-nav-scroll-margin-top", `${nav.offsetHeight}px`);
      }
    });
  });
};

/* Auto Hiding */
function noctiaHideNav() {
  /* Get Auto Hiding */
  let navs = [];
  [
    ".noctia-fixed-nav-top", 
    ".noctia-fixed-nav-bot"
  ].forEach(selector => {
    const nav = document.querySelector(selector);
    if (!nav) return;
    if (nav.classList.contains("auto-hiding")) {
      navs.push(nav);
    }
  });
  if (!navs.length) return;

  /* State */
  let state = [];
  navs.forEach(nav => {
    state.push({
      nav, lastY: 0,
      delta: nav.offsetHeight * 1.5
    });
  });
  if (!state.length) return;

  /* Event */
  window.addEventListener("scroll", () => {
    let curY = window.scrollY;
    state.forEach(item => {
      const { nav , delta } = item;

      const scrolledDown = curY - item.lastY > delta;
      const scrolledUp = item.lastY - curY > delta;

      const atTop = curY <= 1;
      const atBot = (window.innerHeight + curY) >= document.body.scrollHeight - 1;

      if (scrolledDown) {
        nav.classList.add("hide");
        item.lastY = curY;
      } else if (scrolledUp || atTop || atBot) {
        nav.classList.remove("hide");
        item.lastY = curY;
      }
    });
  });
}
noctiaHideNav();

window.addEventListener("resize", noctiaDebounce(noctiaFixedNav, 100));

window.addEventListener("load", () => {
  noctiaFixedNav();
  noctiaHideNav();
});
