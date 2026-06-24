import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'nesting-contently.js',
    },
    // StaticWebAssetBasePath (App_Plugins/NestingContently) already maps wwwroot/
    // to /App_Plugins/NestingContently/, so output straight into wwwroot/.
    outDir: '../wwwroot',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [/^@umbraco-cms\//],
    },
  },
});
