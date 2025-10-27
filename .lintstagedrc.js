/** @type {import('lint-staged').Config} */
export default {
  '*.{css,scss,less}': ['prettier --write', 'stylelint --fix'],
  'vivy-vue/**/*.vue': ['prettier --write', 'eslint --config vivy-vue/eslint.config.js --fix', 'stylelint --fix'],
  'vivy-vue/**/*.{js?(x),ts?(x)}': ['prettier --write', 'eslint --config vivy-vue/eslint.config.js --fix'],
  'vivy-react/**/*.{js?(x),ts?(x)}': ['prettier --write', 'eslint --config vivy-react/eslint.config.js --fix'],
  '!(vivy-vue|vivy-react)/**/*.{js?(x),ts?(x)}': ['prettier --write', 'eslint --fix'],
}
