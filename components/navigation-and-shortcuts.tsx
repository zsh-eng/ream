import KeyboardShortcutMenu from '@/components/keyboard-shortcut-menu';
import { NavigationBar } from '@/components/navigation-bar';
import { useFontSize } from '@/hooks/use-font-size';
import {
  useFontSizeKeyboardShortcut,
  useScrollKeyboardShortcut,
  useToggleKeyboardShortcutMenu,
  useToggleNavBarAutoHide,
} from '@/hooks/use-keyboard-shortcut';
import { FontSize } from '@/lib/fonts';
import { useContext } from 'react';
import { PortalTargetContext } from '~/hooks/portal-target-context.tsx';
import { useTheme } from '~/hooks/use-theme';

type NavigationAndShortcutsProps = {
  /** Additional action buttons to render in the navigation bar */
  renderActionButtons?: () => React.ReactNode;
};

// Groups the keyboard shortcuts and navigation bar functionality
// It makes sense to have them together because many of the keyboard shortcuts
// "trigger" the navigation bar
// Instead of having them go through the app component,
// group them together so that we can reuse this theming logic.
export default function NavigationAndShorcutsContainer({
  renderActionButtons,
}: NavigationAndShortcutsProps) {
  const portalTarget = useContext(PortalTargetContext);

  useFontSizeKeyboardShortcut(portalTarget);
  useScrollKeyboardShortcut(portalTarget);
  const { isNavBarAutoHide } = useToggleNavBarAutoHide();
  const { isKeyboardShortcutMenuVisible } = useToggleKeyboardShortcutMenu();
  const { setSize, getPreviousSize, getNextSize } = useFontSize(portalTarget);
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
        renderActionButtons={renderActionButtons}
      />
    </>
  );
}
