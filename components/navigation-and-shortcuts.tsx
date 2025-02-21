import KeyboardShortcutMenu from '@/components/keyboard-shortcut-menu';
import { NavigationBar } from '@/components/navigation-bar';
import useBookmark from '@/hooks/use-bookmark';
import { useFontSize } from '@/hooks/use-font-size';
import {
    useFontSizeKeyboardShortcut,
    useScrollKeyboardShortcut,
    useToggleKeyboardShortcutMenu,
    useToggleNavBarAutoHide,
} from '@/hooks/use-keyboard-shortcut';
import { FontSize } from '@/lib/fonts';
import { stripQueryParams } from '@/lib/utils';
import { useContext } from 'react';
import { PortalTargetContext } from '~/hooks/portal-target-context.tsx';
import { useTheme } from '~/hooks/use-theme';

type NavigationAndShortcutsProps = {
  title?: string;
  excerpt?: string;
  textContent?: string;
};

// Groups the keyboard shortcuts and navigation bar functionality
// It makes sense to have them together because many of the keyboard shortcuts
// "trigger" the navigation bar
// Instead of having them go through the app component,
// group them together so that we can reuse this theming logic.
export default function NavigationAndShorcutsContainer({
  title,
  excerpt,
  textContent,
}: NavigationAndShortcutsProps) {
  const portalTarget = useContext(PortalTargetContext);

  useFontSizeKeyboardShortcut(portalTarget);
  useScrollKeyboardShortcut(portalTarget);
  const { isNavBarAutoHide } = useToggleNavBarAutoHide();
  const { isKeyboardShortcutMenuVisible } = useToggleKeyboardShortcutMenu();
  const { setSize, getPreviousSize, getNextSize } = useFontSize(portalTarget);
  const { bookmarked, onBookmark } = useBookmark(window.location.href);
  const { 'data-size': size } = useTheme();

  return (
    <>
      <KeyboardShortcutMenu
        showKeyboardShortcuts={isKeyboardShortcutMenuVisible}
        portalTarget={portalTarget}
      />

      <NavigationBar
        size={size}
        isNavBarAutoHide={isNavBarAutoHide}
        showKeyboardShortcuts={isKeyboardShortcutMenuVisible}
        onSizeIncrease={() => setSize(getNextSize(size as FontSize))}
        onSizeDecrease={() => setSize(getPreviousSize(size as FontSize))}
        bookmarked={bookmarked}
        onBookmark={() => {
          onBookmark({
            url: stripQueryParams(window.location.href),
            title: title ?? '',
            excerpt: excerpt ?? '',
            content: textContent ?? '',
          });
        }}
      />
    </>
  );
}
