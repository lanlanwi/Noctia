import { throwIf } from '../internal';

import { initAccordion } from './accordion';
import { initBreadcrumb } from './breadcrumb';
import { initCodeBlock } from './code-block';
import { initDrawer } from './drawer';
import { initLicense } from './license';

export function initComponents(
  root:
    Document | HTMLElement = document
) {
  throwIf(
    !(
      root instanceof Document ||
      root instanceof HTMLElement
    ),
    'initComponents: Expected a Document or HTMLElement.'
  );

  initAccordion(root);
  initBreadcrumb(root);
  initCodeBlock(root);
  initDrawer(root);
  initLicense(root);
}
