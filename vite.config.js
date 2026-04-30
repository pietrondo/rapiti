import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  base: './',
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return 'img/[name]-[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'fonts/[name]-[hash][extname]';
          }
          if (ext === 'css') {
            return 'css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    minify: 'esbuild',
    esbuildOptions: {
      drop: ['console', 'debugger'],
    },
  },
  
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true,
    },
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@effects': path.resolve(__dirname, 'src/effects'),
      '@areas': path.resolve(__dirname, 'src/areas'),
      '@sprites': path.resolve(__dirname, 'src/sprites'),
      '@render': path.resolve(__dirname, 'src/render'),
      '@engine': path.resolve(__dirname, 'src/engine'),
      '@story': path.resolve(__dirname, 'src/story'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@game': path.resolve(__dirname, 'src/game'),
    },
  },
  
  esbuild: {
    target: 'es2020',
  },
  
  optimizeDeps: {
    include: [],
  },
});
