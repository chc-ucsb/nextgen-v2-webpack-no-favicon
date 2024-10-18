// Configuration for Lint-Staged
module.exports = {
  '*.js': [
    // Run through Prettier
    'npx prettier --write',
    'npx eslint --fix',
  ],

  '*.ts': [
    // Run through Prettier
    'npx prettier --write',
    'npx eslint --fix',
  ],

  '*.json': [
    // Run through Prettier
    'npx prettier --write',
    'npx eslint --fix',
  ],
};
