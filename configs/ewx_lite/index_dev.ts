import { Config } from '../../src/Config';

// Project-specific stylesheets.
import '../../vendor/mapskin/css/mapskin.min.css';
import '../../assets/css/styles-map-viewer-override-gray.css';

// Project-specific dependencies
import '../../src/core/core-amcharts';

// Project-specific config files.
import 'ol-ext/dist/ol-ext.min.css';
import { layers } from './layers_stage';
import { charts } from './charts_stage';
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
    serviceCheck: 'https://devearlywarning.cr.usgs.gov/api/rest/service-check/geoserver,mysql,pgsql,geoengine5-prod',
  })
  .setTimeHandlingProperties({
    ignoreLeapYear: true,
    granuleReference: 'end',
  })
  .debug();
