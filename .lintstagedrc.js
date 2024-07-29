module.exports = {
  'package.json': ['prettier --write'],
  '*.{js?(x),ts?(x)}': ['eslint --fix', 'prettier --write'],
}
