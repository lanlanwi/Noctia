export function throwIf(val: unknown, message: unknown = ''): void {
  if (val) {
    throw new Error(String(message));
  }
}
