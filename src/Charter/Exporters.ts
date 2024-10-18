import AmChart from 'amcharts/AmChart';
import { convertCrossYearDate } from '../helpers/chart';
import { getPeriodsPerMonth } from '../helpers/periodicity';
import { isEmptyString } from '../helpers/string';

export const Exporters = {
  PNG: {
    // png export customised to include the chart legend.
    defaultExport(chart: AmChart, options) {
      const filenameParts = [];

      if (typeof options.layerName !== 'undefined' && !isEmptyString(options.layerName)) {
        filenameParts.push(options.layerName);
      }

      if (typeof options.chartId !== 'undefined' && !isEmptyString(options.chartId)) {
        filenameParts.push(options.chartId);
      }

      chart.export.capture({}, function () {
        const width = this.setup.chart.realWidth > this.setup.chart.legend.divWidth ? this.setup.chart.realWidth : this.setup.chart.legend.divWidth;
        this.setup.fabric.setWidth(width);
        this.toPNG({}, function (data) {
          this.download(data, 'image/png', `${filenameParts.join('_')}.png`);
        });
      });
    },
  },

  // Custom csv formatters for downloading chart data.
  CSV: {
    // Exporter for most charts.
    monthlyExport(chart: AmChart, options) {
      const selectedPeriod = options.period;
      const { startMonth } = options;
      const filenameParts = [];

      if (typeof options.layerName !== 'undefined' && !isEmptyString(options.layerName)) {
        filenameParts.push(options.layerName);
      }

      if (typeof options.chartId !== 'undefined' && !isEmptyString(options.chartId)) {
        filenameParts.push(options.chartId);
      }

      chart.export.toJSON({}, function (data: string) {
        const dataObj = JSON.parse(data);
        // Because we use parseDates on AmCharts, to display cross year data correctly we have
        // to convert the period into a linear date. In order to format the csv output correctly,
        // we need to convert it back to the original here.
        const periodsPerMonth = getPeriodsPerMonth(selectedPeriod);
        const splitPeriod = (parseInt(startMonth) - 1) * periodsPerMonth + 1;
        const maxPeriods = periodsPerMonth * 12;
        let crossYearPeriodCount = 0;

        for (let i = 0, len = dataObj.length; i < len; i += 1) {
          const obj = dataObj[i];
          let period = parseInt(obj.period) - 1;
          let month = '';

          if (period + splitPeriod <= maxPeriods) {
            period += splitPeriod;
          } else {
            crossYearPeriodCount += 1;
            period = crossYearPeriodCount;
          }

          const { months } = globalThis.App.Config.sources.periods[selectedPeriod];

          const x = new Date(obj.x);
          if (periodsPerMonth === 1 || period % periodsPerMonth === 1) {
            month = months[x.getMonth()];
          }

          obj.Month = month;
          obj.Period = period;
          for (const prop in obj) {
            if (prop !== 'Month' && prop !== 'x' && prop !== 'period') {
              if (prop.indexOf('prelim') !== -1 && Object.prototype.hasOwnProperty.call(obj, prop.split(' ')[0])) {
                obj[prop] = null;
              } else {
                obj[prop] = `${Math.round(obj[prop] * 10000) / 10000}`;
              }
            }
          }
        }

        const headers = [];
        const values = [];
        for (let i = 0, len = dataObj.length; i < len; i += 1) {
          for (const prop in dataObj[i]) {
            if (headers.indexOf(prop) === -1) {
              // eslint-disable-next-line no-continue
              if (prop === 'value' || prop === 'groupLabel') continue;
              if (prop !== 'x' && prop !== 'name' && prop !== 'period') headers.push(prop);
              if (prop === 'name') headers.push('Year');
            }
          }
        }

        headers.sort(function (a, b) {
          if (b === 'Month') return 1;
          if (b === 'Period' && a !== 'Month') return 1;
          if (!Number.isNaN(parseInt(b)) && Number.isNaN(parseInt(a))) return -1;
          if (Number.isNaN(parseInt(b)) && !Number.isNaN(parseInt(a))) return 1;
          if (!Number.isNaN(parseInt(b)) && !Number.isNaN(parseInt(a))) return parseInt(a) - parseInt(b);
          return 0;
        });

        for (let i = 0, len = dataObj.length; i < len; i += 1) {
          for (let j = 0, { length } = headers; j < length; j += 1) {
            const header = headers[j];
            // The 'value' item is used for charting but is not needed for a CSV file, due to 'value; already being
            // a value to a key of 2020, 2020 prelim, etc. This is also why we don't need groupLabel, as its value
            // will appear under the column of 2020 Prelim/Gefs.
            // eslint-disable-next-line no-continue
            if (header === 'value' || header === 'groupLabel') continue;
            const value = dataObj[i][header] ? dataObj[i][header] : '';
            if (j === 0) {
              values.push(`\n${value}`);
            } else {
              values.push(value);
            }
          }
        }
        const csvOutput = `${headers.join(',')},${values.join(',')}`;
        this.download(csvOutput, 'text/csv', `${filenameParts.join('_')}.csv`);
      });
    },
    // Exporter for interannual charts.
    yearlyExport(chart: AmChart, options) {
      const filenameParts = [];

      if (typeof options.layerName !== 'undefined' && !isEmptyString(options.layerName)) {
        filenameParts.push(options.layerName);
      }

      if (typeof options.chartId !== 'undefined' && !isEmptyString(options.chartId)) {
        filenameParts.push(options.chartId);
      }

      chart.export.toJSON({}, function (data: string) {
        let dataObj = JSON.parse(data);
        const dataReformatted: any = {};
        const headers = ['Period'];
        const values = [];
        for (let i = 0, len = dataObj.length; i < len; i += 1) {
          headers.push(dataObj[i].x);
        }

        headers.sort(function (a, b) {
          if (b === 'Period') return 1;
          if (!Number.isNaN(parseInt(b)) && Number.isNaN(parseInt(a))) return -1;
          if (Number.isNaN(parseInt(b)) && !Number.isNaN(parseInt(a))) return 1;
          if (!Number.isNaN(parseInt(b)) && !Number.isNaN(parseInt(a))) return parseInt(a) - parseInt(b);
          return 0;
        });

        for (let i = 0, len = dataObj.length; i < len; i += 1) {
          for (const prop in dataObj[i]) {
            if (prop !== 'x' && prop !== 'name') {
              if (typeof dataReformatted[prop] === 'undefined') dataReformatted[prop] = {};

              dataReformatted[prop][dataObj[i].x] = dataObj[i][prop];
            }
          }
        }
        dataObj = dataReformatted;

        Object.keys(dataObj).map((prop) => {
          for (let j = 0, len = headers.length; j < len; j += 1) {
            const header = headers[j];
            if (header === 'Period') {
              values.push(`\n${prop}`);
            } else {
              values.push(dataObj[prop][header]);
            }
          }
        });

        const csvOutput = `${headers.join(',')},${values.join(',')}`;
        this.download(csvOutput, 'text/csv', `${filenameParts.join('_')}.csv`);
      });
    },
    sevenDayExport(chart: AmChart, options) {
      const selectedPeriod = options.period;
      const filenameParts = [];

      if (typeof options.layerName !== 'undefined' && !isEmptyString(options.layerName)) {
        filenameParts.push(options.layerName);
      }

      if (typeof options.chartId !== 'undefined' && !isEmptyString(options.chartId)) {
        filenameParts.push(options.chartId);
      }

      chart.export.toJSON({}, function (data: string) {
        const dataObj = JSON.parse(data);
        const weeksPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const headers = [];
        const yearData: any = {};
        for (let i = 0, len = dataObj.length; i < len; i += 1) {
          const { x } = dataObj[i];
          for (const prop in dataObj[i]) {
            if (prop !== 'x') {
              if (headers.indexOf(prop) === -1) {
                headers.push(prop);
              }

              const date = new Date(x);
              date.setFullYear(parseInt(prop));

              // Calculate weeks
              let week = 1;

              // Temp date is the first day of the month
              const tempDate = new Date(date.getFullYear(), date.getMonth(), 1);

              // Set temp date to the first Monday of the month
              while (tempDate.getDay() !== 1) {
                const nextDay = tempDate.getDate() + 1;
                tempDate.setDate(nextDay);
              }

              while (tempDate.getDate() < date.getDate()) {
                const nextWeekDay = tempDate.getDate() + 7;
                week += 1;
                tempDate.setDate(nextWeekDay);
              }

              if (weeksPerMonth[date.getMonth()] < week) weeksPerMonth[date.getMonth()] = week;

              if (typeof yearData[prop] === 'undefined') yearData[prop] = [];

              yearData[prop].push({
                value: dataObj[i][prop],
                month: date.getMonth(),
                week,
              });
            }
          }
        }

        headers.sort(function (a: string, b: string): number {
          if (Number.isNaN(parseInt(a)) && Number.isNaN(parseInt(b))) return 0; // Both are strings
          if (Number.isNaN(parseInt(a)) && !Number.isNaN(parseInt(b))) return -1; // a is a string, b is a number
          if (!Number.isNaN(parseInt(a)) && Number.isNaN(parseInt(b))) return 1; // a is a number, b is a string
          if (!Number.isNaN(parseInt(a)) && !Number.isNaN(parseInt(b))) return parseInt(b) - parseInt(a); // Both a and b are numbers
          return 0;
        });

        const values = [];
        for (let month = 0, len = weeksPerMonth.length; month < len; month += 1) {
          for (let week = 1; week <= weeksPerMonth[month]; week += 1) {
            if (week === 1) {
              values.push(`\r\n${globalThis.App.Config.sources.periods[selectedPeriod].months[month]}`);
            } else {
              values.push('\r\n');
            }

            values.push(week);

            for (let j = 0, { length } = headers; j < length; j += 1) {
              const header = headers[j];
              let found = false;

              for (let k = 0, yearLen = yearData[header].length; k < yearLen; k += 1) {
                if (yearData[header][k].month === month && yearData[header][k].week === week) {
                  found = true;
                  values.push(yearData[header][k].value);
                }
              }

              if (!found) values.push('');
            }
          }
        }

        headers.splice(0, 0, 'Month', 'Week');
        const csvOutput = `${headers.join(',')},${values.join(',')}`;
        this.download(csvOutput, 'text/csv', `${filenameParts.join('_')}.csv`);
      });
    },
    oneDayExport(chart: AmChart, options) {
      const { startMonth } = options;
      const { months } = globalThis.App.Config.sources.periods.day;
      const filenameParts = [];

      if (typeof options.layerName !== 'undefined' && !isEmptyString(options.layerName)) {
        filenameParts.push(options.layerName);
      }

      if (typeof options.chartId !== 'undefined' && !isEmptyString(options.chartId)) {
        filenameParts.push(options.chartId);
      }

      chart.export.toJSON({}, function (data: string) {
        const dataObj = JSON.parse(data);

        const headers = [];
        for (let i = 0, len = dataObj.length; i < len; i += 1) {
          for (const prop in dataObj[i]) {
            if (prop !== 'x') {
              if (headers.indexOf(prop) === -1) {
                headers.push(prop);
              }
            }
          }
        }

        headers.sort(function (a: string, b: string): number {
          if (Number.isNaN(parseInt(a)) && Number.isNaN(parseInt(b))) return 0; // Both are strings
          if (Number.isNaN(parseInt(a)) && !Number.isNaN(parseInt(b))) return -1; // a is a string, b is a number
          if (!Number.isNaN(parseInt(a)) && Number.isNaN(parseInt(b))) return 1; // a is a number, b is a string
          if (!Number.isNaN(parseInt(a)) && !Number.isNaN(parseInt(b))) return parseInt(b) - parseInt(a); // Both a and b are numbers
          return 0;
        });

        const rows = [];
        let prevMonth = null;
        for (let i = 0, len = dataObj.length; i < len; i += 1) {
          const { x } = dataObj[i];
          const date = new Date(x);
          const day = date.getDate();
          const month = date.getMonth();
          const monthText = month === prevMonth ? '' : months[month];
          prevMonth = month;
          const row = [monthText, day];
          for (let j = 0, { length } = headers; j < length; j += 1) {
            const header = headers[j];
            let value = '';
            if (Object.prototype.hasOwnProperty.call(dataObj[i], header)) {
              value = dataObj[i][header];
            }
            row.push(value);
          }
          rows.push(row);
        }

        let csvOutput = `${['month', 'day'].concat(headers).join(',')}\r\n`;
        for (let i = 0, len = rows.length; i < len; i += 1) {
          csvOutput += `${rows[i].join(',')}\r\n`;
        }
        this.download(csvOutput, 'text/csv', `${filenameParts.join('_')}.csv`);
      });
    },
  },
};
