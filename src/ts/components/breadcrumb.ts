import { throwIf } from '../internal';

const SEPARATOR_CLASS = 'nc-separator';

function createSep(sep: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = SEPARATOR_CLASS;
  span.textContent = sep;
  span.setAttribute('aria-hidden', 'true');
  return span;
}

export function applyCrumbSep(elm: HTMLElement) {
  throwIf(!(elm instanceof HTMLElement), 'applyCrumbSep: Expected an HTMLElement.');

  const items = elm.querySelectorAll<HTMLLIElement>(':scope li');
  if (!items.length) return;

  function reset() {
    remove();

    const sep = elm.dataset.separator || '>';

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
    remove,
  };
}

export function initBreadcrumb(root: ParentNode = document) {
  const breadcrumbs = root.querySelectorAll<HTMLElement>('nav[data-breadcrumb-sep]');

  breadcrumbs.forEach((elm) => {
    applyCrumbSep(elm);
  });
}
