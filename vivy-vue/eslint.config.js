import vue from '@bfehub/eslint-config-vue'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...vue,
  {
    rules: {
      'no-prototype-builtins': 'off',
      'node/no-callback-literal': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
  },
  {
    ignores: ['**/dist/', '**/public/', '**/assets/'],
  },
]
