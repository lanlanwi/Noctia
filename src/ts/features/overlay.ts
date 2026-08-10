const OVERLAY_CLASS = 'nc-overlay';

let overlayElm: HTMLElement | null =
  null;

function createElm(): HTMLElement {
  const div =
    document.createElement('div');

  div.className = OVERLAY_CLASS;

  document.body.appendChild(div);

  return div;
}

export function getElm(): HTMLElement {
  if (!overlayElm) {
    overlayElm =
      document.querySelector<HTMLElement>(
        `.${OVERLAY_CLASS}`
      ) ?? createElm();
  }

  return overlayElm;
}

let count = 0;

export function showOverlay() {
  count++;

  if (count === 1) {
    const elm = getElm();
    elm.classList.add('is-active');
    document.body.style.overflow =
      'hidden';
  }
}

export function hideOverlay() {
  if (count === 0) return;
  count--;

  if (count === 0) {
    const elm = getElm();
    elm.classList.remove('is-active');
    document.body.style.overflow = '';
  }
}
