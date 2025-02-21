import {
    ColorPalette,
    getNextColorPalette,
    getPreviousColorPalette,
} from '@/lib/theme';
import { useEffect, useRef, useState } from 'react';

export function useThemeSwitcher(
  currentColorPalette: ColorPalette,
  portalTarget: Element | null
) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const visibleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleColorPaletteChange = (nextColorPalette: ColorPalette) => {
    portalTarget?.setAttribute('data-color-palette', nextColorPalette);
    setIsAnimatingOut(false);
    setIsPopupVisible(true);

    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (visibleTimeoutRef.current) clearTimeout(visibleTimeoutRef.current);

    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimatingOut(true);
    }, 700);

    visibleTimeoutRef.current = setTimeout(() => {
      setIsPopupVisible(false);
      setIsAnimatingOut(false);
    }, 900);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let nextColorPalette: ColorPalette | null = null;
      if (event.key === ']') {
        nextColorPalette = getNextColorPalette(currentColorPalette);
      } else if (event.key === '[') {
        nextColorPalette = getPreviousColorPalette(currentColorPalette);
      }
      if (nextColorPalette) handleColorPaletteChange(nextColorPalette);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentColorPalette]);

  return {
    isPopupVisible,
    isAnimatingOut,
    handleColorPaletteChange,
  };
}
