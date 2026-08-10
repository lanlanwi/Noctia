import {
  copyText,
  delegateEvent,
} from '../internal';

function getText(
  elm: HTMLElement
): string {
  if (
    elm instanceof HTMLInputElement ||
    elm instanceof HTMLTextAreaElement
  ) {
    return elm.value;
  }

  return elm.textContent ?? '';
}

function handleDataCopy(
  _: Event,
  elm: Element
) {
  if (!(elm instanceof HTMLElement))
    return;

  const text =
    elm.dataset.copy ?? getText(elm);

  void copyText(text);
}

function handleCopyTarget(
  _: Event,
  elm: Element
) {
  if (!(elm instanceof HTMLElement))
    return;

  const id = elm.dataset.copyTarget;
  if (!id) return;

  const target =
    document.getElementById(id);
  if (!(target instanceof HTMLElement))
    return;

  const text = getText(target);

  void copyText(text);
}

const DELEGATE_ID_COPY = 'data-copy-id';
const DELEGATE_ID_TARGET =
  'data-copy-target-id';

export function initDataCopy() {
  delegateEvent(
    'click',
    '[data-copy]',
    DELEGATE_ID_COPY,
    handleDataCopy
  );

  delegateEvent(
    'click',
    '[data-copy-target]',
    DELEGATE_ID_TARGET,
    handleCopyTarget
  );
}
