import { FontSize, SIZES } from '@/lib/fonts';

export function useFontSize(portalTarget: Element | null) {
  const setSize = (size: FontSize) => {
    if (!portalTarget) return;
    portalTarget.setAttribute('data-size', size);
  };

  const getPreviousSize = (size: FontSize) => {
    const index = SIZES.indexOf(size);
    return SIZES[(index - 1 + SIZES.length) % SIZES.length] as FontSize;
  };

  const getNextSize = (size: FontSize) => {
    const index = SIZES.indexOf(size);
    return SIZES[(index + 1 + SIZES.length) % SIZES.length] as FontSize;
  };

  return { setSize, getPreviousSize, getNextSize };
}
