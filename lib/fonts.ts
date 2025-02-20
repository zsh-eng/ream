export const DEFAULT_FONT = 'Classical Humanist';
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

export const SIZES = [
  'prose-sm',
  'prose-base',
  'prose-lg',
  'prose-xl',
  'prose-2xl',
] as const;

export type FontSize = typeof SIZES[number];