import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['activeTab', 'scripting', 'storage'],
    action: {}, // to allow us to trigger on click
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
