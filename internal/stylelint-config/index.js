// https://stylelint.io/user-guide/get-started
/** @type {import('stylelint').Config} */
export default {
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
      rules: {
        'import-notation': 'string',
      },
    },
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less',
      rules: {
        'import-notation': 'string',
      },
    },
  ],
  extends: [
    // https://github.com/ota-meshi/stylelint-config-html
    'stylelint-config-html',
    // https://github.com/stylelint/stylelint-config-standard
    'stylelint-config-standard',
    // https://github.com/stormwarning/stylelint-config-recess-order
    'stylelint-config-recess-order',
    // https://github.com/prettier/stylelint-prettier
    'stylelint-prettier/recommended',
  ],
  plugins: [
    // https://github.com/hudochenkov/stylelint-order
    'stylelint-order',
  ],
  rules: {
    'no-empty-source': null,
    'unit-no-unknown': null,
    'at-rule-no-unknown': null,
    'value-no-vendor-prefix': null,
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global', 'slotted'],
      },
    ],
  },
}
