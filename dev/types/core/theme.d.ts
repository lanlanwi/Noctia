export type ThemeType = 'light' | 'dark' | 'system';
export declare function setTheme(theme: ThemeType): void;
export declare function getTheme(): ThemeType | null;
export declare function initTheme(defaultTheme?: ThemeType): void;
