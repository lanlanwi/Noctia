import { enhanceFocusTrap, throwIf, showOverlay, hideOverlay } from '../internal';

type DrawerState = 'open' | 'closed';

const state = new WeakMap<HTMLElement, DrawerState>();

export function attachDrawer(btn: HTMLButtonElement) {
  throwIf(!(btn instanceof HTMLButtonElement), 'attachDrawer: Expected an HTMLButtonElement.');

  const id = btn.getAttribute('aria-controls') ?? '';

  const drawer = document.getElementById(id);
  throwIf(!drawer, `attachDrawer: Expected an HTMLElement with id "${id}".`);

  const menu = drawer as HTMLElement;

  let destroyed = false;

  function throwIfDestroyed() {
    throwIf(destroyed, 'Drawer has been destroyed.');
  }

  function reset() {
    btn.removeEventListener('click', onClick);

    menu.removeEventListener('keydown', onKeyDown);
  }

  function init() {
    throwIfDestroyed();
    reset();

    btn.addEventListener('click', onClick);

    menu.addEventListener('keydown', onKeyDown);
  }

  function onClick(e: Event) {
    const target = e.currentTarget as HTMLElement;
    const action = target.dataset.drawer;

    if (action === 'open') {
      open();
    } else if (action === 'close') {
      close();
    } else {
      toggle();
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close();
    }
  }

  function toggle() {
    throwIfDestroyed();
    const action = state.get(menu);
    if (action === 'open') {
      close();
    } else {
      open();
    }
  }

  const trap = enhanceFocusTrap(menu);

  function open() {
    throwIfDestroyed();
    if (state.get(menu) === 'open') return;

    state.set(menu, 'open');

    menu.classList.add('is-active');
    btn.setAttribute('aria-expanded', 'true');

    showOverlay();
    trap.enable();
  }

  function close() {
    throwIfDestroyed();
    if (state.get(menu) !== 'open') return;

    state.set(menu, 'closed');

    menu.classList.remove('is-active');
    btn.setAttribute('aria-expanded', 'false');

    hideOverlay();
    trap.disable();
  }

  function destroy() {
    if (destroyed) return;

    if (state.get(menu) === 'open') {
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
      return state.get(menu) === 'open';
    },

    get isClosed() {
      return state.get(menu) === 'closed';
    },
  };
}

export function initDrawer(root: ParentNode = document) {
  const drawerBtns = root.querySelectorAll<HTMLButtonElement>('button[data-drawer]');

  drawerBtns.forEach((btn) => {
    attachDrawer(btn);
  });
}
