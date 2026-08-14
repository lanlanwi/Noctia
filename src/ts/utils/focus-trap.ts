import { throwIf } from '../internal';

function getFocusables(elm: HTMLElement): HTMLElement[] {
  const target = '[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const elms = elm.querySelectorAll<HTMLElement>(target);

  return [...elms].filter(
    (e) => !e.hasAttribute('disabled') && e.getClientRects().length > 0 && e.tabIndex >= 0
  );
}

export function enhanceFocusTrap(container: HTMLElement) {
  throwIf(!(container instanceof HTMLElement), 'enhanceFocusTrap: Expected an HTMLElement.');

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

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

  let previousFocus: HTMLElement | null = null;

  function enable() {
    disable();

    if (document.activeElement instanceof HTMLElement) {
      previousFocus = document.activeElement;
    }

    container.addEventListener('keydown', onKeyDown);

    getFocusables(container)[0]?.focus();
  }

  function disable() {
    container.removeEventListener('keydown', onKeyDown);

    previousFocus?.focus();
  }

  return {
    enable,
    disable,
  };
}
