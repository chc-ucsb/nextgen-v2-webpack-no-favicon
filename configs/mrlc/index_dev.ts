import { Config } from '../../src/Config';

// Project-specific stylesheets.
import '../../assets/css/styles-mrlc-override.css';
import '../../assets/css/styles-fallback-157FCC.css';

// Project-specific dependencies
import '../../vendor/ext/4.2.1/ext-theme-neptune';

// Project-specific config files.
import { layers } from './layers_stage';
import { projections } from './projections';
import { regions } from './regions';
import { template } from './template';

export default new Config()
  .addSources({
    layers,
    projections,
    regions,
    template,
    serviceCheck: 'https://devearlywarning.cr.usgs.gov/api/rest/service-check/geoserver-mrlc,mysql',
  })
  .debug();
