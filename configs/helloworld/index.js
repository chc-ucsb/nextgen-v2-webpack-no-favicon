import { Config } from '../../src/Config/Config';

// Project-specific dependencies
import '../../vendor/ext/4.2.1/ext-theme-neptune';

// Project-specific stylesheets.
import '../../assets/css/styles-mtbs-override.css';

// Project-specific config files.
import { layers } from './layers.json';
import { projections } from './projections.json';
import { regions } from './regions.json';
import template from './template.json';

export default new Config()
  .addSources({
    layers,
    projections,
    regions,
    template,
    serviceCheck: 'https://devearlywarning.cr.usgs.gov/api/rest/service-check/geoserver,mysql,pgsql,geoengine4',
  })
  .setAnalytics({
    matomo: '4',
    google: 'UA-102809644-1',
  })
  .debug();
