import { delegateEvent } from '../internal';

function handleScrollTop(_: Event, __: Element) {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

const DELEGATE_ID_SCROLL_TOP = 'scroll-top';

export function initScrollToTop() {
  delegateEvent('click', '[data-scroll-top]', DELEGATE_ID_SCROLL_TOP, handleScrollTop);
}
