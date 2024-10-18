import { Config } from '../../src/Config';

// Project-specific dependencies
import '../../vendor/ext/4.2.1/ext-theme-neptune';
import '../../src/core/core-amcharts';

// Project-specific stylesheets.
import '../../assets/css/common.css';
import '../../assets/css/custom.css';
import '../../assets/css/wret-override.css';
import '../../assets/css/styles-vegdri-override.css';
import 'ol-ext/dist/ol-ext.min.css';
import '../../vendor/mapskin/css/mapskin.min.css';

// Project-specific config files.
import { layers } from './layers';
import { charts } from './charts';
import { periods } from './periods';
import { regions } from './regions';
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
    weekStartsOn: 1,
    ignoreLeapYear: false,
    granuleReference: 'start',
  });
