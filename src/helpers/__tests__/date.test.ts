import { getOrdinalDayOfYear, ordinalDayToDate } from '../date';

describe(`getOrdinalDayOfYear() - Return the day of the year`, () => {
  it('PASSES', () => {
    // April 11th, 2020
    const test = new Date(2020, 3, 11);
    expect(getOrdinalDayOfYear(test)).toEqual(102);
  });

  it('FAILS', () => {
    expect(() => getOrdinalDayOfYear(null)).toThrowError();
  });
});

describe(`ordinalDayToDate() - Convert an ordinal day to a Date object.`, () => {
  // April 11th, 2020 - day 102
  const date = new Date(2020, 3, 11);
  it('PASSES when passed a number.', () => {
    expect(ordinalDayToDate(102)).toBeDate().toStrictEqual(date);
  });

  it('PASSES when passed a stringified number.', () => {
    expect(ordinalDayToDate('102')).toBeDate().toStrictEqual(date);
  });

  it('FAILS when passed nothing.', () => {
    // @ts-expect-error
    expect(() => ordinalDayToDate()).toThrowError();
  });

  it('FAILS when passed an empty string.', () => {
    expect(() => ordinalDayToDate('')).toThrowError();
  });

  it('FAILS when passed null.', () => {
    expect(() => ordinalDayToDate(null)).toThrowError();
  });

  it('FAILS when passed `undefined`', () => {
    expect(() => ordinalDayToDate(undefined)).toThrowError();
  });
});

describe(`dateToDayOfYear()`, () => {
  it(`Ignores the leap year and returns the correct day for March 1, 2020`, () => {
    expect(getOrdinalDayOfYear(new Date(2020, 2, 1), true)).toBe(60);
  });
  it(`Returns the correct day for March 1, 2020 - does NOT ignore the leap year`, () => {
    expect(getOrdinalDayOfYear(new Date(2020, 2, 1), false)).toBe(61);
  });
  it(`Returns March 1, 2019 when passed Feb 29, 2019`, () => {
    // Not a leap year, so setting ignoreLeapYear to true or false has no effect.
    expect(getOrdinalDayOfYear(new Date(2019, 1, 29), true)).toBe(60);
    expect(getOrdinalDayOfYear(new Date(2019, 1, 29), false)).toBe(60);
  });
});
