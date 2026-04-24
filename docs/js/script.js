/* Utilities Color */
document.querySelectorAll("#color li").forEach(li => {
  li.addEventListener("click", (e) => {
    const color = getComputedStyle(e.currentTarget).backgroundColor;
    if (typeof Noctia !== "undefined") {
      Noctia.toast(color + " , " + rgbToHex(color));
    } else {
      alert(color + " , " + rgbToHex(color));
    }
  });
});

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  return "#" + result.map(x => {
    const hex = parseInt(x).toString(16).toUpperCase();
    return hex.length === 1 ? "0" + hex : hex;
  }).join('');
}





/* Layout Sample */
document.querySelectorAll(".noctia-sample-btn").forEach((btn, i) => {
  const selector = [
    ".noctia-layout header", 
    ".noctia-layout footer",
    ".noctia-fixed-nav-bot",
    ".noctia-fixed-nav-top.auto-hiding"
  ];
  const focus = document.querySelector(selector[i]);
  if (selector[i] == null || !focus) return;
  btn.addEventListener("click", () => {
    noctiaOutlineBlink(focus);

    focus.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    if (i === 3) {
      window.scrollBy({
        top: Number(`-${focus.offsetHeight * 3}`),
        behavior: 'smooth'
      });
    }
  });
});

function noctiaOutlineBlink(focus) {
  let stopLoop = false;

  document.addEventListener("pointerdown", () => { stopLoop = true; }, { capture: true, once: true });

  focus.style.outlineOffset = "-4px";
  let val = true;
  const outlineBlink = setInterval(() => {
    focus.style.outline = val ? "4px solid red" : "none";
    if (!val && stopLoop) {
      clearInterval(outlineBlink);
    } else {
      val = !val;
    }
  }, 500);
}
