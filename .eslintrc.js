'use strict';
module.exports = {
  extends: ['eslint:recommended', 'eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    browser: 'readonly',
    chrome: 'readonly',
  },
  rules: {
    strict: ['error', 'global'],
    'no-unused-vars': ['error', { vars: 'local' }],
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    curly: ['error', 'multi-line'],
    'no-var': 'error',
    'no-func-assign': 'off',
    'no-inner-declarations': 'off',
  },
};
