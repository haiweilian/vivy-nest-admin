import { defineConfig } from 'taze'

export default defineConfig({
  mode: 'latest',
  recursive: true,
  exclude: [
    'typescript',
    // nest
    'mime',
    'camelcase',
    'decamelize',
    // react
    'cropperjs',
    'tailwindcss',
  ],
})
