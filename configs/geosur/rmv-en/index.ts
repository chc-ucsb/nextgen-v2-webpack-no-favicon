import { Config } from '../../../src/Config';

// Project-specific dependencies
import '../../../vendor/ext/4.2.1/ext-theme-neptune';

// Project-specific config files.
import { layers } from './layers';
import { regions } from './regions';
import { template } from './template';

export default new Config().addSources({
  layers,
  regions,
  template,
  serviceCheck: 'https://earlywarning.usgs.gov/api/rest/service-check/geoserver,mysql,pgsql,geoengine4',
});
