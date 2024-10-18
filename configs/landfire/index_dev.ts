import { Config } from '../../src/Config';

// Project-specific stylesheets.
import '../../assets/css/styles-landfire-override.css';
import '../../assets/css/styles-fallback-157FCC.css';

// Project-specific dependencies
import '../../vendor/ext/4.2.1/ext-theme-neptune';

// Project-specific config files.
import { layers } from './layers_stage_geoserver';
import { regions } from './regions';
import { versions } from './versions';
import { template } from './template';

export default new Config()
  .addSources({
    layers,
    regions,
    versions,
    template,
    serviceCheck: 'https://devearlywarning.cr.usgs.gov/api/rest/service-check/geoserver',
  })
  .debug();
