/*!
 * Noctia Components JS
 * Version: 1.1.0
 * © 2026 Lanlanwi
 * Created: 2025-11-06
 * Last Updated: 2026-04-07
 * Licensed under the MIT License
 * https://opensource.org/licenses/MIT
 */



let html = document.documentElement;
let body = document.body;





/* ===== Fixed Details ===== */
document.querySelectorAll("details.noctia-fixed-details").forEach(details => {
  const content = details.querySelector(".noctia-fixed-details-content");
  if (!content) return;

  let opacityTime;
  details.addEventListener("toggle", () => {
    clearTimeout(opacityTime);
    if (details.open) {
      content.style.height = content.scrollHeight + "px";
      opacityTime = setTimeout(() => {
        content.style.opacity = "1";
        content.style.transform = "scale(1)";
      }, 400);
    } else {
      content.style.height = "0";
      content.style.opacity = "0";
      content.style.transform = "scale(0)";
    }
  });
  content.addEventListener("transitionend", () => {
    if (details.open) content.style.height = "auto";
  });
});





/* ===== Focus Input ===== */
const noctiaFocusElements = [
  "textarea",
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
  "input[type=color]",
  "select"
];

const noctiaClasses = [
  "noctia-fixed-input",
  "noctia-fixed-select",
  "noctia-fixed-textarea"
];

const noctiaTargetsSet = new Set();

noctiaFocusElements.forEach(sel => {
  document.querySelectorAll(`form.noctia-fixed-form ${sel}`).forEach(elm => noctiaTargetsSet.add(elm));
  noctiaClasses.forEach(cls => {
    document.querySelectorAll(`${sel}.${cls}`).forEach(elm => noctiaTargetsSet.add(elm));
  });
});

noctiaTargetsSet.forEach(elm => {
  elm.addEventListener("focus", () => {
    elm.style.borderColor = "var(--noctia-focus-color)";
    if (
      (elm.tagName === "INPUT" && ["submit", "reset"].includes(elm.type)) ||
      ["date", "month", "week", "time", "color"].includes(elm.type) ||
      elm.tagName === "SELECT"
    ) {
      elm.style.backgroundColor = "var(--noctia-focus-bg-color)";
    }
  });

  elm.addEventListener("blur", () => {
    elm.style.borderColor = '';
    elm.style.backgroundColor = '';
    elm.style.outline = '';
  });

  elm.addEventListener("focus", e => {
    if (e.target.matches(":focus-visible")) {
      elm.style.outline = "var(--noctia-focus-visible-outline)";
    }
  });
});





/* ===== Bread Crumb ===== */
document.querySelectorAll("nav.noctia-bread-crumb ul > *").forEach((list, i) => {
  if (i === 0) return;
  const newEl = document.createElement("span");
  newEl.classList.add("bread-crumb-separator");
  newEl.textContent = ">";
  newEl.setAttribute("aria-hidden", "true");
  list.before(newEl);
});





/* ===== Hamburger Menu ===== */

/* Open Button */
const noctiaBurgerBtn = document.querySelectorAll("button.noctia-burgermenu-btn");

[...noctiaBurgerBtn].forEach(btn => {
  btn.setAttribute("aria-label", "Open menu");
  noctiaFixBurgemenuBtn(btn, 3);

  btn.addEventListener("click", event => {
    noctiaOpenMenu(event);
  });
});

/* Burger Menu */
const noctiaBurgerMenu = document.querySelectorAll("button.noctia-burgermenu-btn + .noctia-burgermenu");

noctiaBurgerMenu.forEach(menu => {
  /* Overlay */
  const overlayDiv = document.createElement("div");
  overlayDiv.classList.add("noctia-burgermenu-overlay");
  overlayDiv.addEventListener("click", () => {
    noctiaCloseMenu(menu);
  });
  menu.after(overlayDiv);

  /* Close btn */
  const burgerCloseBtn = menu.querySelector("button.noctia-burgermenu-close-btn");
  noctiaFixBurgemenuBtn(burgerCloseBtn, 2);
  burgerCloseBtn?.setAttribute("aria-label", "Close menu");
    burgerCloseBtn?.addEventListener("click", event => {
    noctiaCloseMenu(menu);
  });

  /* Close on link click */
  const inpageLink = menu.getElementsByTagName("a");
  [...inpageLink].forEach(link => {
    link.addEventListener("click", () => {
      burgerCloseBtn?.dispatchEvent(new Event("click"));
    });
  });
});

/* Burgermenu Function */
function noctiaFixBurgemenuBtn(btn, num = 3) {
  if (!btn) return;
  btn.replaceChildren();
  btn.style.setProperty("width", "auto", "important");
  for (let i = 1; i <= num; i++) {
    btn.appendChild(document.createElement("span"));
  }
}

function noctiaOpenMenu(elm) {
  const menu = elm.currentTarget.nextElementSibling;
  if (!menu || !menu.classList.contains("noctia-burgermenu")) return;
  const overlay = menu.nextElementSibling;
  if (menu.querySelector("button.noctia-burgermenu-close-btn") !== null) {
    menu.classList.add("open");
    html.style.overflow = "hidden";
    noctiaToggleBurgermenuOverlay(overlay, true);
  }
}

function noctiaCloseMenu(elm) {
  elm.classList.remove("open");
  html.style.removeProperty("overflow")
  const overlay = elm.nextElementSibling;
  noctiaToggleBurgermenuOverlay(overlay, false);
}

function noctiaToggleBurgermenuOverlay(overlay, value) {
  if (!overlay || !overlay.classList.contains("noctia-burgermenu-overlay")) return;
  if (value) {
    overlay.classList.add("active");
  } else {
    overlay.classList.remove("active");
  }
}





/* ===== Copy Text ===== */
document.querySelectorAll("[data-copy]").forEach(inlineCode => {
  const code = inlineCode.textContent;
  const inner = inlineCode.innerHTML;
  inlineCode.addEventListener("click", e => {
    e.stopPropagation();
    const target = e.currentTarget;
    if (target.dataset.copy) {
      noctiaCopyText(target.dataset.copy, target, inner);
    } else {
      noctiaCopyText(code, target, inner);
    }
  });
});





/* ===== Code Block ===== */
document.querySelectorAll("figure.noctia-code-block").forEach(codeBlock => {
  /* Copy Btn */
  const codeBlockCopy = codeBlock.querySelector(".noctia-code-header [data-copy-block]");
  codeBlockCopy?.replaceChildren("Copy");

  /* Code */
  const code = codeBlock.querySelector(".noctia-code-container code")?.textContent || "";

  /* Copy Code Block */
  codeBlockCopy?.addEventListener("click", e => {
    e.stopPropagation();
    const target = e.currentTarget;
    noctiaCopyText(code, target, "Copy");
  });
});





/* ===== Copy Text To Clipboard ===== */
function noctiaCopyText(text, elm, original) {
  const formattedText = String(text);
  if (!elm || !formattedText) return;
  (async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      Noctia.toast(`Copied: ${formattedText}`);
      elm._timeout && clearTimeout(elm._timeout);
      elm.textContent = "Copied!";
      elm._timeout = setTimeout(() => {
        elm.innerHTML = original || text;
      }, 1200);      
    } catch (error) {
      console.error(error);
      Noctia.toast(`Error: ${error}`);
      elm._timeout && clearTimeout(elm._timeout);
      elm.textContent = "Failed!";
      elm._timeout = setTimeout(() => {
        elm.innerHTMl = original || text;
      }, 1200);
    }
  })();
}





/* ===== Code Description ===== */
document.querySelectorAll("dl.noctia-code-description").forEach(dl => {
  dl.querySelectorAll("dt").forEach(dt => {
    let dd = 1;
    let next = dt.nextElementSibling;
    while (next && next.tagName === "DD") {
      dd++;
      next = next.nextElementSibling;
    }
    dt.style.gridRow = `span ${dd}`;
  });
});





/* ===== Scroll Top ===== */
document.querySelectorAll(".noctia-scroll-top").forEach(btn => {
  btn.setAttribute("aria-label", "Scroll to top");

  /* Style */
  btn.replaceChildren();
  btn.style.setProperty("width", "auto", "important");
  btn.append(document.createElement("span"));
  
  /* Event */
  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  });
});





/* ===== License ===== */
document.querySelectorAll("p.noctia-license").forEach(lic => {
  const name = lic.textContent;
  const now = new Date().getFullYear();
  lic.textContent = `© ${now} ${name}.`;
});





/* ===== Noctia Function ===== */
window.Noctia = window.Noctia || {};

/* ===== Toast Notification ===== */
document.querySelectorAll("div.noctia-toast-notification").forEach(elm => elm.remove());

const noctiaToastNot = document.createElement("div");
noctiaToastNot.classList.add("noctia-toast-notification");
noctiaToastNot.setAttribute("role", "status");
body && body.append(noctiaToastNot);

let noctiaToastTimeout;

window.Noctia.toast = (text) => {
  const trimedText = String(text).trim();
  if (!trimedText) return;
  clearTimeout(noctiaToastTimeout);

  let formattedText;

  if (trimedText.length > 40) {
    formattedText = trimedText.slice(0, 40) + "...";
  }

  noctiaToastNot.textContent = formattedText || trimedText;

  noctiaToastNot.style.opacity = "1";
  noctiaToastTimeout = setTimeout(() => {
    noctiaToastNot.style.opacity = "0";
  }, 3000);
}