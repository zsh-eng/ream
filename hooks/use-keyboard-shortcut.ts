import { FontSize, SIZES } from '@/lib/fonts';
import { useEffect, useState } from 'react';
import { useFontSize } from './use-font-size';
import { useTheme } from './use-theme';

function isModifiedKey(event: KeyboardEvent) {
  return event.metaKey || event.ctrlKey || event.altKey;
}

export function useToggleNavBarAutoHide() {
  const [isNavBarAutoHide, setIsNavBarAutoHide] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModifiedKey(event)) {
        return;
      }

      if (event.key === 'h') {
        setIsNavBarAutoHide((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isNavBarAutoHide };
}

export function useToggleKeyboardShortcutMenu() {
  const [isKeyboardShortcutMenuVisible, setIsKeyboardShortcutMenuVisible] =
    useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModifiedKey(event)) {
        return;
      }
      if (event.key === '?') {
        setIsKeyboardShortcutMenuVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isKeyboardShortcutMenuVisible) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModifiedKey(event)) {
        return;
      }

      if (event.key === 'Escape') {
        setIsKeyboardShortcutMenuVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isKeyboardShortcutMenuVisible]);

  return { isKeyboardShortcutMenuVisible };
}

export function useFontSizeKeyboardShortcut(portalTarget: Element | null) {
  const { setSize, getPreviousSize, getNextSize } = useFontSize(portalTarget);
  const { 'data-size': size } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModifiedKey(event)) {
        return;
      }

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

export function useScrollKeyboardShortcut(portalTarget: Element | null) {
  useEffect(() => {
    if (!portalTarget) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModifiedKey(event)) {
        return;
      }

      if (event.key === 'j') {
        window.scrollBy({ top: 100 });
      } else if (event.key === 'k') {
        window.scrollBy({ top: -100 });
      } else if (event.key === 'd') {
        window.scrollBy({ top: window.innerHeight / 2 });
      } else if (event.key === 'u') {
        window.scrollBy({ top: -window.innerHeight / 2 });
      } else if (event.key === 'g') {
        window.scrollTo({ top: 0 });
      } else if (event.key === 'G') {
        window.scrollTo({
          top: portalTarget.scrollHeight,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [portalTarget]);
}
