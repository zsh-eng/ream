import { useEffect, useState } from 'react';

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
