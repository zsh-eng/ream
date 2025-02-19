export const DEFAULT_COLOR_PALETTE = 'flexoki-light' as const;
export const COLOR_PALETTE_OPTIONS = [
  'flexoki-light',
  'flexoki-dark',
  'light',
  'dark',
  'rose-pine-dawn',
  'rose-pine-dusk',
  'rose-pine-moon',
  'tokyo-night',
] as const;

export type ColorPalette = (typeof COLOR_PALETTE_OPTIONS)[number];

export const THEME_ATTRIBUTES = [
  'data-color-palette',
  'data-headings',
  'data-body',
] as const;
export type ThemeAttribute = (typeof THEME_ATTRIBUTES)[number];
