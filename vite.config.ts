import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsInlineLimit: 0,
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  publicDir: 'images',
});
