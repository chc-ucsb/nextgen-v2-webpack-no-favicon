/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server/lib/Server');
const yargs = require('yargs');

/**
 * Dictionary of valid dev modes.
 * @type {Record<string, string>}
 */
const modeDict = {
  dev: 'development',
  stage: 'stage',
  development: 'development',
};

/**
 * Array of valid dev modes.
 * @type {string[]}
 */
const modes = Object.keys(modeDict);

/**
 * Function that takes a Webpack configuration and changes the optimization options for a better development experience (no minify/mangling).
 * @param webpackConfig
 * @returns {*}
 */
const configureForDevelopment = (webpackConfig) => {
  const _config = webpackConfig;
  _config.devtool = 'source-map';
  _config.devServer = {
    clientLogLevel: 'warning',
    open: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  };

  return _config;
};

/**
 * Start a development server at port 8080
 * @param {string} mode
 * @param {string} project
 * @returns {Promise<void>}
 */
async function startDev(mode, project) {
  const webpackArgs = {
    projectName: project,
    projectDir: project,
  };

  let webpackConfig;

  // Get the correct Webpack configuration
  switch (mode) {
    case 'stage':
      webpackConfig = configureForDevelopment(await require('../webpack.config.prod')(webpackArgs));
      break;
    case 'development':
    default:
      webpackConfig = await require('../webpack.config.dev')(webpackArgs);
      break;
  }

  const compiler = Webpack(webpackConfig);

  // Set extra dev server options
  const devServerOptions = {
    ...webpackConfig.devServer,
    open: true,
    stats: {
      colors: true,
    },
  };
  const server = new WebpackDevServer(compiler, devServerOptions);
  server.listen(8080, '127.0.0.1', () => {
    console.log('Starting server on http://localhost:8080');
  });
}

yargs
  .scriptName('NextGen Dev Server')
  .usage('$0 <cmd> [args]')

  .command(
    '$0',
    'Start up a dev server for a NextGen project.',
    (yargs) => {
      yargs
        .options({
          mode: {
            alias: 'm',
            choices: modes,
            default: 'development',
            describe: 'Bundle mode to output.',
            coerce: (opt) => {
              // convert the bundle mode to the long version
              // (dev => development, prod => production)
              return modeDict[opt];
            },
            type: 'string',
          },

          project: {
            alias: 'p',
            describe: 'Project to use with a dev server.',
            type: 'string',
          },
        })
        .demandOption(['project'], 'Please provide a project argument to work with this tool');
    },
    (argv) => {
      const { mode, project } = argv;
      startDev(mode, project);
    }
  )
  .help()
  .version(false).argv;
