import eslintReact from '@eslint-react/eslint-plugin'
import configPrettier from 'eslint-config-prettier'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import base from './index.js'

/**
 * React 配置：在默认配置基础上叠加 React 相关规则
 */
export default [
  ...base,

  // https://github.com/Rel1cx/eslint-react
  eslintReact.configs.recommended,

  // https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
  pluginReactHooks.configs.flat.recommended,

  {
    rules: {
      'react-hooks/globals': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      '@eslint-react/exhaustive-deps': 'off',
      '@eslint-react/dom-no-flush-sync': 'off',
    },
  },

  // https://github.com/prettier/eslint-config-prettier
  configPrettier,
]
