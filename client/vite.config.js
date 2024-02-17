import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [
    react(),
    reactRefresh(),
    nodePolyfills(), // Adding node polyfills plugin
  ],
  resolve: {
    alias: {
      // Ensure that you install 'rollup-plugin-polyfill-node' package
      'events': 'rollup-plugin-node-polyfills/polyfills/events',
    },
  },
  define: {
    global: {},
  },
});