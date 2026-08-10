import { throwIf } from '../internal';

const THEME_STORAGE_KEY =
  'noctia-theme';

export type ThemeType =
  'light' | 'dark' | 'system';

const themes: ThemeType[] = [
  'light',
  'dark',
  'system',
];

export function setTheme(
  theme: ThemeType
) {
  throwIf(
    typeof theme !== 'string',
    'setTheme: Expected a string.'
  );

  const html = document.documentElement;

  if (theme === 'system') {
    html.removeAttribute('data-theme');
  } else {
    html.dataset.theme = theme;
  }

  localStorage.setItem(
    THEME_STORAGE_KEY,
    theme
  );
}

export function getTheme(): ThemeType | null {
  const data = localStorage.getItem(
    THEME_STORAGE_KEY
  );

  if (
    themes.includes(data as ThemeType)
  ) {
    return data as ThemeType;
  }

  return null;
}

export function initTheme(
  defaultTheme: ThemeType = 'light'
) {
  throwIf(
    typeof defaultTheme !== 'string',
    'initTheme: Expected a string.'
  );

  const theme = getTheme();

  setTheme(theme ?? defaultTheme);
}
