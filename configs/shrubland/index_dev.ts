import { Config } from '../../src/Config';

// Project-specific stylesheets
import '../../assets/css/styles-rangeland-override.css';
import '../../assets/css/custom.css';
import '../../assets/css/common.css';

// Project-specific dependencies
import '../../vendor/ext/4.2.1/ext-theme-neptune';

import '../../src/core/core-amcharts';

// Project-specific config files.
import { layers } from './layers_stage';
import { charts } from './charts_stage';
import { regions } from './regions';
import { periods } from './periods';
import { template } from './template';
import { projections } from './projections';

export default new Config()
  .addSources({
    layers,
    charts,
    regions,
    periods,
    template,
    projections,
    serviceCheck: 'https://devearlywarning.cr.usgs.gov/api/rest/service-check/geoserver-mrlc,mysql,geoengine5-prod,geoserver',
  })
  .debug();
