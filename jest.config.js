// Configuration for Jest
// https://basarat.gitbooks.io/typescript/docs/testing/jest.html
// https://blog.logrocket.com/testing-with-jest-from-zero-to-hero-85ce0e9cc953/
module.exports = {
  preset: 'ts-jest',
  prettierPath: './node_modules/prettier',
  // roots: ['<rootDir>', '<rootDir>/e2e/'],
  testMatch: ['**/tests/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  testTimeout: 30000,
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: false,
    },
  },
  setupFilesAfterEnv: ['jest-extended', 'jest-chain'],
};
