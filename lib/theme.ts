export const DEFAULT_THEME = 'flexoki-light' as const;
export const THEME_OPTIONS = ['flexoki-light', 'flexoki-dark', 'tokyo-night'] as const;

export type Theme = typeof THEME_OPTIONS[number];

export const THEME_ATTRIBUTES = ['data-theme', 'data-headings', 'data-body'] as const;
export type ThemeAttribute = typeof THEME_ATTRIBUTES[number];
