import { PortalTargetContext } from '@/hooks/portal-target-context';
import { DEFAULT_FONT } from '@/lib/fonts';
import {
    DEFAULT_COLOR_PALETTE,
    THEME_ATTRIBUTES,
    ThemeAttribute,
} from '@/lib/theme';
import { useContext } from 'react';

const DEFAULT_THEME_ATTRIBUTES: Record<ThemeAttribute, string> = {
  'data-color-palette': DEFAULT_COLOR_PALETTE,
  'data-headings': DEFAULT_FONT,
  'data-body': DEFAULT_FONT,
};

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
