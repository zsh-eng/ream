import { useContext, useEffect } from 'react';
import { ActiveDropdownContext } from '~/hooks/active-dropdown-context';

export function useThemeShortcut(
  attributeToTarget: string,
  keyToTrigger: string
) {
  const { activeDropdown, setActiveDropdown } = useContext(
    ActiveDropdownContext
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === keyToTrigger) {
        setActiveDropdown(
          activeDropdown === attributeToTarget ? null : attributeToTarget
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDropdown, attributeToTarget, keyToTrigger]);
}
