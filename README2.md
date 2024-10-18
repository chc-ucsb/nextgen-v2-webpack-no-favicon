# NextGen Viewer
An application framework for USGS map viewer projects.
Written in TypeScript with ExtJS 4.2 for UI components and data visualization handled by AmCharts 3.

## Table of Contents
- [Requirements](#requirements)
- [Set Up](#set-up)
- [Getting Started](#getting-started)
    - [Configuring the Application](#configuring-the-application)
      - [Separating Dev & Prod Sources](#separating-dev--prod-sources)
      - [Debug Mode](#debug-mode)
    - [Adding Sources](#adding-sources)
      - [Regions](#regions)
      - [Layers](#layers)
      - [Time Series Charts](#time-series-charts)
      - [Application Template](#application-template)
      - [Projections](#projections)
      - [Analytics](#analytics)
    - [Further Customization](#further-customization)
      - [HTML Title](#html-title)
      - [Theme](#theme)
      - [Favicon](#favicon)
- [Building](#building)
  - [Building For Development](#building-for-development)
  - [Building For Stage](#building-for-stage)
  - [Building For Production](#building-for-production)
- [Deploying](#deploying)


## Requirements
This project requires that [Node](https://nodejs.org) be installed on your machine.

## Set Up
1. Clone the project to your computer using `git clone`

2. Install dependencies with `npm install`

## Getting Started
NextGen Viewer is able to handle the compilation of multiple viewers.

To create a new viewer using NextGen Viewer, create a folder in the `configs/` folder at the root and give it a name. This is the Project Name.

### Configuring the Application
Within your project folder create an `index.ts` file. This file will be used to configure the viewer.

```
import { Config } from '../../src/Config';

// Project-specific dependencies
// If you're using the `neptune` theme, import '../../vendor/ext/4.2.1/ext-theme-neptune'
// If you're using the `gray` theme, import '../../vendor/mapskin/css/mapskin.min.css' and '../../assets/css/styles-map-viewer-override-gray.css'.
import '../../vendor/ext/4.2.1/ext-theme-neptune';

// If the project has time series charts, include the AmCharts core module.
import '../../src/core/core-amcharts';

export default new Config();
```

#### Separating Dev & Prod Sources
In addition to the regular `index.ts` file, an `index_dev.ts` file can be created and used during development. If this file does not exist, the `index.ts` file will instead be used when launching the dev server.

It is recommended to configure the `index_dev.ts` file with debug mode and the `index.ts` file without debug mode.

#### Debug Mode
Debug mode enables console logging. This should be turned off for production deployments.

To enable debug mode, call `.debug()` at the end of the Config function chain.

### Adding Sources
Adding sources to the viewer can be done by simply calling the `addSources` function on the Config object and supplying the configuration files that are described below.
```
export default new Config()
  .addSources({
    ...
  })
```

#### Regions
The `regions.ts` file contains an exported `regions` array containing objects that describe each region to be made available in the `cRegionTool`. Regions will be displayed in the order they are written.

This is an example of a region object.
```
{
  id: 'af',
  name: 'africa',
  title: 'Africa',
  srs: 'EPSG:3857',
  bbox: [-2128992.2837949917, -4214602.3067408798, 5858710.218962431, 4615766.178543388],
  comments: 'basemap is in 3857 so bbox coords are in same format',
}
```

#### Layers
The `layers.ts` file contains an exported `layers` object. This object contains three different layer types: overlays, boundaries, and base layers.

```
export const layers = {
  overlays: [...],
  boundaries: [...],
  baselayers: [...],
}
```

Each layer type is an array of objects that form a folder hierarchy that contains the layers.

A folder contains the following properties:
```
{
  type: 'folder',
  title: 'Folder Title',
  expanded: true,
  folder: [...]
}
```
A folder representing a data set contains two extra properties: `description` and `regionId`.
If a folder has a `description` property, a `?` button will appear next to the dataset name in the `cDatasetToc` component. Clicking this button will display a popup containing the description text.

There is no limit on how deep the folder hierarchy can be structured. Just place all subfolders within the `folder` array, with the final level of the structure ending with an array of layers within the `folder` array.

___

At the deepest part of the folder hierarchy are the `layer` objects.

```
{
  type: 'layer',

  // string - A unique identifier for the layer.
  id: 'africaChirpsPentadalData',

  // string - An alternate title for the layer.
  title: 'Pentadal',

  // boolean - Required only if the layer is a WMST type.
  isWMST: true,

  // (Optional) string - Just like with folders, adding a `description` property to a layer will have a `?` button will appear next to it. Clicking this button will display a popup containing the description text.
  description: 'This is a layer description',

  // string - Required only if `isWMST` is `true`
  wmstName: 'fews_chirps_global_pentad_data:chirps_global_pentad_data',

  // object - Base URLs for requesting the layer. The keys of the object correspond to its respective OGC service.
  source: {
    wms: 'https://igskmncnlxvs226.cr.usgs.gov:8443/geoserver/wms?',
    wcs: 'https://igskmncnlxvs226.cr.usgs.gov:8443/geoserver/wcs',
    gwc: 'https://igskmncnlxvs226.cr.usgs.gov:8443/geoserver/gwc/service/wms?',
  },

  // boolean - Load the layer into the map but keep it invisible and don't display the layer in the `cLayersToc` component.
  loadOnly: false,

  // boolean - Include the layer by default to the map.
  display: true,

  // boolean - The same as `loadOnly`
  mask: false,

  // number - Set the z-index of the layer.
  zIndex: 0,

  // boolean - Enable the ability to alter the opacity of the layer.
  transparency: true,

  // string - The projection that the layer is in.
  srs: 'EPSG:4326',

  // string - The pixel resolution from QGIS. Used for requesting and exporting raw GeoTiff files from GeoServer.
  resolution: '0.05',

  // object - (Optional) object - Used by the `cIdentifyTool` component. The keys of the object match the Coverage Bands assigned to the layer.
  featureInfo: {
    // The name of the Coverage Band from GeoServer.
    GRAY_INDEX: {
      // string - The label for the data to be displayed in the Feature Info panel.
      displayName: 'Pixel Value',

      // string - The initial value to be displayed.
      displayValue: null,

      // string - The initial value.
      value: null,

      // Array<object> - An array of objects used to override any feature info values.
      mapValues: [],

      // number - The amount of digits to round the value to.
      significantDigits: 6,
    },
  },

  // string - The layer style from GeoServer.
  style: 'fews_chirps_pentad_data_raster_ngviewer',

  // object - An object containing the `style`, `title` and optionally, `customImageURL`.
  legend: {
    // string - The legend style from GeoServer
    style: 'fews_chirps_pentad_data_raster_ngviewer_legend',

    // (Optional) string - URL to custom legend image.
    customImageURL: null,

    // string - The title of the legend.
    title: 'CHIRPS Pentadal Data (mm)',
  },

  // string - Used to specify the unit of measurement.
  unit: 'mm',

  // (Optional) object - Used by some components for accessing extra metadata about the layer.
  additionalAttributes: {
    // (Optional) string - The statistic type from GeoEngine. Required only if `isWMST` is true.
    statistic: 'data',

    // (Optional) string - The raster dataset name from GeoEngine. Required only if `isWMST` is true.
    rasterDataset: 'chirps_global_pentad_data',

    // (Optional) string - The label for the Y axis of the associated time series chart. Required only if using time series charts.
    chartYAxisLabel: 'Rainfall (mm)',
  },

  // (Optional) object - Only required if `isWMST` is `true`
  timeseries: {
    // string - Periodicity type from GeoEngine.
    type: 'pentad',

    // string - Time series source URL from GeoEngine.
    source: 'https://stagegeoengine.cr.usgs.gov/api/rest/version/5.0/config',
  },
}
```

#### Time Series Charts
Adding time series charts to the layers can be done by creating a `charts.ts` file that exports a `charts` array. The array contains objects that describe the types of charts available for different layers.

```
{
  source: {
    // string - The template string for a GeoEngine5 time series request.
    url: 'https://edcintl.cr.usgs.gov/geoengine5/rest/timeseries/version/5.0/vector_dataset/{{vector_dataset}}/raster_dataset/{{raster_dataset}}/periodicity/{{periodicity}}/statistic/{{statistic}}/lat/{{lat}}/lon/{{lon}}/seasons/{{seasons}}/zonal_stat_type/mean/mean-median/false',

    // string - Currently `json` is the only available type.
    type: 'json',

    // (Optional) string - The name of an exported function from the `normalizers` folder located inside `Charter`.
    normalizer: 'normalizeG5Data',
  },

  // Array<string> - The IDs of the overlay layers that the chart is for.
  overlays: ['saNdvic6DekadalAnomaly'],

  // Array<string> - Only activate the chart within these boundary IDs for the above overlays.
  boundaries: ['saAdmin1', 'saAdmin2'],

  // Array<string> - The labels to be displayed in the cZonesCombo, respective to the order of the above boundaries.
  boundaryLabels: ['Admin 1', 'Admin 2'],

  // Array<object> - The chart types available for different data views.
  chartTypes: [
    {
      // Array<string> - The types of graphs available for this chart type. Order is important.
      graphTypes: ['line', 'bar'],

      // string - The type of Chart Builder to use
      dataType: 'annual',

      // string - A dot-notated path to the time series data.
      dataRoot: 'emodisndvic6v2_southamerica_dekad_anom.data',

      // string or object - Can either be 'auto' or an object containing 'min' and 'max' values.
      yAxisRange: 'auto',
    },
  ],
},
```

The application configuration in the `index.ts` file can also be used to affect how time series data is used by adding a `setTimeHandlingProperties` call.
```
export default new Config()
  .setTimeHandlingProperties({
    // (Optional) boolean - Do not display leap years in the charts.
    ignoreLeapYear: true,

    // (Optional) number (0-6) - The day the week starts on. Days are zero-indexed (Sunday is 0).
    weekStartsOn: 1

    // string ('start', 'end') - Which granule to reference (granule_start, granule_end) when referring to dates.
    granuleReference: 'start',
  });
```

#### Application Template
The template.ts file is where you can add and remove tools. Some tools will be mandatory, because they are integral to NextGen.

The template is broken up into blocks. They can be top, left, center, right, or bottom. Each tool also has the property “add” which must be true for it to be usable in the viewer. Setting it to false is typically reserved for testing purposes. Many also have height and width properties, which define those values in pixels.


After the explanation of the tool, there will be a list of properties involved with the template file. By default, there are several common properties each component will contain:
- Name: The name of the tool being imported, E.G: cDataDownload.
- Items: This is how you know a component is a parent. The subcomponents, or children, are found within these square brackets- also known as an array.
- Block: A parent tool that starts the block will have this property, and its value will be top, left, center, right, or bottom.
- Import: The location of the tool in the folder structure.
- Add: When true, the component will be added to the viewer. If a parent tool is false the child tools will fail.
- Height/Width: The height and or a component (think panels or popups). Most commonly it is a number, which is the exact number of pixels. Also common is a percentage such as “70%,” or frequently “auto” which has ExtJS handle the sizing itself.
- Title: If a component has this property, its value will be what appears on the screen as, say, a panel title.
- Collapsible: Typically found on components within the Tools toolbar (right-hand side). If collapsible is true, as the name implies, it can be opened and closed using the arrow icon.
- Collapsed - When set to true, the item is closed on startup until the user opens it
- Tooltip: The text you see when hovering over a component.
- Pressed: When true the component will be activated on load. Just like “pressing the button.”
- OverflowMenu: When too many items are within a container they get moved to a separate menu.

___

Here is a list of each tool from the `shared` folder with a brief description including properties:

AddMapWindowTool
: A simple tool that creates a request for a new map window

AddWMSLayerForm
: This tool allows users to add wms layers from their own sources.

AddWMSLayerTool
: A simple tool that adds a button which enables the use of AddWMSLayerForm. Commonly found in the layers table of contents.

ArrangeWindows
: As the name implies, this is a handy tool for managing several windows at one time. It allows you to move windows into conveniently sized shapes to view all of them at the same time.

BoundaryLegendPopup
: A tool for EWX_Lite that shows a legend informing users of the boundaries on the map.

BoundaryToggleTool
: The button, found at the right of the toolbar in EWX_Lite, which toggles the BoundaryLegendPopup.

ChartContainer
: This tool is what holds all our other charting tools together. It is effectively the window which we add tools upon.

ChartDataTruncate
: A button that lets the user set a start date within a chart to view data more precisely.

ChartDataTruncateReset
: The inverse of the above tool, which removes the user’s custom start date from the chart.

ChartLegend
: A button commonly found in the top right of a chart window that toggles the legend underneath the chart.

ChartTabPanel
: EWX_Lite’s unique tool that displays all available charts for a region in separate tabs within the chart window.

ChartToolsMenu
: The parent tool that toggles the display for tools such as ExportPNG.

ChartTypeCombo
: A drop-down menu in the chart window that allows users to change between chart types. For example: Pentad, Interannual, Cumulative.

ClipNShip
: Deprecated?

ClipNShipBtn
: Deprecated? See datadownload?

ColumnContainer
: Deprecated? Tool used by CDI.

DataDownload
: This tool, when enabled, expands the tool sidebar on the right and starts a draw event where users can draw a custom square on the map. This square sets the boundaries for a download request. It also includes the logic for showing available layers, and the other visual elements in the tool drop down.

DataDownloadBtn
: The button which toggles the DataDownload tool.

DatasetExplorerTool
: A drop down menu that lets users change the dataset on the map. For example, between Data, Anomaly, and Z-Score in EWX.

DatasetToc
: One of two available means of displaying layers to the user. (The other being DefaultToc). This one is seen in tools like LCMAP and EWX. It shows the available layers from the layers config file and enables multiple windows of different layers.

DatePickerTool
: This important tool is what lets users cycle between periods of all available data. The menu features dropdowns for things like the year or month.

DefaultToc
: As the name implies, it is the default logic for handling layers in the table of contents.

DockChart
: Found on the chart toolbar, it changes the window from floating to being docked to the center area.

DownloadBtn
: In the MTBS tool- makes a request that zips all the selected fires together and returns the zip file which is downloaded.

ExportCSV
: A tool that lets you download chart data in CSV format.

ExportPNG
: A tool that lets you download chart data in PNG format.

ExtentDragBoxTool
: Found in the map toolbar, it allows users to draw a box to zoom the map to that extent.

ExternalLinkButtonTool
: The “Home” button which redirects users, typically, to a page talking about the project.

FeatureInfoPanel
: After a user has placed a crosshair with the Identify tool, this appears in the righthand Tools toolbar. It shows the information associated with the data on the crosshair, such as a rainfall value or county within a state.

FeatureInfoTable
: A tool used solely by MTBS for displaying information on fires.

FeatureQueryDisplayPanel
: The panel which contains QueryParamsDisplay (custom MTBS tool). It makes the requests when the filters are updated.

Footer
: The template item that renders a footer at the bottom of the viewer.

GraphTool
: A toolbar button that, when selected, will load available graphs for the area the user clicks.

Header
: The template item that renders a header at the top of the viewer.

IdentifyTool
: When selected the user can click on the map to place a crosshair to collect information on the selected area.

LandsatLook
: A button for Geosur to launch the landsatlook website.

LayersToc
: The “bottom half” of the desktop-like viewers (EWX, Phenology, etc) which shows all active layers and allows toggling.

LegendEarTool
: Deprecated?

MapDownloadsMenuItem
: Available after opening the MapDownloadsTool, it enables downloading the current map in a TIFF or GEOTIFF format.

MapDownloadsMenuItemPNG
: Available after opening the MapDownloadsTool, it enables downloading the current map in a PNG format.

MapDownloadsTool
: The gear-icon tool which acts as a dropdown container for MapDownloadsMenuItem(PNG).

MapLegend
: The tool in the bottom right of the map that displays the legend.

MapLegendTool
: A button that toggles the display of the legend in the bottom right corner of the map.

MapPanel
: The user-interactive map is contained in this panel, which is itself within the MapWindow.

MapWindow
: The window containing a toolbar, and the user-interactive map. This can be moved around the screen, have its size changed, and features expanding/closing buttons in the top right.

MapWindowChartArea
: Similar to the MapWindow, but specifically for charting.

MenuLabel
: A simple tool for displaying text (typically “Download: “ ) within the ChartToolsMenu.

PanTool
: The tool that allows users to click and drag to move the map

PeriodTypeCombo
: The drop down menu on the map toolbar that allows cycling between available periods such as Monthly, Yearly, Dekad, etc.

Popup
: Deprecated?

PopupButtonTool
: Found next to the ExternalLinkButtonTool, marked by a question mark, when selected it shows a popup containing information about the viewer and often external links.

RegionSelectorMenu
: An MTBS tool which contains the StateTool

RegionTool
: The drop down menu which displays available regions from the region config file. When one is selected it loads that region and its associated layers.

RemoveWMSLayerForm
: This tool allows users to remove their custom wms layers.

RemoveWMSLayerTool
: A simple tool that adds a button which enables the use of RemoveWMSLayerForm. Commonly found in the layers table of contents.

ResetQuery
: Another MTBS tool for removing reseting queries.

RevertExtentTool
: This tool takes you back to the view you had previously. While not practical for regular zoom ins and zoom outs, it is useful when using the ExtentDragBoxTool

SelectBBOXTool
: An MTBS tool for creating a bounding box.

Spacer
: This generic tool is used for the “middle” of toolbars to keep left tools and right tools apart.

SpatialLocking
: A panel that shows all map windows with checkboxes to the left. Any selected windows become linked in their view of the map. Moving or zooming on one moves the other.

TabPanel
: I can’t actually figure out what this does.

Toc
: The container for the left hand side of NextGen, which features available layers.

TocContainer
: The “upper” portion of a desktop-like table of contents. It shows all available layers, and when selected, launches them in their own map window.

TocContentsScrollTab
: A tab within the Toc (next to Legend tab) which shows layers. This one enables a scrollbar, because viewers that use it (MRLC) often have enough layers to warrant one.

TocContentsTab
: A tab within the Toc (next to Legend tab) which shows layers.

TOCDesktopLike
: The table of contents component responsible for having two separate panels within the Toc. The “opposite” of MRLC, it has the “dataset” and “layers” panels, with functionality for multiple windows.

TocLegendTab
: Like the TocContentsTab, it is the tab for displaying legends for qualifying layres.

TocTabPanel
: The panel that contains TocContents(Legends)Tab.

Tools
: The rightmost toolbar the is collapsible. It contains the tools for displaying information obtained by interacting with the map.

Transparency
: A slider located within the layers table of contents, used to decrease opacity of the selected layer.

YearsCombo
: The dropdown menu within the chart window responsible for letting users select the years they wish to view.

ZonesCombo
: Also in the chart window this dropdown menu, this allows users to change between available zones.

ZoomToRegionTool
: A toolbar button that, when toggled, will set the view back to how it appears on the initial load.

#### Projections
If your application is utilizing the `cDownloadTool`, then a `projections.ts` file is required. This file contains an exported `projections` object with the keys being an EPSG code and the values being either a WKT or PROJ string. The projections listed relate to the native projections of the layers (from `layers.ts`).

These values are used in conjunction with `proj4` for projecting the coordinates used on the map to the coordinates the layer on disk uses.

An example of a `projections.ts` file:
```
export const projections = {
  'EPSG:5070': '+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=23 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs',
  'EPSG:675244': '+proj=aea +lat_1=8.000000000000002 +lat_2=18 +lat_0=3 +lon_0=-157 +x_0=0 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  'EPSG:3338': '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  'EPSG:6752548': '+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=23 +lon_0=-96 +x_0=0 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  'EPSG:675225': '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
};
```

#### Analytics
NextGen Viewer comes equipped to add either (or both!) Matomo and Google Analytics.

To do so, simply call the `setAnalytics()` function on your `Config` object.
```
export default new Config()
  .addSources({
    ...
  })
  .setAnalytics({
    matomo: 'Matomo ID',
    google: 'GA ID',
  });
```

### Further Customization
#### HTML Title
Open the `scripts/webpackHelpers.js` file. The `getHTMLTitle` function handles the HTML title. Just add your project name as a case in the switch statement along with your desired title.

#### Theme
Open the `scripts/webpackHelpers.js` file. There are two themes available: `gray` and `neptune`. If you're using the gray theme then add your project name to the `getThemePath` function. `Neptune` theme doesn't require this and is used by default.

#### Favicon
Create a folder with the project's name in the `assets/favicons/` folder and add the desired image. The favicons will be generated by Webpack. Open the `scripts/webpackHelpers.js` file and add the filename for the project's favicon image to the `getFaviconPath` function.

## Building
To run the build process open the console and `cd` into the project directory.
```shell script
cd <PATH_TO_PROJECT>
```

The build process is handled with Webpack via a custom bundle.js script. This script can be executed with the command `npm run bundle -- [options]`. The script has usage information built in.

#### Building For Development
To run the development server open the console and run this command from your project root:
```shell script
npm run dev -- -p [Project Name]
```

#### Building For Stage
**The difference:** Dev bundle (no minification/mangling) while using prod resources (layers/charts instead of their *_stage equivalents). This allows us to debug the app easier in the browser while still using production APIs.
```shell script
npm run bundle -- -m stage -p [Project Names]
```

#### Building For Production
```shell script
npm run bundle -- -m [development/production] -p [Project Names]
```
or
```shell script
npm run bundle -- -p [Project Names]
```

Note: The default bundle mode is `production`, so the `--mode` option can be omitted. Additionally, the `--projects` option will accept multiple arguments to bundle multiple projects at the same time.

The built application will be placed into the `dist/[Project Name]/` folder in the project root.

## Deploying
All that is needed to deploy the built application is to copy the contents of the `dist/[Project Name]` folder to your server of choice. No special requirements on the type of server.
