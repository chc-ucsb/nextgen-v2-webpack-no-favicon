/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const Webpack = require('webpack');
const yargs = require('yargs');
const path = require('path');
const fs = require('fs');

/**
 * Dictionary of valid bundling modes.
 * @type {Record<string, string>}
 */
const modeDict = {
  dev: 'development',
  stage: 'stage',
  prod: 'production',
  development: 'development',
  production: 'production',
};

/**
 * Array of valid bundling modes.
 * @type {string[]}
 */
const modes = Object.keys(modeDict);

/**
 * Function that checks a path if it contains subdirectories.
 * @param path {string}
 * @param parentFolder {string?}
 * @returns {string[]}
 */
const getDirectories = (path, parentFolder) => {
  // Array of the files that are required to successfully build a project.
  const requiredFiles = ['index.ts', 'template.ts'];

  return (
    fs
      // Read directory contents
      .readdirSync(path, {
        withFileTypes: true,
      })

      // Filter out only the directories
      .filter(
        /**
         * @type {Dirent}
         */
        (dir) => dir.isDirectory()
      )

      // Check each directory for more subdirectories
      // Get an array of directory paths
      .map(
        /**
         * @type {Dirent}
         */
        (entry) => {
          // Recursively walk the folder path, checking for subdirectories
          const _parent = parentFolder ? `${parentFolder}/${entry.name}` : entry.name;
          const subDirs = getDirectories(`${path}/${entry.name}`, _parent);

          // Return array of subdirectories if not empty
          if (subDirs.length) return subDirs;

          // Check if the directory is an empty folder
          const subDirContent = fs.readdirSync(`${path}/${entry.name}`, {
            withFileTypes: true,
          });

          // Don't include empty folders
          if (!subDirContent.length) return;

          // Array of file names
          const fileNames = subDirContent.map(
            /**
             * @type {Dirent}
             */
            (item) => item.name
          );

          // We're determining at a glance if the project is able to be built by looking for the bare minimum files.
          // If they are not present, treat the folder as if it were empty.
          if (!requiredFiles.every((name) => fileNames.includes(name))) return;

          // Update the name to include the parent's folder, if applicable
          if (parentFolder) {
            return `${parentFolder}/${entry.name}`;
          }
          return entry.name;
        }
      )

      // Remove any undefined entries
      .filter((entry) => entry)

      // Flatten into a single array
      .flat()
  );
};

/**
 * Function that iterates over an array while awaiting an asynchronous task to complete
 * before continuing onto the next iterable.
 * The `actionArgs` parameter is passed into each iteration of the asynchronous task.
 * @param iterable {[]}
 * @param action {function}
 * @param actionArgs {{}}
 * @returns {Promise<void>}
 */
const mapSeries = async (iterable, action, actionArgs) => {
  const _options = actionArgs;
  if (_options.output) _options.useSubFolders = false;
  if (_options.output && iterable.length > 1) _options.useSubFolders = true;

  for (const value of iterable) {
    await action(value, _options);
  }
};

/**
 * Function that takes a Webpack configuration and changes the optimization options for a better development experience (no minify/mangling).
 * @param webpackConfig
 * @returns {*}
 */
const configureForDevelopment = (webpackConfig) => {
  const _config = webpackConfig;
  // Only use the optimizations during the build step if mode is development
  // For some reason, webpack-dev-server doesn't load the page if these are used.
  _config.optimization = {
    moduleIds: 'hashed',
    usedExports: true,
    splitChunks: {
      automaticNameDelimiter: '.',
      chunks: 'all',
      cacheGroups: {
        polyfills: {
          test: /polyfills/,
          name: 'polyfills',
          chunks: 'all',
        },
        vendors: {
          test: /node_modules/,
          name: 'vendors',
          chunks: 'all',
        },
        extjs: {
          test: /vendor/,
          name: 'extjs',
          chunks: 'all',
        },
      },
    },
  };

  return _config;
};

/**
 * Function that determines which webpack config to use, makes adjustments as necessary,
 * and executes the webpack build process.
 * @param targetProject {string}
 * @param options {{}}
 * @returns {Promise<void>}
 */
const doBuild = async (targetProject, options) => {
  // We use pass in the build iteration so that we can determine our output path.
  const { mode, output, useSubFolders } = options;

  // Arguments to be passed into the dynamic Webpack configs
  const webpackArgs = {
    // Used for determining project-specific properties from webpackHelpers.js
    projectName: targetProject,

    // The project directory
    projectDir: targetProject,
  };

  let webpackConfig;

  // Get the correct Webpack configuration
  switch (mode) {
    case 'development':
      webpackConfig = configureForDevelopment(await require('../webpack.config.dev')(webpackArgs));
      break;
    case 'stage':
      webpackConfig = configureForDevelopment(await require('../webpack.config.prod')(webpackArgs));
      break;
    case 'production':
    default:
      webpackConfig = await require('../webpack.config.prod')(webpackArgs);
      break;
  }

  // If the `output` option has been set, alter the output path
  if (output) {
    // Reset the path to the dist/ folder.
    webpackConfig.output.path = webpackConfig.output.path.slice(0, webpackConfig.output.path.indexOf('dist') + 4);

    // If multiple projects are being built and the output path is set, treat the output path as a parent folder for the project-named folders.
    if (useSubFolders) webpackConfig.output.path = path.join(webpackConfig.output.path, output, targetProject);
    else webpackConfig.output.path = path.join(webpackConfig.output.path, output);
  }

  // Run the build process within a Promise.
  return new Promise((res) => {
    console.log(`Bundling ${targetProject} in ${mode} mode.`);
    console.info(`Will output to ${path.normalize(webpackConfig.output.path)}`);

    // Bundle with Webpack
    Webpack(webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        // Fix for a false error reported when err is null
        if (err !== null) {
          // Handle errors
          console.log(err);
          console.log('errors occurred');
        }
      }
      // Done processing
      console.log(`Completed ${mode} bundle for ${targetProject}.`);
      console.log('');
      res();
    });
  });
};

yargs
  .scriptName('NextGen Bundler')
  .usage('$0 <cmd> [args]')

  .command(
    '$0',
    'Generate a bundle for a NextGen project.',
    (yargs) => {
      yargs
        .options({
          mode: {
            alias: 'm',
            choices: modes,
            default: 'production',
            describe: 'Bundle mode to output.',
            coerce: (opt) => {
              // convert the bundle mode to the long version
              // (dev => development, prod => production)
              return modeDict[opt];
            },
            type: 'string',
          },

          projects: {
            alias: 'p',
            describe: 'Projects to bundle.',
            coerce: (projects) => {
              // Check if any projects contain subdirectories.
              // Flatten all returned paths into one array.
              return projects
                .map((project) => {
                  const dirs = getDirectories(`configs/${project}`);
                  if (!dirs.length) return project;
                  return dirs.map((dir) => `${project}/${dir}`);
                })
                .flat();
            },
            type: 'array',
          },

          output: {
            alias: 'o',
            default: null,
            describe: 'Output folder structure. The project name will be appended to this path.',
            type: 'string',
          },
        })
        .demandOption(['projects'], 'Please provide a projects argument to work with this tool');
    },
    (argv) => {
      const { projects, ...args } = argv;
      mapSeries(projects, doBuild, args);
    }
  )
  .help()
  .version(false).argv;
