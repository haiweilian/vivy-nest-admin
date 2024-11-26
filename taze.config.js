import { defineConfig } from 'taze'

export default defineConfig({
  mode: 'latest',
  recursive: true,
  exclude: ['mime', 'camelcase', 'decamelize'],
})
