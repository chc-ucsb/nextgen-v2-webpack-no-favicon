import '../../assets/css/amcharts-styles.css';

import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/serial';
import 'amcharts3/amcharts/plugins/export/export';

import { Charter } from '../Charter/Charter';

globalThis.App = {
  Charter: new Charter(),
};
