import App from '@/entrypoints/main.content/App';
import { DropdownProvider } from '@/hooks/active-dropdown-context';
import { parseArticle } from '@/lib/parse-article';
import { setupThemeManagement } from '@/lib/shell';
import ReactDOM from 'react-dom/client';
import { ContentScriptContext } from 'wxt/client';
import '~/assets/main.css';
import { PortalTargetContext } from '~/hooks/portal-target-context.tsx';

async function createReaderUI(ctx: ContentScriptContext) {
  const originalStylesheets = captureOriginalStylesheets();
  const article = parseArticle();

  // TODO: Nicer toast for failing to parse the given article
  if (!article) {
    alert('Failed to parse article');
    return;
  }

  document.body.style.display = 'none';
  return createShadowRootUi(ctx, {
    name: 'reader-mode',
    position: 'inline',
    anchor: 'body',
    append: 'before',
    onMount: (container, shadow) => {
      const wrapper = document.createElement('div');
      const portalTarget = shadow.querySelector('body');

      if (!portalTarget) {
        throw new Error('Portal target not found');
      }

      const observer = setupThemeManagement(portalTarget);
      const root = ReactDOM.createRoot(wrapper);

      root.render(
        <PortalTargetContext.Provider value={portalTarget}>
          <DropdownProvider>
            <App article={article} />
          </DropdownProvider>
        </PortalTargetContext.Provider>
      );

      container.append(wrapper);
      return { root, wrapper, observer };
    },
    onRemove: async (elements) => {
      const observer = await elements?.observer;
      if (observer) {
        observer.disconnect();
      }
      elements?.root.unmount();
      elements?.wrapper.remove();
      restoreOriginalStylesheets(originalStylesheets);
      document.body.style.display = '';
    },
  });
}

function captureOriginalStylesheets() {
  return [
    ...Array.from(document.getElementsByTagName('style')),
    ...Array.from(document.getElementsByTagName('link')).filter(
      (link) => link.rel === 'stylesheet'
    ),
  ].map((element) => {
    const clone = element.cloneNode(true) as HTMLStyleElement | HTMLLinkElement;
    element.remove();
    return clone;
  });
}

function restoreOriginalStylesheets(stylesheets: HTMLStyleElement[]) {
  stylesheets.forEach((style) => {
    document.head.appendChild(style);
  });
}

export default defineContentScript({
  registration: 'runtime',
  matches: [],
  cssInjectionMode: 'ui',

  async main(ctx) {
    let ui: Awaited<ReturnType<typeof createShadowRootUi>> | undefined;

    browser.runtime.onMessage.addListener((message) => {
      if (message.action === 'unmount') {
        ui?.remove();
        return;
      } else if (message.action === 'mount') {
        createReaderUI(ctx).then((newUi) => {
          ui = newUi;
          ui?.mount();
        });
        return;
      } else if (message.action === 'content-script-loaded') {
        return Promise.resolve(true);
      }
    });
  },
});
