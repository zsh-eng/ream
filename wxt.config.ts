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
      keyword: 'ream',
    },
    web_accessible_resources: [
      {
        resources: ['content-scripts/main.js'],
        matches: ['<all_urls>'],
      },
      {
        resources: ['content-scripts/main.css'],
        matches: ['<all_urls>'],
      },
      {
        resources: ['content-scripts/side-panel.css'],
        matches: ['<all_urls>'],
      },
      {
        resources: ['content-scripts/side-panel.js'],
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
      _execute_action: {},
      'toggle-ream': {
        description: 'Toggle Ream',
        suggested_key: {
          default: 'Ctrl+Shift+O',
          mac: 'Command+Shift+O',
        },
      },
      'toggle-save': {
        description: 'Toggle save article',
        suggested_key: {
          default: 'Ctrl+Shift+U',
          mac: 'Command+Shift+U',
        },
      },
      'toggle-sidepanel': {
        description: 'Toggle side panel',
        suggested_key: {
          default: 'Ctrl+Shift+P',
          mac: 'Command+Shift+P',
        },
      },
    },
  }),
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
