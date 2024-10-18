// Required ExtJS dependency
import '../../vendor/ext/4.2.1/ext-all';

// Required stylesheets for dependencies
import 'PROJECT_EXTJS_THEME';
import 'ol/ol.css';
import '../../assets/css/font-awesome.min.css';
import '../../assets/css/extjs-styles.css';
import '../../assets/css/styles.css';

// @ts-ignore
// globalThis polyfill for Edge/IE browsers.
if (typeof globalThis !== 'object') window.globalThis = self;
