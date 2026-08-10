import { throwIf } from '../internal';

import { initBar } from './bar';

export function initLayouts(
  root:
    Document | HTMLElement = document
) {
  throwIf(
    !(
      root instanceof Document ||
      root instanceof HTMLElement
    ),
    'initLayouts: Expected a Document or HTMLElement.'
  );

  initBar(root);
}
