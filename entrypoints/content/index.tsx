import { DropdownProvider } from '@/hooks/active-dropdown-context';
import { THEME_ATTRIBUTES, ThemeAttribute } from '@/lib/theme';
import { Readability } from '@mozilla/readability';
import ReactDOM from 'react-dom/client';
import { storage } from 'wxt/storage';
import '~/assets/main.css';
import App from '~/entrypoints/content/App.tsx';
import { PortalTargetContext } from '~/hooks/portal-target-context.tsx';

async function applyThemeAttributes(portalTarget: HTMLElement) {
  for (const attribute of THEME_ATTRIBUTES) {
    const value = await storage.getItem(`local:${attribute}`);
    if (typeof value === 'string') {
      portalTarget.setAttribute(attribute, value);
    }
  }
}

export default defineContentScript({
  matches: ['*://*/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    let ui: Awaited<ReturnType<typeof createShadowRootUi>>;
    let originalStylesheets: HTMLStyleElement[] = [];

    const create = async () => {
      originalStylesheets = [
        ...Array.from(document.getElementsByTagName('style')),
        ...Array.from(document.getElementsByTagName('link')).filter(
          (link) => link.rel === 'stylesheet'
        ),
      ].map((element) => {
        const clone = element.cloneNode(true) as
          | HTMLStyleElement
          | HTMLLinkElement;
        element.remove();
        return clone;
      });

      // parse() works by modifying the DOM.
      const documentClone = document.cloneNode(true) as Document;
      const article = new Readability(documentClone).parse();

      document.body.style.display = 'none';
      // await new Promise((resolve) => setTimeout(resolve, 300));

      // const turndown = new TurndownService();
      // console.log(article?.content)
      // const markdown = turndown.turndown(article?.content ?? '');
      ui = await createShadowRootUi(ctx, {
        name: 'reader-mode',
        position: 'inline',
        anchor: 'body',
        append: 'before',
        onMount: (container, shadow) => {
          // Don't mount react app directly on <body>
          const wrapper = document.createElement('div');

          // To allow portals to target the shadow root
          // See https://wxt.dev/guide/resources/faq.html#my-component-library-doesn-t-work-in-content-scripts
          const portalTarget = shadow.querySelector('body');
          if (!portalTarget) {
            throw new Error('Portal target not found');
          }

          applyThemeAttributes(portalTarget);
          const persistThemeChange = (mutationsList: MutationRecord[]) => {
            for (const mutation of mutationsList) {
              if (mutation.type !== 'attributes') {
                return;
              }

              if (!mutation.attributeName) {
                return;
              }

              if (
                !THEME_ATTRIBUTES.includes(
                  mutation.attributeName as ThemeAttribute
                )
              ) {
                return;
              }

              const newValue = portalTarget.getAttribute(
                mutation.attributeName ?? ''
              );
              if (!newValue) {
                return;
              }

              storage.setItem(`local:${mutation.attributeName}`, newValue);
            }
          };

          const observer = new MutationObserver(persistThemeChange);
          const config = { attributes: true };
          observer.observe(portalTarget, config);

          const root = ReactDOM.createRoot(wrapper);
          root.render(
            <PortalTargetContext.Provider value={portalTarget}>
              <DropdownProvider>
                <App
                  html={article?.content}
                  title={article?.title}
                  author={article?.byline}
                />
              </DropdownProvider>
            </PortalTargetContext.Provider>
          );

          container.append(wrapper);

          return { root, wrapper };
        },
        onRemove: (elements) => {
          elements?.root.unmount();
          elements?.wrapper.remove();
          originalStylesheets.forEach((style) => {
            document.head.appendChild(style);
          });
          document.body.style.display = '';
        },
      });

      ui.mount();
    };

    // Add message listener for unmounting
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'unmount') {
        console.log('unmount');
        ui.remove();
        return true;
      } else if (message.action === 'mount') {
        console.log('mount');
        create();
        return true;
      }
    });
  },
});
