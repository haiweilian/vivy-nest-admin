/** @type {import('lint-staged').Config} */
export default {
  '*.{js?(x),ts?(x)}': ['eslint --fix', 'prettier --write'],
  '*.{css,scss,less}': ['stylelint --fix', 'prettier --write'],
}
