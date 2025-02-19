import type { Preset } from '@vite-pwa/assets-generator/config';
import { defineConfig } from '@vite-pwa/assets-generator/config';

const preset: Preset = {
  transparent: {
    sizes: [16, 24, 48, 96, 128],
    favicons: [[48, 'public/icon.svg']],
  },
  maskable: {
    sizes: [],
  },
  apple: {
    sizes: [],
  },
};

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset,
  images: ['public/icon.svg'],
});
