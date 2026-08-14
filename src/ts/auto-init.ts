import { initCore } from './core';
import { initLayouts } from './layouts';
import { initComponents } from './components';
import { initFeatures } from './features';

export function initNoctia(root: Document | HTMLElement = document) {
  if (!(root instanceof Document || root instanceof HTMLElement)) {
    throw new TypeError('initNoctia: Expected a Document or HTMLElement.');
  }

  initCore();
  initLayouts(root);
  initComponents(root);
  initFeatures();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initNoctia(), { once: true });
} else {
  initNoctia();
}

export * from './index';
