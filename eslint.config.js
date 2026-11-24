import config from '@internal/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...config,
  {
    ignores: [
      '**/lib/',
      '**/dist/',
      '**/logs/',
      '**/public/',
      '**/assets/',
      '**/.umi/',
      '**/.umi-production/',
      '**/.vitepress/cache/',
      'vivy-modules/vivy-system/types/mapper.d.ts',
    ],
  },
]
