import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: ({ browser }) => ({
    name: 'Ream',
    permissions: ['activeTab', 'storage', 'scripting'],
    action: {}, // to allow us to trigger on click
    omnibox: {
      keyword: 'ream'
    },
    web_accessible_resources: [
      {
        resources: ['content-scripts/content.js'],
        matches: ['<all_urls>'],
      },
      {
        resources: ['content-scripts/content.css'],
        matches: ['<all_urls>'],
      },
    ],
    browser_specific_settings:
      browser === 'firefox'
        ? {
            gecko: {
              id: 'ream@ream.zsheng.app',
            },
          }
        : undefined,
    commands: {
      _execute_action: {
        suggested_key: {
          default: 'Ctrl+Shift+Y',
          mac: 'Command+Shift+Y',
        },
      },
    },
  }),
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
