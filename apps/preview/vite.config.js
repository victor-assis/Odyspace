import { defineConfig } from 'vite';
import { resolve } from 'path';
import { routes } from "./shared/js/routes";

const components = {
  '#header': 'shared/components/header.html',
  '#footer': 'shared/components/footer.html',
  '#aside': 'shared/components/aside.html',
};

export default defineConfig({
  base: './',
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ["dist/tokens"],
      },
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    strictPort: true,
    historyApiFallback: true,
  },
  build: {
    rollupOptions: {
      input: {
        ...Object.fromEntries(
          Object.entries(routes).map(([key, value]) => [key, resolve(__dirname, value)])
        ),
        ...Object.fromEntries(
          Object.entries(components).map(([key, value]) => [key, resolve(__dirname, value)])
        ),
      }
    },
    output: {
      entryFileNames: 'assets/[name]-[hash].js',
      chunkFileNames: 'assets/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash][extname]',
    },
    emptyOutDir: true,
    outDir: 'dist/preview',
  },
});