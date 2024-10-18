import { Config } from '../../src/Config';

// Project-specific stylesheets.
import '../../assets/css/styles-landfire-override.css';
import '../../assets/css/styles-fallback-157FCC.css';

// Project-specific dependencies
import '../../vendor/ext/4.2.1/ext-theme-neptune';
// import 'ol-ext/dist/ol-ext.min.css';

// Project-specific config files.
import { layers } from './layers';
import { regions } from './regions';
import { versions } from './versions';
import { template } from './template';

export default new Config().addSources({
  layers,
  regions,
  versions,
  template,
  serviceCheck: 'https://earlywarning.usgs.gov/api/rest/service-check/geoserver',
});
