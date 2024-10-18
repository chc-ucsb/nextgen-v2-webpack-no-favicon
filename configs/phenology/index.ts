import { Config } from '../../src/Config';

// Project-specific stylesheets.
import '../../assets/css/common.css';
import '../../assets/css/custom.css';
import '../../assets/css/styles-phenology-override.css';
import 'ol-ext/dist/ol-ext.min.css';
import '../../vendor/mapskin/css/mapskin.min.css';

// Project-specific dependencies
import '../../vendor/ext/4.2.1/ext-theme-neptune';

// Project-specific config files.
import { layers } from './layers';
import { regions } from './regions';
import { periods } from './periods';
import { template } from './template';

export default new Config().addSources({
  layers,
  regions,
  periods,
  template,
  serviceCheck: 'https://earlywarning.usgs.gov/api/rest/service-check/geoserver,mysql,pgsql,geoengine5-prod',
});
