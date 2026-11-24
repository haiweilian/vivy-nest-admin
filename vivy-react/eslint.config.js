import react from '@internal/eslint-config/react'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...react,
  {
    ignores: ['**/dist/', '**/.umi/', '**/.umi-production/'],
  },
]
