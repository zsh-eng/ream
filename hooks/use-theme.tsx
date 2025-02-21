import { PortalTargetContext } from '@/hooks/portal-target-context';
import {
  DEFAULT_THEME_ATTRIBUTES,
  THEME_ATTRIBUTES,
  ThemeAttribute
} from '@/lib/theme';
import { useContext, useEffect, useState } from 'react';

export function useTheme() {
  const portalTarget = useContext(PortalTargetContext);
  const [themeAttributes, setThemeAttributes] = useState<
    Record<ThemeAttribute, string>
  >(DEFAULT_THEME_ATTRIBUTES);

  useEffect(() => {
    if (!portalTarget) {
      return;
    }

    const watchThemeChange = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type !== 'attributes') {
          return;
        }

        const attributeName = mutation.attributeName;
        if (!attributeName) {
          return;
        }

        if (!THEME_ATTRIBUTES.includes(attributeName as ThemeAttribute)) {
          return;
        }

        const newValue = portalTarget.getAttribute(attributeName);
        if (!newValue) {
          return;
        }

        setThemeAttributes((prev) => ({
          ...prev,
          [attributeName]: newValue,
        }));
      }
    };

    const observer = new MutationObserver(watchThemeChange);
    const config = { attributes: true };
    observer.observe(portalTarget, config);

    return () => {
      observer.disconnect();
    };
  }, [portalTarget]);

  return themeAttributes;
}
