import typescript from '@bfehub/eslint-config-typescript'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...typescript,
  {
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
  },
  {
    ignores: [
      '**/lib/',
      '**/dist/',
      '**/logs/',
      '**/.umi/',
      '**/.umi-production/',
      '**/.vitepress/cache/',
      'vivy-modules/vivy-system/types/mapper.d.ts',
    ],
  },
]
