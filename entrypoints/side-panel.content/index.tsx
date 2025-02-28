import { setupThemeManagement } from '@/lib/shell';
import ReactDOM from 'react-dom/client';
import '~/assets/main.css';
import SidePanelApp from './side-panel-app';

export default defineContentScript({
  registration: 'runtime',
  matches: [],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'side-panel',
      position: 'inline',
      anchor: 'body',
      onMount(container, shadow) {
        const style = document.createElement('style');
        style.textContent = `
          :host {
            font-size: 16px !important;
          }
        `;
        shadow.appendChild(style);

        container.style.position = 'relative';
        container.style.zIndex = '100000';

        const app = document.createElement('div');
        const root = ReactDOM.createRoot(app);

        const observer = setupThemeManagement(container);
        root.render(<SidePanelApp />);

        container.append(app);
        return { root, observer };
      },
      onRemove: async (elements) => {
        elements?.root.unmount();
        const observer = await elements?.observer;
        if (observer) {
          observer.disconnect();
        }
      },
    });

    ui.mount();

    // Unlike the main content script, we can keep the side panel open
    // because we aren't hiding the main document.
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === 'side-panel-content-script-loaded') {
        sendResponse(true);
      }
    });
  },
});
