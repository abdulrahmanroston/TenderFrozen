import { defineConfig } from 'vite';

export default defineConfig({
  base: '/TenderFrozen/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'login.html',
        pos: 'pos.html',
        products: 'products.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});