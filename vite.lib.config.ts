import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ['src/design-system', 'src/components/onganda'],
      outDir: 'dist/package',
      entryRoot: 'src',
      tsconfigPath: './tsconfig.app.json',
    }),
  ],
  resolve: {
    alias: {
      '@onganda/design-system': path.resolve(__dirname, './src/design-system/index.ts'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/design-system/index.ts'),
        core: path.resolve(__dirname, 'src/design-system/core.ts'),
        charts: path.resolve(__dirname, 'src/design-system/charts.ts'),
        editors: path.resolve(__dirname, 'src/design-system/editors.ts'),
        ai: path.resolve(__dirname, 'src/design-system/ai.ts'),
        maps: path.resolve(__dirname, 'src/design-system/maps.ts'),
        sites: path.resolve(__dirname, 'src/design-system/sites.ts'),
      },
      name: 'OngandaDesignSystem',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'framer-motion',
        'leaflet',
        'recharts',
        'pptxgenjs',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
          'framer-motion': 'FramerMotion',
          leaflet: 'Leaflet',
          recharts: 'Recharts',
        },
        // Extract CSS to dist/style.css
        assetFileNames: assetInfo => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return assetInfo.name ?? 'assets/[name][extname]';
        },
      },
    },
    cssCodeSplit: false,
    outDir: 'dist/package',
    emptyOutDir: true,
    sourcemap: true,
  },
});
