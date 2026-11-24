import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    swc.vite({
      module: { type: 'es6' },
      jsc: { target: 'es2023' },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    include: ['vivy-modules/**/src/**/*.spec.ts', 'vivy-common/**/src/**/*.spec.ts'],
    setupFiles: ['./test/setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['vivy-modules/**/src/**/*.ts', 'vivy-common/**/src/**/*.ts'],
      exclude: ['**/*.spec.ts'],
      reporter: ['text-summary', 'html', 'lcov'],
    },
  },
})
