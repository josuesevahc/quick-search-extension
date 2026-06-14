import { defineConfig } from 'vite';
import { resolve } from 'path';
import { existsSync, rmSync, renameSync, readFileSync } from 'fs';
import { getManifest } from './src/manifest/manifest.template';

const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8')) as {
  version: string;
};

export default defineConfig({
  plugins: [
    {
      name: 'quick-search-manifest',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: JSON.stringify(getManifest(packageJson.version), null, 2),
        });
      },
      closeBundle() {
        const outputDir = resolve(__dirname, 'dist');
        const htmlMoves = [
          ['src/popup/popup.html', 'popup.html'],
          ['src/options/options.html', 'options.html'],
        ];

        htmlMoves.forEach(([from, to]) => {
          const fromPath = resolve(outputDir, from);
          const toPath = resolve(outputDir, to);
          if (existsSync(fromPath)) {
            renameSync(fromPath, toPath);
          }
        });

        const generatedSrcDir = resolve(outputDir, 'src');
        if (existsSync(generatedSrcDir)) {
          rmSync(generatedSrcDir, { recursive: true, force: true });
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.html'),
        options: resolve(__dirname, 'src/options/options.html'),
        background: resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
