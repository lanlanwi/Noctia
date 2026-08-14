import { abortManager, nextTwoFrame, throwIf, waitTransition } from '../internal';

type AccordionState = 'open' | 'closed' | 'opening' | 'closing';

export function enhanceAccordion(elm: HTMLDetailsElement) {
  throwIf(
    !(elm instanceof HTMLDetailsElement),
    'enhanceAccordion: Expected an HTMLDetailsElement.'
  );

  const summary = elm.querySelector<HTMLElement>(':scope > summary');
  throwIf(!summary, 'enhanceAccordion: Missing <summary>.');

  const content = elm.querySelector<HTMLElement>('[data-accordion-content]');
  throwIf(!content, 'enhanceAccordion: Missing [data-accordion-content].');

  const closeText = summary!.textContent ?? '';
  const openText = elm.dataset.accordion ?? closeText;

  let destroyed = false;

  function throwIfDestroyed() {
    throwIf(destroyed, 'Accordion has been destroyed.');
  }

  function reset() {
    abort.cancel();

    summary!.removeEventListener('click', onClick);

    content!.style.height = '';
  }

  function init() {
    throwIfDestroyed();
    reset();

    state = elm.open ? 'open' : 'closed';

    summary!.textContent = elm.open ? openText : closeText;

    summary!.addEventListener('click', onClick);
  }

  function onClick(e: Event) {
    e.preventDefault();
    toggle();
  }

  let state: AccordionState = elm.open ? 'open' : 'closed';

  function toggle() {
    throwIfDestroyed();

    if (state === 'open' || state === 'opening') {
      return close();
    } else if (state === 'closed' || state === 'closing') {
      return open();
    }
  }

  const abort = abortManager();

  async function open(): Promise<void> {
    throwIfDestroyed();
    if (state === 'open') return;

    abort.create();
    state = 'opening';
    summary!.textContent = openText;

    try {
      content!.style.height = '0px';
      elm.open = true;

      await nextTwoFrame();
      if (destroyed) return;

      content!.style.height = `${content!.scrollHeight}px`;

      await waitTransition(content!, abort.signal);

      content!.style.height = 'auto';
      state = 'open';
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      throw e;
    }
  }

  async function close(): Promise<void> {
    throwIfDestroyed();
    if (state === 'closed') return;

    abort.create();
    state = 'closing';
    summary!.textContent = closeText;

    try {
      content!.style.height = `${content!.scrollHeight}px`;

      await nextTwoFrame();
      if (destroyed) return;

      content!.style.height = '0px';

      await waitTransition(content!, abort.signal);

      elm.open = false;
      content!.style.height = 'auto';
      state = 'closed';
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      throw e;
    }
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    reset();
    state = elm.open ? 'open' : 'closed';
    summary!.textContent = elm.open ? openText : closeText;
  }

  init();

  return {
    init,
    open,
    close,
    toggle,
    destroy,

    get state() {
      return state;
    },

    get isOpen() {
      return state === 'open';
    },

    get isClosed() {
      return state === 'closed';
    },
  };
}

export function initAccordion(root: ParentNode = document) {
  const accordions = root.querySelectorAll<HTMLDetailsElement>('[data-accordion]');

  accordions.forEach((elm) => {
    enhanceAccordion(elm);
  });
}
