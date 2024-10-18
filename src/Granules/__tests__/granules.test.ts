import { parseISO } from 'date-fns';
import { Granule } from '../index';

const configJSON = {
  chirps_global_month_data: {
    dataType: 'RASTER',
    units: 'mm',
    period: 'month',
    continuous: false,
    start: {
      granule_start: '1981-01-01',
      granule_end: '1981-01-31',
    },
    end: {
      granule_start: '2020-01-01',
      granule_end: '2020-01-31',
    },
  },
  chirps_global_pentad_data: {
    dataType: 'RASTER',
    units: 'mm',
    period: 'pentad',
    continuous: false,
    start: {
      granule_start: '1981-01-01',
      granule_end: '1981-01-05',
    },
    end: {
      granule_start: '2020-01-26',
      granule_end: '2020-01-31',
    },
  },
  chirps_global_2month_data: {
    dataType: 'RASTER',
    units: 'mm',
    period: '2month',
    continuous: false,
    start: {
      granule_start: '1981-01-01',
      granule_end: '1981-02-28',
    },
    end: {
      granule_start: '2019-12-01',
      granule_end: '2020-01-31',
    },
  },
  chirps_global_3month_data: {
    dataType: 'RASTER',
    units: 'mm',
    period: '3month',
    continuous: false,
    start: { granule_start: '1981-01-01', granule_end: '1981-03-31' },
    end: { granule_start: '2019-12-01', granule_end: '2020-02-29' },
  },
  emodisndvic6v2_africa_dekad_data: {
    dataType: 'RASTER',
    units: 'mm',
    period: 'dekad',
    continuous: false,
    start: { granule_start: '2002-07-01', granule_end: '2002-07-10' },
    end: { granule_start: '2020-02-11', granule_end: '2020-02-20' },
  },
  swe_asia_day_data: {
    dataType: 'RASTER',
    units: 'mm',
    period: 'day',
    continuous: false,
    start: { granule_start: '2000-10-02', granule_end: '2000-10-02' },
    end: { granule_start: '2020-02-23', granule_end: '2020-02-23' },
  },
  eviirsndvi_camcar_pentad_pctm: {
    dataType: 'RASTER',
    published: true,
    units: null,
    region: 'camcar',
    period: 'pentad_10daycomposite',
    continuous: false,
    start: { granule_start: '2012-01-26', granule_end: '2012-02-05' },
    end: { granule_start: '2022-04-11', granule_end: '2022-04-20' },
  },
};

describe('Generates NON-CONTINUOUS granules', () => {
  it('Day Granules', () => {
    const config = configJSON.swe_asia_day_data;
    const granule = new Granule(
      {
        start: parseISO(config.start.granule_start),
        end: parseISO(config.end.granule_end),
        periodType: config.period,
        continuous: config.continuous,
      },
      {
        weekStartsOn: 0,
        ignoreLeapYear: true,
        granuleReference: 'start',
      }
    );
    expect(granule.intervals.length).toBeGreaterThan(0);

    const currentGranule = granule.activeInterval;

    granule.next();
    expect(granule.activeInterval).toEqual(currentGranule);

    granule.prev();
    expect(granule.activeInterval).toEqual(granule.intervals[granule.intervals.length - 2]);
  });

  it('Dekad Granules', () => {
    const config = configJSON.emodisndvic6v2_africa_dekad_data;
    const granule = new Granule(
      {
        start: parseISO(config.start.granule_start),
        end: parseISO(config.end.granule_end),
        periodType: config.period,
        continuous: config.continuous,
      },
      {
        weekStartsOn: 0,
        ignoreLeapYear: true,
        granuleReference: 'start',
      }
    );
    console.log(granule);
    expect(granule.intervals.length).toBeGreaterThan(0);
  });

  it('Pentad Granules', () => {
    const config = configJSON.chirps_global_pentad_data;
    const granule = new Granule(
      {
        start: parseISO(config.start.granule_start),
        end: parseISO(config.end.granule_end),
        periodType: config.period,
        continuous: config.continuous,
      },
      {
        weekStartsOn: 0,
        ignoreLeapYear: true,
        granuleReference: 'start',
      }
    );
    console.log(granule);
    expect(granule.intervals.length).toBeGreaterThan(0);
  });

  it(`Pentadal 10-Day Composite`, () => {
    const config = configJSON.eviirsndvi_camcar_pentad_pctm;
    const granule = new Granule(
      {
        start: parseISO(config.start.granule_start),
        end: parseISO(config.end.granule_end),
        periodType: config.period,
        continuous: config.continuous,
      },
      {
        granuleReference: 'start',
        weekStartsOn: 0,
        ignoreLeapYear: false,
      }
    );
    console.log(granule);
    expect(granule.intervals.length).toBeGreaterThan(0);
  });

  it('Month Granules', () => {
    const config = configJSON.chirps_global_month_data;
    const granule = new Granule(
      {
        start: parseISO(config.start.granule_start),
        end: parseISO(config.end.granule_end),
        periodType: config.period,
        continuous: config.continuous,
      },
      {
        weekStartsOn: 0,
        ignoreLeapYear: true,
        granuleReference: 'start',
      }
    );
    console.log(granule);
    expect(granule.intervals.length).toBeGreaterThan(0);
  });

  it('2-Month Granules', () => {
    const config = configJSON.chirps_global_2month_data;
    const granule = new Granule(
      {
        start: parseISO(config.start.granule_start),
        end: parseISO(config.end.granule_end),
        periodType: config.period,
        continuous: config.continuous,
      },
      {
        weekStartsOn: 0,
        ignoreLeapYear: true,
        granuleReference: 'start',
      }
    );
    console.log(granule);
    expect(granule.intervals.length).toBeGreaterThan(0);
  });

  it('3-Month Granules', () => {
    const config = configJSON.chirps_global_3month_data;
    const granule = new Granule(
      {
        start: parseISO(config.start.granule_start),
        end: parseISO(config.end.granule_end),
        periodType: config.period,
        continuous: config.continuous,
      },
      {
        weekStartsOn: 0,
        ignoreLeapYear: true,
        granuleReference: 'start',
      }
    );
    console.log(granule);
    expect(granule.intervals.length).toBeGreaterThan(0);
  });
});

describe('Generates CONTINUOUS granules', () => {
  it('Day Granules', () => {
    const config = configJSON.swe_asia_day_data;
    const granule = new Granule(
      {
        start: parseISO(config.start.granule_start),
        end: parseISO(config.end.granule_end),
        periodType: config.period,
        continuous: true,
      },
      {
        weekStartsOn: 1,
        ignoreLeapYear: false,
        granuleReference: 'start',
      }
    );
    console.log(granule);
    expect(granule.intervals.length).toBeGreaterThan(0);
  });

  it('Dekad Granules', () => {
    const config = configJSON.emodisndvic6v2_africa_dekad_data;
    const granule = new Granule(
      {
        start: parseISO(config.start.granule_start),
        end: parseISO(config.end.granule_end),
        periodType: config.period,
        continuous: true,
      },
      {
        weekStartsOn: 1,
        ignoreLeapYear: false,
        granuleReference: 'start',
      }
    );
    console.log(granule);
    expect(granule.intervals.length).toBeGreaterThan(0);
  });

  it('Pentad Granules', () => {
    const config = configJSON.chirps_global_pentad_data;
    const granule = new Granule(
      {
        start: parseISO(config.start.granule_start),
        end: parseISO(config.end.granule_end),
        periodType: config.period,
        continuous: true,
      },
      {
        weekStartsOn: 1,
        ignoreLeapYear: false,
        granuleReference: 'start',
      }
    );
    console.log(granule);
    expect(granule.intervals.length).toBeGreaterThan(0);
  });

  it('Month Granules', () => {
    const config = configJSON.chirps_global_month_data;
    const granule = new Granule(
      {
        start: parseISO(config.start.granule_start),
        end: parseISO(config.end.granule_end),
        periodType: config.period,
        continuous: false,
      },
      {
        weekStartsOn: 1,
        ignoreLeapYear: false,
        granuleReference: 'start',
      }
    );
    console.log(granule);
    expect(granule.intervals.length).toBeGreaterThan(0);
  });

  it('2-Month Granules', () => {
    const config = configJSON.chirps_global_2month_data;
    const granule = new Granule(
      {
        start: parseISO(config.start.granule_start),
        end: parseISO(config.end.granule_end),
        periodType: config.period,
        continuous: false,
      },
      {
        weekStartsOn: 1,
        ignoreLeapYear: false,
        granuleReference: 'start',
      }
    );
    console.log(granule);
    expect(granule.intervals.length).toBeGreaterThan(0);
  });

  it('3-Month Granules', () => {
    const config = configJSON.chirps_global_3month_data;
    const granule = new Granule(
      {
        start: parseISO(config.start.granule_start),
        end: parseISO(config.end.granule_end),
        periodType: config.period,
        continuous: false,
      },
      {
        weekStartsOn: 1,
        ignoreLeapYear: false,
        granuleReference: 'start',
      }
    );
    console.log(granule);
    expect(granule.intervals.length).toBeGreaterThan(0);
  });
});

describe(`Interval Filtering`, () => {
  const config = configJSON.swe_asia_day_data;
  const granule = new Granule(
    {
      start: parseISO(config.start.granule_start),
      end: parseISO(config.end.granule_end),
      periodType: config.period,
      continuous: config.continuous,
    },
    {
      weekStartsOn: 0,
      ignoreLeapYear: false,
      granuleReference: 'start',
    }
  );

  it(`Returns the interval based on an index.`, () => {
    const test = { start: '2000-10-02', end: '2000-10-02' };
    expect(granule.getIntervalByIndex(0)).toMatchObject(test);
  });

  it(`Returns the intervals in a given year`, () => {
    // granule end date is 2-23, with a leap year on a daily product === 54 intervals.
    expect(granule.getIntervalsInYear(2020)).toBeArray().toBeArrayOfSize(54);
  });

  it(`Gets the available months within the granules of a given year`, () => {
    const test = [
      {
        text: 'Jan',
        value: 1,
      },
      {
        text: 'Feb',
        value: 2,
      },
    ];
    expect(granule.getMonthsInIntervalInYear(2020)).toBeArray().toStrictEqual(test);
  });

  it(`Gets the year of a given interval`, () => {
    const interval = {
      start: '2020-01-01',
      end: '2020-01-05',
    };
    expect(granule.getYearOfInterval(interval)).toEqual(2020);
  });

  it(`Gets the year of the active interval.`, () => {
    expect(granule.getYearOfActiveInterval()).toEqual(2020);
  });

  it(`Sets the selected month index`, () => {
    const newIndex = 0; // January
    granule.setSelectedMonthIndex(newIndex);
    expect(granule.selectedMonthIndex).toEqual(0);
  });

  it(`Sets the selected year index`, () => {
    // const years = ['2020', '2019', '2018']
    granule.setSelectedYearIndex(2); // 2019
    expect(granule.selectedYearIndex).toEqual(2);
  });

  it(`Gets the selectable months for the selected month, and year`, () => {
    // month is 0 - January
    // year is 2019
    expect(granule.getSelectableMonths()).toBeArray().toBeArrayOfSize(12);
  });
});

describe(`Interval Filtering -- 10Day Composite`, () => {
  const config = configJSON.eviirsndvi_camcar_pentad_pctm;
  const granule = new Granule(
    {
      start: parseISO(config.start.granule_start),
      end: parseISO(config.end.granule_end),
      periodType: config.period,
      continuous: config.continuous,
    },
    {
      granuleReference: 'start',
      weekStartsOn: 0,
      ignoreLeapYear: false,
    }
  );

  let intervals = granule.getIntervalsWithinSelectedMonthYear();

  granule.setSelectedMonthIndex(0);

  intervals = granule.getIntervalsWithinSelectedMonthYear();

  console.log(granule);
});
