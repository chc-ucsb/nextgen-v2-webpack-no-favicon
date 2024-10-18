/**
 * Get the path for a project's ExtJS theme. Path is relative to the `src/core/` folder.
 * @param {string} projectName
 * @returns {string} The path to the theme-related stylesheet to be used in the project.
 */
const getThemePath = (projectName) => {
  if (String(projectName).toLowerCase() === 'ewx_lite') {
    return '../../vendor/ext/4.2.1/resources/ext-theme-gray/ext-theme-gray-all.css';
  }
  return '../../vendor/ext/4.2.1/resources/ext-theme-neptune/ext-theme-neptune-all.css';
};

/**
 * Get the title used for the generated `index.html` file.
 * @param {string} projectName
 * @returns {string} The title to be used for the generated index.html page.
 */
const getHTMLTitle = (projectName) => {
  switch (String(projectName).toLowerCase()) {
    case 'ewx':
      return 'EWX Next Generation Viewer';

    case 'ewx_lite':
      return 'EWX Lite';

    case 'geosur/rmv-en':
      return 'GEOSUR RMV';

    case 'geosur/rmv':
      return 'GEOSUR VRM';

    case 'theme-viewer/en/hydrography':
      return 'Hydrography - GEOSUR';

    case 'theme-viewer/es/hidrografia':
      return 'Hidrografía - GEOSUR';

    case 'theme-viewer/en/environment':
      return 'Environment - GEOSUR';

    case 'theme-viewer/es/medioambiente':
      return 'Medio Ambiente - GEOSUR';

    case 'theme-viewer/en/infrastructure':
      return 'Infrastructure - GEOSUR';

    case 'theme-viewer/es/infraestructura':
      return 'Infraestructura - GEOSUR';

    case 'theme-viewer/en/miac':
    case 'theme-viewer/es/miac':
      return 'MIAC';

    case 'theme-viewer/en/mias':
    case 'theme-viewer/es/mias':
      return 'MIAS';

    case 'lcmap':
      return 'LCMAP Viewer';

    case 'lidar':
      return 'IntELiMon Viewer';

    case 'mrlc':
      return 'MRLC Viewer';

    case 'mtbs':
      return 'MTBS Fire Viewer';

    case 'phenology':
      return 'Phenology Viewer';

    case 'vegdri':
      return 'Vegetation Dynamics / Drought Viewer';

    case 'firedanger':
      return 'Fire Danger Viewer';

    case 'topo':
      return 'CoNED Viewer';

    case 'burnseverity':
      return 'Burn Severity Viewer';

    case 'landfire':
      return 'LANDFIRE Data Distribution Site';
    default:
      return 'Next Generation Viewer';
  }
};

/**
 * Get the path to a project's favicon.
 * Used by Webpack's 'favicons-webpack-plugin' at build time.
 * @param {string} projectName
 * @returns {string|null} The path to the favicon image.
 */
const getFaviconPath = (projectName) => {
  const _projectName = projectName.toLowerCase();
  const basePath = './assets/favicons';
  const makePath = (fileName) => `${basePath}/${_projectName}/${fileName}`;
  switch (_projectName) {
    case 'mrlc':
      return makePath('logo.png');
    case 'lidar':
      return makePath('logo.png');
    default:
      return null;
  }
};

module.exports = {
  getThemePath,
  getHTMLTitle,
  getFaviconPath,
};
