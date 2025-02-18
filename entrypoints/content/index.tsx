import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './style.css';

export default defineContentScript({
  matches: ['*://*/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    let ui: Awaited<ReturnType<typeof createShadowRootUi>>;
    const create = async () => {
      ui = await createShadowRootUi(ctx, {
        name: 'react-example',
        position: 'inline',
        anchor: 'body',
        append: 'before',
        onMount: (container) => {
          document.body.style.display = 'none';
          // Don't mount react app directly on <body>
          const wrapper = document.createElement('div');
          container.append(wrapper);

          const root = ReactDOM.createRoot(wrapper);
          root.render(<App />);
          return { root, wrapper };
        },
        onRemove: (elements) => {
          elements?.root.unmount();
          elements?.wrapper.remove();
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
