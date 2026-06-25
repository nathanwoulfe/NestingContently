import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'nesting-contently.js',
    },
    outDir: '../wwwroot',
    emptyOutDir: false,
    sourcemap: true,
    rolldownOptions: {
      external: [/^@umbraco-cms\//],
    },
  },
});
