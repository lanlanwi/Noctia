import { throwIf } from '../internal';

const TOAST_CLASS = 'nc-toast-notification';

let toastElm: HTMLElement | null = null;

function createElm(): HTMLElement {
  const div = document.createElement('div');

  div.className = TOAST_CLASS;
  div.setAttribute('role', 'status');
  div.setAttribute('aria-live', 'polite');

  document.body.appendChild(div);

  return div;
}

function getElm(): HTMLElement {
  if (!toastElm) {
    toastElm = document.querySelector<HTMLElement>(`.${TOAST_CLASS}`) ?? createElm();
  }

  return toastElm;
}

const MAX_LETTERS = 40;
const TOAST_TIMEOUT = 3000;

let timer: ReturnType<typeof setTimeout> | undefined;

export function showToast(text: string) {
  throwIf(typeof text !== 'string', 'toast: Expected a string.');

  const trimmedText = text.trim();
  if (!trimmedText) return;

  const chars = [...trimmedText];
  const formattedText =
    chars.length > MAX_LETTERS ? chars.slice(0, MAX_LETTERS).join('') + '...' : trimmedText;

  const elm = getElm();

  clearTimeout(timer);

  elm.textContent = formattedText;
  elm.classList.add('is-active');

  timer = setTimeout(() => {
    elm.classList.remove('is-active');
  }, TOAST_TIMEOUT);
}
