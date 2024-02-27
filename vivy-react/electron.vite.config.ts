import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import copy from 'rollup-plugin-copy'

// https://cn.electron-vite.org/config/
export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      copy({
        flatten: false,
        targets: [{ src: 'electron/resources/**', dest: 'dist' }],
      }),
    ],
    build: {
      lib: {
        entry: findLibEntry(__dirname, 'main'),
      },
      outDir: 'dist/main',
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: findLibEntry(__dirname, 'preload'),
      },
      outDir: 'dist/preload',
    },
  },
})

function findLibEntry(root: string, scope: string): string {
  for (const name of ['index', scope]) {
    for (const ext of ['js', 'ts', 'mjs', 'cjs']) {
      const entryFile = path.resolve(root, 'electron', scope, `${name}.${ext}`)
      if (fs.existsSync(entryFile)) {
        return entryFile
      }
    }
  }
  return ''
}
