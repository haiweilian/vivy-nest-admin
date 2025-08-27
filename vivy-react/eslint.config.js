import react from '@bfehub/eslint-config-react'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...react,
  {
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
  },
  {
    ignores: ['**/dist/', '**/.umi/', '**/.umi-production/'],
  },
]
