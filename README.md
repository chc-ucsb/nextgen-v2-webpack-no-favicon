# NextGen Viewer
An application framework for USGS map viewer projects. \
Written in TypeScript with ExtJS 4.2 for UI components and data visualization handled by AmCharts 3.

This project requires that [Node](https://nodejs.org) be installed on your machine.

## Table of Contents
- [Set Up](#set-up)
- [Major Changes](#major-changes)
- [Configuring the Application](#configuring-the-application)
- [Building](#building)
- [Deploying](#deploying)
- [Using JSON5](#using-json5)
- [Creating Charts](#creating-charts)
- [Project Migration](#project-migration)
- [Folder Structure](#folder-structure)
- [Vocabulary](#vocabulary)
- [NPM Scripts](#npm-scripts)

## Set Up
1. Clone the project to your computer using `git clone`

2. Install dependencies with `npm install`

3. Developers can run a local development environment by running `npm run dev:PROJECT_NAME`. \
   Your browser will open to the local instance of the viewer. The development server will watch the files for any changes and automatically reload the webpage for you.

## Major Changes
- There is now a way to comment out lines of a JSON file. Previously, users would have to make a backup of their configuration file before making any changes. Now, users have the ability to use `.json5` files for their configuration. With the new [JSON5](https://json5.org/) support, this juggling of files is no longer necessary because JSON5 supports the use of comments in JSON files.
- A build system is now in use! Webpack will bundle all of the necessary _core_ code into one single file, even the JSON! Project-specific components will now be kept separately.
- TypeScript has been adopted across the codebase.
- Code is now ES6 compliant. All future code is required to also be ES6 compliant. If you do not know what this means, I recommend reading the free book [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/) and checking out the article series [ES6 in Depth](https://ponyfoo.com/articles/es6) to understand the new syntax and the benefits of using TypeScript with ES6 modules.
- The PHP proxies have been removed. Either they weren't being utilized, or the functionality they provided can be replicated using JavaScript. Most of them were actually just transforming the data rather than proxying the requests. Proxy URLs can still be added by users if this functionality is still desired.
- The 4 monolithic scripts have been split into separate, smaller, modules.
- The code will now follow a set style guide. **Your code will fail to be added to a git commit if there are any linting errors**. Errors must be fixed before files will be allowed to be staged.
    - To help with this, an [EditorConfig](https://editorconfig.org/) file is provided. Your IDE will automatically recognize this file and adjust your editor's settings regarding spacing, indent size, comma usage and whitespace.
    - Linting is performed with ESLint.
    - Formatting is performed with Prettier. \
    **Note:** Most IDEs have a `Fix ESLint Problems` option (or equivalent) in the right-click menu. ESLint has been configured to automatically run Prettier after running this. This same command can be executed by running the `eslint --fix` command.

## Configuring the Application
1. Create a new folder named after your project within the `configs/` folder.

2. After adding the necessary `.json` files to the directory, create an `index.ts` and (optionally) an `index_dev.ts` file in the same folder. Project configuration is done within these files using the new `Config` class. One file is for development-specific assets and settings and the other is for production assets and settings.
    ```
    import { Config } from '../../js/Config'

    // Project-specific dependencies
    import '../../vendor/ext/4.2.1/ext-theme-neptune' // neptune theme requires this .js file
    import '../../core/core-amcharts' // add charts only if you require them

    // Project-specific config files.
    import { layers } from './layers.json'
    import { charts } from './charts.json'
    import { regions } from './regions.json'
    import { periods } from './periods.json'
    import { template } from './template'

    export default new Config()
      .addSources({
        layers,
        charts,
        regions,
        periods,
        template,
        serviceCheck: 'https://devearlywarning.cr.usgs.gov/api/rest/service-check/geoserver,mysql,pgsql,geoengine4'
      })
      .setAnalytics({
        matomo: '5',
        google: 'UA-20242140-4'
      })
      .debug()
    ```

3. In the `scripts/webpackHelpers.js` file:
    - Add the desired title for the built HTML page to the `getHTMLTitle` function.
    - If you're using the gray theme, add your project name to the `getThemePath` function.

4. In the `package.json` file, add new NPM scripts to the appropriate locations in the `scripts` object:
   ```
   // For deploying the local dev server
   "dev:<PROJECT_NAME>": "webpack-dev-server --config=webpack.config.dev.js --env=<PROJECT_NAME>"

   // For building the project using dev mode
   "bundle:dev-<PROJECT_NAME>": "webpack --config=webpack.config.dev.js --env=<PROJECT_NAME>"

   // For building the project using production mode
   "bundle:prod-<PROJECT_NAME>": "webpack --config=webpack.config.prod.js --env=<PROJECT_NAME>"
   ```

5. If the project uses favicons, create a folder with the project's name in the `assets/favicons/` folder and add the project's logo. The favicons will be generated by Webpack.
    - Reopen the `scripts/webpackHelpers.js` file from step 3 and add the filename for the project's logo to the `getFaviconPath` function.

The project will be dynamically built based on the project name.
___
You can see that the `Config` object is used by the application from within the `src/index.ts` file -- by creating a new NextGenViewer object and passing the created config into it.
```javascript
new NextGenViewer(config)
```

## Building for development
To run the development server open the console and run this command from your project root:
```shell script
npm run dev -- --p [Project Name]
```

## Building for stage
**The difference:** Dev bundle (no minification/mangling) while using prod resources (layers/charts instead of their *_stage equivalents). This allows us to debug the app easier in the browser while still using production APIs.
```shell script
npm run bundle -- -m stage -p [Project Names]
```

## Building for production
To run the build process open the console and `cd` into the project directory.
```shell script
cd <PATH_TO_PROJECT>
```
Then you can run the following command in your console:
```shell script
npm run bundle -- -mode [development/production] -projects [Project Names]
```
or
```shell script
npm run bundle -- -m [dev/prod] -p [Project Name]
```

Note: The default bundle mode is `production`, so the `--mode` option can be omitted. Additionally, the `--projects` option will accept multiple arguments to bundle multiple projects at the same time.

The built application will be placed into the `dist/[Project Name]/` folder in the project root.
___
**Note:** If you see this error at the end of your webpack build, you can safely ignore it:
```
Type 'string | number | symbol' is not assignable to type 'string'.
Type 'number' is not assignable to type 'string'.
```
[See more about this issue here](https://github.com/microsoft/TypeScript/issues/31393).

## Deploying
All that is needed to deploy the built application is to copy the contents of the `dist/[Project Name]` folder to your server of choice. No special requirements on the type of server.

## Using JSON5
[JSON5](https://json5.org/) files can easily be converted to regular JSON files by running the command `npm run json5`. This command will convert all `.json5` files to their `.json` equivalent using the same file name. The new file will be placed in the same folder as the original; if one already exists, it will be overwritten.

## Creating Charts
- New chart builders must now inherit the `ChartBuilderInterface` interface.
- New chart types must inherit the `ChartTypeInterface` interface.
- Normalizers aren't necessarily new to this version of NextGen. The functionality was there, but they weren't being used in prior versions. They will now take the place of the PHP scripts that were previously used. Normalizers are just functions that are exported from the `normalizers` folder located inside `Charter`. To use a normalizer, in the `charts.json` file, simply remove the proxy URL and add the `normalizer` property to the `source` object of a chart. Here is an NDVIC example:
```json
    {
        "source": {
            "url": "https://edcintl.cr.usgs.gov/geoengine5/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/calculation_type/mean/mean-median/true",
            "type": "json",
            "staticSeasonNames": [
              "median_2003-2017"
            ],
            "normalizer": "normalizeG5Data"
        }
    }
```

## Project Migration
- template.json files are now `template.ts` files. The changes needed are:
    - The `import` properties need changed from `tools.x.x` to `js.tools.x.x`.
    - All tools **must** have an `"add": <boolean>` property on them.
    - Because the file is no longer JSON, replace the top curly brace with this
    ```javascript
    export const template = {...}
    ```
    - Images **must** be imported at the top of the file and replace any image paths used in the file. Example:

    ```javascript
    import logoLeft from '../../assets/images/fewsusgs1.jpg';
    import logoRight from '../../assets/images/fewsnet.png';

    export const template = {
        // ...
        content: `<div id='header-logo-left'><img src='${logoLeft}'></div>`
        // ...
  }
    ```
- Calls to `mapper`, `skin` or any other global variable need to be changed. Their equivalent can be found using `globalThis.App`.
- References to config files will change from `mapper.layerConfigs` to `globalThis.App.Config.sources.layers`.
- Change references of `mapper.EventCenter.defaultEventCenter` to `globalThis.App.EventHandler`
    - `mapper.EventCenter.EventChoices` -> `globalThis.App.EventHandler.types`
- How analytics are implemented has been changed to be more extendable and dynamic. Now the code for analytics platforms is located inside `/js/Analytics.ts` with the configuration IDs simply listed inside the `Config` object. No more needing a unique `analytics.js` file for each project.
- properties are camelCase in `charts.json` (chart_types -> chartTypes, etc.)
- Any tools that use OpenLayers will most likely need to be updated to the latest v6 API. See the [upgrade guide](https://github.com/openlayers/openlayers/blob/master/changelog/upgrade-notes.md)

## Testing
E2E - [qawolf](https://docs.qawolf.com/) is used to create and automate the running of end-to-end tests on Webkit, Firefox, and Chromium-based browsers.

Unit - [Jest](https://jestjs.io/) is used for creating and running unit tests. It's also used by qawolf for its tests.

## Folder Structure
**Top Level** - Reserved for configurations of the build tools. Here you will find configs for
- Babel - Compiles the modern JavaScript syntax down to a version compatible with legacy browsers like IE11
- ESLint - Analyzes the code to ensure best practices.
- Prettier - Reformats the code. Used in conjunction with ESLint.
- Jest - A test runner for JavaScript.
- TypeScript - Static code analysis.
- Webpack - The project bundler.
- BrowsersList - The list of browsers that Babel-compiled code should support.
- Husky - Git commit hooks - Used to run LintStaged when using `git commit`.
- LintStaged - Runs ESLint and Prettier on the staged files prior to actually staging them. Prevents any files with linting errors from being committed.

**.qawolf** - Contains all the files related to qawolf E2E tests.

**index.ts** - The entry point of the application.

**assets** - All the CSS, fonts, and images used by the application.

**configs** - No change from previous NextGen version. Project configurations go here.

**scripts** - Custom scripts that are used when bundling the application.

**src** - All of the application code is in here.
  - **@types** - TypeScript types.

  - **Architect** - All code related to building the UI. Partial replacement of `skin.js`.

  - **Charter** - All code related to building charts.

  - **ChartBuilders** - Classes related to the building of charts. All chart builders implement a `ChartBuilderInterface`, so creating new builders is simple.
    - **ChartTypes** - Classes related to the configuration of multiple charts. Each config is then used to create an associated chart builder.

    - **normalizers** - The files in this folder are not classes, rather they are used as _mixins_ for the chart builders. These replace the need for the PHP proxies used in previous versions.

  - **Config** - The class used for configuring the application. Users can either use their JSON files via path reference, or by importing the data directly.

  - **core** - All of the _required_ dependencies every build of the application will need (except for `core-amcharts.ts`, which is optional.)

    - **core-dependencies** - **required** - Contains the imports for the ExtJS library as well as the required stylesheets:
            1. Your project's ExtJS Theme (determined dynamically at compile time.)
            2. The styling for OpenLayers.
            3. Font Awesome.
            4. Custom styling for ExtJS components.

    - **core-amcharts** - **optional** Import this file _**only if your project requires charting abilities**_.

  - **helpers** -  Common helper functions used throughout the application.

  - **Network** - Classes responsible for handling network requests.

    - **Transport** - Handles GET and POST requests.

    - **WCSRequest** - Handles WCS requests to GeoServer. Has options to request either the current extent or the full extent.

  - **tools** - All the ExtJS components. Was previously located in the root folder.

  - **utils** - These files are a collection of commonly used functions or duplicated code that has been consolidated into one place. Most were previously located in `mapper.common`, but also includes `chart.ts`, `common.ts`, and `periodicity.ts`. These files are moving to the `helpers/` folder.

  - **Analytics** - A class implementation of `mapper.Analytics`.

  - **EventCenter** - A class implementation of `mapper.EventCenter`.

  - **Layer** - A class representing a single layer, with the functions that relate to altering an individual layer (eg. setOpacity, isTransparent, etc).

  - **LayerHandler** - A class that handles and tracks multiple `Layer` instances, along with most of the functions from `mapper.layers`.

  - **Map** - A class called `MapWrapper` that is the replacement of `mapper.OpenLayers`

  - **NextGenViewer** - The class that replaces the program start portion of `skin.js`. Orchestrates all of the startup tasks - service check, registering analytics, fetches any application settings (if a path is used in the `Config` object rather than using imported JSON data), and builds the UI.

  - **SkinTools** - The tools previously declared in the `skin.js`, moved to their own file.

  - **Store** - This is where all the instances of the above classes are kept. This is also the class that is accessible via `globalThis.App` and is the heart of the application. Previously, all of these references were thrown into the global scope or deeply nested within `mapper`.

**vendor** - All the non-NPM libraries.

## Contributing
This project follows a strict style guide.
- Classes are preferred over class functions.
- Functions have variable types and return types.
- Everything has documentation - properties and functions

Do not disable any ESLint or use `// @ts-ignore` without approval. Merge requests containing these will be rejected.

## Vocabulary
In an effort to normalize the vocabulary used in the code, the following changes have been made:

- **Variables that are plural _always_ mean that the data is an array** (eg. previously, a property named `layersConfig` was used in reference to a single `config` object within the `layers.json` file, **not** a single configuration for multiple layers.)
\
This has now been changed to `layerConfig`.
\
`layerConfigs` is now the property name when referring to an array of `LayerConfig` objects.

- When building the UI, the terms `block` and `blockConfigs` were used interchangeably to refer to a single object from the `template.ts` file.
\
`block` is the new property name to refer to a specific `Block` object _instantiated_ by a `blockConfig` object.
\
`blockConfig` is now used to reference a single object from `template.ts`.

## NPM Scripts
- `npm run dev -- -p [Project Name]` - Starts the dev server and launches your browser to the `localhost` instance. The dev server will watch the project filesystem for any changes and recompile, then refresh your browser window automatically.
- `npm run bundle -- -m [dev] -p [Project Names]` - Builds the project(s) using development mode
- `npm run bundle -- -m [prod] -p [Project Names]` - Builds the project(s) using production mode
- `npm run type-check` - Type-checks the application and reports errors to the console.
- `npm run build:types` - Outputs typings for TypeScript.
- `npm run build:js` - Transpiles the `.ts` and `.tsx` files into JavaScript using Babel.
- `npm run lint` - Runs ESLint and reports any errors to the console.
- `npm run test` - Runs the Jest test runner. Reports errors to the console.
- `npm run test:watch` - Runs the Jest test runner, but watches for changes and reruns the tests. Reports errors to the console.
- `npm run json5` - Executes the `json5tojson.js` file located in the `scripts/` folder.

## v3.0 Roadmap
- Migrate away from ExtJS - most components can be found online, but some may have to be custom-built (like the window component) - ExtReact would be a good stepping stone. JQWidgets looks promising.

- Upgrade AmCharts to v4.

- Use MobX for state management

- Have the app build within a GitLab CI/CD pipeline.
