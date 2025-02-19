export const DEFAULT_THEME = 'flexoki-light' as const;
export const THEME_OPTIONS = ['flexoki-light', 'flexoki-dark', 'tokyo-night'] as const;

export type Theme = typeof THEME_OPTIONS[number];
