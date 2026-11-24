import { defineConfig } from 'vitest/config'
import config from './vitest.config.js'

export default defineConfig({
  ...config,
  test: {
    ...config.test,
    include: ['vivy-modules/**/test/**/*.e2e-spec.ts'],
    coverage: {
      ...config.test.coverage,
      reportsDirectory: './coverage/e2e',
    },
  },
})
