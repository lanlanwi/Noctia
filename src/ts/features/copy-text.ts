import {
  showToast,
  throwIf,
} from '../internal';

export async function copyText(
  text: string
): Promise<void> {
  throwIf(
    typeof text !== 'string',
    'copyText: Expected a string.'
  );

  try {
    await navigator.clipboard.writeText(
      text
    );
    showToast(`Copied: ${text}`);
  } catch (error) {
    console.error(error);
    showToast(`Error: ${error}`);
    throw error;
  }
}
