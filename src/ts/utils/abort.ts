export function abortManager() {
  let controller: AbortController | null = null;

  return {
    create() {
      controller?.abort();
      controller = new AbortController();
    },

    cancel() {
      controller?.abort();
      controller = null;
    },

    get signal() {
      if (!controller) {
        throw new Error('abortManager: Call create() before accessing signal.');
      }

      return controller.signal;
    },
  };
}
