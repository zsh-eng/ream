import { setupThemeManagement } from '@/lib/shell';
import ReactDOM from 'react-dom/client';
import '~/assets/main.css';
import SidePanelApp from './side-panel-app';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'side-panel',
      position: 'inline',
      anchor: 'body',
      onMount(container) {
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

    console.log('executing main');
    ui.mount();
  },
});
