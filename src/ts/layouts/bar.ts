import { addScrollHandler, removeScrollHandler, createId, throwIf } from '../internal';

type StatusType = {
  exist: boolean;
  size: number;
};

const status: Record<string, StatusType> = {
  top: {
    exist: false,
    size: 0,
  },
  bottom: {
    exist: false,
    size: 0,
  },
};

export function attachBar(elm: HTMLElement) {
  throwIf(!(elm instanceof HTMLElement), 'attachBar: Expected an HTMLElement.');

  const mode = elm.dataset.bar !== 'bottom' ? 'top' : 'bottom';

  if (!status[mode] || status[mode].exist) return;
  status[mode].exist = true;

  let destroyed = false;

  function throwIfDestroyed() {
    throwIf(destroyed, 'Bar has been destroyed.');
  }

  const observer = new ResizeObserver((ent) => {
    requestAnimationFrame(() => onChangeSize(ent[0]));
  });

  function onChangeSize(ent: ResizeObserverEntry) {
    const height = ent.borderBoxSize?.[0]?.blockSize ?? ent.contentRect.height;

    if (elm.dataset.auto !== undefined) {
      status[mode].size = height;
    }

    const padding = mode === 'top' ? 'paddingTop' : 'paddingBottom';

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

    if (elm.dataset.auto !== undefined) {
      addScrollHandler(autoHiding, id);
    }
  }

  function autoHiding(cur: number) {
    const top = status.top.size;
    const bot = status.bottom.size;

    const atTop = top >= cur;
    const atBot = window.innerHeight + cur >= document.body.scrollHeight - bot;

    if (atTop || atBot) {
      elm.classList.remove('is-hide');
    } else {
      elm.classList.add('is-hide');
    }
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    reset();

    status[mode] = {
      exist: false,
      size: 0,
    };

    const padding = mode === 'top' ? 'paddingTop' : 'paddingBottom';
    document.body.style[padding] = '';
  }

  init();

  return {
    init,
    destroy,
  };
}

export function initBar(root: ParentNode = document) {
  const bars = root.querySelectorAll<HTMLElement>('[data-bar]');

  bars.forEach((elm) => {
    attachBar(elm);
  });
}
