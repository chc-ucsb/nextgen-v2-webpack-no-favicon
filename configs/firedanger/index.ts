import { Config } from '../../src/Config';

// Project-specific stylesheets
import '../../assets/css/styles-firedanger-override.css';
import '../../assets/css/custom.css';
import '../../assets/css/common.css';

// Project-specific dependencies
import '../../vendor/ext/4.2.1/ext-theme-neptune';

// Project-specific config files.
import { layers } from './layers';
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
    serviceCheck: 'https://earlywarning.usgs.gov/api/rest/service-check/geoserver,mysql,pgsql,geoengine5-prod',
  })
  .setTimeHandlingProperties({
    weekStartsOn: 1,
    granuleReference: 'start',
    ignoreLeapYear: false,
  });
