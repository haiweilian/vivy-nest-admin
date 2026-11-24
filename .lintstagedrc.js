/** @type {import('lint-staged').Config} */
export default {
  '*.{css,scss,less}': ['prettier --write', 'stylelint --fix'],
  'vivy-react/**/*.{js?(x),ts?(x)}': ['prettier --write', 'eslint --config vivy-react/eslint.config.js --fix'],
  '!(vivy-react)/**/*.{js?(x),ts?(x)}': ['prettier --write', 'eslint --fix'],
}
