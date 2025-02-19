export const DEFAULT_FONT = 'System UI';
export const FONTS = [
  'System UI',
  'Charter',
  'Old Style',
  'Humanist',
  'Geometric Humanist',
  'Classical Humanist',
  'Neo Grotesque',
  'Monospace Slab',
  'Monospace Code',
  'Industrial',
  'Rounded Sans',
  'Slab Serif',
  'Antique',
  'Didone',
  'Handwritten',
] as const;

export type Font = typeof FONTS[number];