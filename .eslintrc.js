/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    logger: 'readonly'
  },
  extends: [
    'plugin:vue/vue3-essential', // 使用 Vue 3 的基本规则集
    'eslint:recommended', // 使用 ESLint 推荐的核心规则集
    '@vue/eslint-config-typescript', // 对 ts 的支持
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true
    }
  },
  parser: 'vue-eslint-parser',
  rules: {
    'prettier/prettier': [
      // https://github.com/prettier/eslint-plugin-prettier#options
      'error',
      {
        singleQuote: true,
        printWidth: 200,
        trailingComma: 'none'
      }
    ],
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    // ESLint https://eslint.nodejs.cn/docs/latest/rules
    quotes: ['error', 'single']
  },
  overrides: [
    {
      files: ['*.html'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
            vueIndentScriptAndStyle: true
          }
        ]
      },
      processor: 'vue/.vue'
    }
  ]
};
