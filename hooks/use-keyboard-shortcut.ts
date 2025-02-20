import { FontSize, SIZES } from '@/lib/fonts';
import { useEffect, useState } from 'react';
import { useFontSize } from './use-font-size';
import { useTheme } from './use-theme';

export function useKeyboardShortcut() {
  const [isNavBarAutoHide, setIsNavBarAutoHide] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'h') {
        setIsNavBarAutoHide((prev) => !prev);
      } else if (event.key === '?') {
        setShowKeyboardShortcuts((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isNavBarAutoHide, showKeyboardShortcuts };
}

export function useFontSizeKeyboardShortcut(portalTarget: Element | null) {
  const { setSize, getPreviousSize, getNextSize } = useFontSize(portalTarget);
  const { 'data-size': size } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '1') {
        if (size === SIZES[SIZES.length - 1]) {
          return;
        }

        setSize(getNextSize(size as FontSize));
      } else if (event.key === '2') {
        if (size === SIZES[0]) {
          return;
        }

        setSize(getPreviousSize(size as FontSize));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [getNextSize, getPreviousSize, setSize, size]);
}
