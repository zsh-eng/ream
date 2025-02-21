import { THEME_ATTRIBUTES, ThemeAttribute } from '@/lib/theme';
import { storage } from 'wxt/storage';
import '~/assets/main.css';

async function applyThemeAttributes(portalTarget: HTMLElement) {
  for (const attribute of THEME_ATTRIBUTES) {
    const value = await storage.getItem(`local:${attribute}`);
    if (typeof value === 'string') {
      portalTarget.setAttribute(attribute, value);
    }
  }
}

export async function setupThemeManagement(portalTarget: HTMLElement) {
  await applyThemeAttributes(portalTarget);

  const persistThemeChange = (mutationsList: MutationRecord[]) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName &&
        THEME_ATTRIBUTES.includes(mutation.attributeName as ThemeAttribute)
      ) {
        const newValue = portalTarget.getAttribute(mutation.attributeName);
        if (newValue) {
          storage.setItem(`local:${mutation.attributeName}`, newValue);
        }
      }
    }
  };

  const observer = new MutationObserver(persistThemeChange);
  observer.observe(portalTarget, { attributes: true });
  return observer;
}
