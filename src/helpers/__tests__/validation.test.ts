import { isEmpty, isUndefined } from '../validation';

describe(`isUndefined() - Determine if an input is defined.`, () => {
  it(`PASSES if 'undefined' is passed.`, () => {
    expect(isUndefined(undefined)).toBeBoolean().toBeTrue();
  });

  it(`FAILS if a defined property is passed.`, () => {
    expect(isUndefined('defined')).toBeBoolean().toBeFalse();
  });
});

describe(`isEmpty() - Determine if a given input is empty.`, () => {
  it(`PASSES if an empty object is passed.`, () => {
    expect(isEmpty({})).toBeBoolean().toBeTrue();
  });

  it(`PASSES if an empty array is passed.`, () => {
    expect(isEmpty([])).toBeBoolean().toBeTrue();
  });

  it(`PASSES if an empty string is passed.`, () => {
    expect(isEmpty('')).toBeBoolean().toBeTrue();
  });

  it(`PASSES if a NaN is passed.`, () => {
    expect(isEmpty(NaN)).toBeBoolean().toBeTrue();
  });

  it(`FAILS if a non-empty object is passed.`, () => {
    const obj = { foo: 'bar' };
    expect(isEmpty(obj)).toBeBoolean().toBeFalse();
  });

  it(`FAILS if a non-empty array is passed.`, () => {
    expect(isEmpty(['foo']))
      .toBeBoolean()
      .toBeFalse();
  });

  it(`FAILS if a non-empty string is passed.`, () => {
    expect(isEmpty('foo')).toBeBoolean().toBeFalse();
  });

  it(`FAILS if a number is passed.`, () => {
    expect(isEmpty(1234)).toBeBoolean().toBeFalse();
  });

  it(`THROWS if a null property is passed.`, () => {
    expect(() => isEmpty(null)).toThrowError();
  });

  it(`THROWS if an undefined property is passed.`, () => {
    expect(() => isEmpty(undefined)).toThrowError();
  });
});
