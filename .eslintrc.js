module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript/base',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    node: true,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['./src'],
      },
    },
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'import/no-cycle': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      {
        before: false,
        after: true,
        overrides: { arrow: { before: true, after: true } },
      },
    ],
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling'], 'index'],
        'newlines-between': 'always',
      },
    ],
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'max-len': ['error', { code: 120, ignoreComments: true }],
    'indent': ['error', 2, { ObjectExpression: 1 }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-empty-function': ['error', { 'allow': ['constructors'] }],
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
  },
};