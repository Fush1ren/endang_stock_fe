module.exports = {
    parser: 'vue-eslint-parser',
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'plugin:vue/recommended',
    ],
    env: {
      node: true,
      es6: true,
    },
  };