import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['activeTab', 'storage', 'scripting'],
    action: {}, // to allow us to trigger on click
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
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
