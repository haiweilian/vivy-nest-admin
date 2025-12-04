import { defineConfig } from 'taze'

export default defineConfig({
  mode: 'latest',
  recursive: true,
  exclude: [
    // nest
    'mime',
    'chokidar',
    'camelcase',
    'decamelize',
    // react
    'antd',
    'cropperjs',
    'tailwindcss',
  ],
})
