type HandlerType = (
  scrollY: number
) => void;

type HandlersType = {
  handler: HandlerType;
  id: string;
};

const handlers: HandlersType[] = [];

export function addScrollHandler(
  handler: HandlerType,
  id: string
) {
  removeScrollHandler(id);
  handlers.push({ handler, id });
}

export function removeScrollHandler(
  id: string
) {
  const index = handlers.findIndex(
    (e) => e.id === id
  );

  if (index === -1) return;
  handlers.splice(index, 1);
}

let ticking = false;

function onScroll() {
  if (ticking || handlers.length === 0)
    return;
  ticking = true;

  requestAnimationFrame(() => {
    const scrollY = window.scrollY;
    handlers.forEach(({ handler }) => {
      handler(scrollY);
    });
    ticking = false;
  });
}

window.addEventListener(
  'scroll',
  onScroll
);
