module.exports = {
  root: true,
  extends: '@bfehub/eslint-config-typescript',
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@/modules/**',
            group: 'parent',
            position: 'after',
          },
          {
            pattern: '@/entities/**',
            group: 'parent',
            position: 'after',
          },
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
}
