import { throwIf } from '../internal';

function parseTime(value: string): number {
  const n = parseFloat(value) || 0;
  return value.trim().endsWith('ms') ? n : n * 1000;
}

export function getTransitionTime(elm: Element): number {
  if (!(elm instanceof HTMLElement)) return 0;

  const style = getComputedStyle(elm);

  const durations = style.transitionDuration.split(',');
  const delays = style.transitionDelay.split(',');

  return Math.max(
    0,
    ...durations.map((dur, i) => parseTime(dur) + parseTime(delays[i % delays.length]))
  );
}

export function waitTransition(elm: HTMLElement, signal?: AbortSignal): Promise<void> {
  throwIf(!(elm instanceof HTMLElement), 'waitTransition: Expected an HTMLElement.');

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const duration = getTransitionTime(elm);

    if (duration === 0) {
      resolve();
      return;
    }

    const onAbort = () => {
      clearTimeout(timer);

      signal?.removeEventListener('abort', onAbort);

      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal?.addEventListener('abort', onAbort, { once: true });

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, duration + 10);
  });
}
