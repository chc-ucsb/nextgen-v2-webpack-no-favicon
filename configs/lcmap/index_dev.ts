import { Config } from '../../src/Config';

// Project-specific stylesheets
import '../../assets/css/styles-lcmap-override.css';
import '../../assets/css/custom.css';
import '../../assets/css/common.css';

// Project-specific dependencies
import '../../vendor/ext/4.2.1/ext-theme-neptune';
import 'ol-ext/dist/ol-ext.min.css';
import '../../vendor/mapskin/css/mapskin.min.css';

// Project-specific config files.
import { layers } from './layers_dev';
import { regions } from './regions';
import { periods } from './periods';
import { template } from './template';
import { projections } from './projections';

export default new Config()
  .addSources({
    layers,
    regions,
    periods,
    template,
    projections,
    serviceCheck: 'https://devearlywarning.cr.usgs.gov/api/rest/service-check/geoserver,mysql,geoengine5-prod',
  })
  .debug();
