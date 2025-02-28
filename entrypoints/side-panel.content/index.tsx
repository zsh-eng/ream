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
        container.style.zIndex = '100';
        const app = document.createElement('div');
        const root = ReactDOM.createRoot(app);
        root.render(<SidePanelApp />);

        container.append(app);
        return { root };
      },
      onRemove(elements) {
        elements?.root.unmount();
      },
    });

    console.log('executing main');
    ui.mount();
  },
});
