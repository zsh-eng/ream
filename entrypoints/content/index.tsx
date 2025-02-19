import { Readability } from '@mozilla/readability';
import ReactDOM from 'react-dom/client';
import '~/assets/main.css';
import App from '~/entrypoints/content/App.tsx';
import { PortalTargetContext } from '~/hooks/portal-target-context.tsx';

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
          portalTarget?.setAttribute('data-theme', 'flexoki-dark');

          const root = ReactDOM.createRoot(wrapper);
          root.render(
            <PortalTargetContext.Provider value={portalTarget}>
              <App
                html={article?.content}
                title={article?.title}
                author={article?.byline}
              />
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
