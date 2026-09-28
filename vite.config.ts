import path from 'path';

import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';

export default defineConfig({
  base: '/capacita-saude/',

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});