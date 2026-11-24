import js from '@eslint/js'
import configPrettier from 'eslint-config-prettier'
import pluginImport from 'eslint-plugin-import-x'
import pluginNode from 'eslint-plugin-n'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
import pluginPromise from 'eslint-plugin-promise'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * 默认配置：语言环境 + JS 推荐规则 + Node/Promise/Import 插件 + TypeScript 规则
 */
export default [
  // https://eslint.org/docs/latest/use/configure/language-options
  {
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.builtin,
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
    },
  },

  // https://eslint.org/docs/latest/rules
  js.configs.recommended,

  // https://github.com/eslint-community/eslint-plugin-promise
  {
    plugins: {
      promise: pluginPromise,
    },
    rules: {
      'promise/param-names': 'error',
    },
  },

  // https://github.com/eslint-community/eslint-plugin-n
  {
    plugins: {
      node: pluginNode,
    },
    rules: {
      'node/handle-callback-err': ['error', '^(err|error)$'],
      'node/no-callback-literal': 'error',
      'node/no-deprecated-api': 'error',
      'node/no-exports-assign': 'error',
      'node/no-new-require': 'error',
      'node/no-path-concat': 'error',
      'node/process-exit-as-throw': 'error',
    },
  },

  // https://github.com/un-ts/eslint-plugin-import-x
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      'import/export': 'error',
      'import/first': 'error',
      'import/no-absolute-path': 'error',
      'import/no-duplicates': 'error',
      'import/no-named-default': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/order': [
        'error',
        {
          pathGroups: [
            { pattern: '@/**', group: 'external', position: 'after' },
            { pattern: '#/**', group: 'external', position: 'after' },
            { pattern: '~/**', group: 'external', position: 'after' },
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  // https://github.com/prettier/eslint-plugin-prettier
  pluginPrettier,

  // https://typescript-eslint.io/getting-started
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-undef': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
          vars: 'all',
        },
      ],
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
          classes: false,
          variables: true,
        },
      ],
      'no-useless-constructor': 'off',
      'preserve-caught-error': 'off',

      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
  },

  // https://github.com/prettier/eslint-config-prettier
  configPrettier,
]
