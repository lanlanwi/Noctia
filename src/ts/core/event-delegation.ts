type DelegatedListener = (evt: Event, elm: Element) => void;

type DelegatedEvent = {
  selector: string;
  id: string;
  listener: DelegatedListener;
};

const events: Partial<Record<keyof DocumentEventMap, DelegatedEvent[]>> = {};

function dispatch(type: keyof DocumentEventMap, target: Element, evt: Event) {
  const handlers = events[type];
  if (!handlers) return;

  handlers.forEach((handler) => {
    const elm = target.closest(handler.selector);

    if (!elm) return;

    handler.listener(evt, elm);
  });
}

const registered = new Set<keyof DocumentEventMap>();

function registerEvent(type: keyof DocumentEventMap) {
  if (registered.has(type)) return;
  registered.add(type);

  document.addEventListener(type, (e) => {
    const target = e.target;

    if (!(target instanceof Element)) return;

    dispatch(type, target, e);
  });
}

export function delegateEvent(
  type: keyof DocumentEventMap,
  selector: string,
  id: string,
  listener: DelegatedListener
) {
  registerEvent(type);
  undelegateEvent(type, id);

  if (!events[type]) events[type] = [];

  events[type].push({
    selector,
    id,
    listener,
  });
}

export function undelegateEvent(type: keyof DocumentEventMap, id: string) {
  const handlers = events[type];
  if (!handlers) return;

  const filtered = handlers.filter((e) => e.id !== id);

  if (filtered.length === 0) {
    delete events[type];
  } else {
    events[type] = filtered;
  }
}
