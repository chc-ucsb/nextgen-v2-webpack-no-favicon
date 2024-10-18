import { Config } from '../../src/Config';

// Project-specific stylesheets
import '../../assets/css/styles-ewx-override.css';

// Project-specific dependencies
import '../../vendor/ext/4.2.1/ext-theme-neptune';
import '../../src/core/core-amcharts';

import 'ol-ext/dist/ol-ext.min.css';
import '../../vendor/mapskin/css/mapskin.min.css';

// Project-specific config files.
import { layers } from './layers';
import { charts } from './charts';
import { regions } from './regions';
import { periods } from './periods';
import { template } from './template';

export default new Config()
  .addSources({
    layers,
    charts,
    regions,
    periods,
    template,
    serviceCheck: 'https://earlywarning.usgs.gov/api/rest/service-check/geoserver,mysql,pgsql,geoengine5-prod',
  })
  .setTimeHandlingProperties({
    ignoreLeapYear: true,
    granuleReference: 'end',
  });
