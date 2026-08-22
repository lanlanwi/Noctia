import { applySyntaxHighlight, removeSyntaxHighlight, throwIf } from '../internal';

export function enhanceCodeBlock(elm: HTMLElement) {
  throwIf(!(elm instanceof HTMLElement), 'enhanceCodeBlock: Expected an HTMLElement.');

  const code = elm.querySelector<HTMLElement>(':scope pre code');
  throwIf(!code, 'enhanceCodeBlock: Missing <pre><code>.');

  function highlight() {
    clearHighlight();
    applySyntaxHighlight(code!);
  }

  function clearHighlight() {
    removeSyntaxHighlight(code!);
  }

  highlight();

  return {
    highlight,
    clearHighlight,
  };
}

export function initCodeBlock(root: ParentNode = document) {
  const codeBlocks = root.querySelectorAll<HTMLElement>('[data-code-block]');

  codeBlocks.forEach((elm) => {
    enhanceCodeBlock(elm);
  });
}
