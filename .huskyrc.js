// Configuration for Husky
module.exports = {
  hooks: {
    'pre-commit': 'npx lint-staged --allow-empty',
  },
};
