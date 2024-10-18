// Configuration for ESLint
module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base', // Use the Airbnb Style Guide
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      },
    },
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    '@typescript-eslint/array-type': ['error', { default: 'generic' }], // Enforce array types to use generic `Array<type>` syntax.
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-this-alias': 'off', // used by ExtJS
    '@typescript-eslint/no-explicit-any': 'off', // Allow us to use `any` type. USE SPARINGLY.
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/no-var-requires': 'off', // Conflicts with webpack configs.
    '@typescript-eslint/semi': 'off', // Conflicts with Prettier, set to 'true' in .prettierrc.js

    'class-methods-use-this': 'off', // Allow classes to have functions that don't reference `this`
    'no-underscore-dangle': 'off',
    'array-callback-return': 'off', // Not all arrays require a callback (mainly used with Map callbacks)
    'comma-dangle': 'off', // Conflicts with Prettier, set to 'es5' in .prettierrc.js
    'no-undef': 'off', // TypeScript handles this
    'no-loop-func': 'off', // There's a few functions that are declared inside an object declaration, that is within a for loop
    'consistent-return': 'off', // Conflicts with no-useless-return
    'linebreak-style': ['error', 'unix'],
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],
    'no-unreachable': 'error',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'no-new': 'off',
    'no-param-reassign': ['warn'],
    'prefer-destructuring': ['warn'],
    'no-unused-expressions': 'off',
    'new-cap': ['warn'],
    radix: 'off',
    'no-shadow': 'off',
    'func-names': 'off',
    'prefer-rest-params': 'off',
    'use-isnan': 'error',
    'no-restricted-globals': 'off',
    // 'capitalized-comments': ['warn', 'always', {
    //     'line': {
    //         'ignoreInlineComments': true,
    //         'ignoreConsecutiveComments': true,
    //         'ignorePattern': 'lineignore'
    //     }
    // }],
    // 'multiline-comment-style': ['warn', 'starred-block'],
    'import/no-cycle': 'off',
    'import/no-unresolved': 'off', //
    'import/prefer-default-export': 'off', // Keep imports in a consistent style
    'import/extensions': [
      // Prevent ESLint errors about missing file extensions.
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        mjs: 'never',
        '': 'never',
      },
    ],
  },
  overrides: [
    {
      // Enable `@typescript-eslint/explicit-function-return-type` rule specifically for TypeScript files.
      files: ['*.ts', '.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/camelcase': 'warn',
      },
    },
  ],
};
