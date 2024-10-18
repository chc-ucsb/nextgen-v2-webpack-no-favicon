import { first, last } from '../array';

describe('first() - Return the first element of an array.', () => {
  it(`PASSES if the first element is returned.`, () => {
    const arr = ['foo', 'bar', 'baz'];
    expect(first(arr)).toBeString().toBe('foo');
  });

  it(`Returns undefined if nothing is passed as a parameter.`, () => {
    expect(first()).toBeUndefined();
  });

  it(`THROWS if the passed parameter is NOT an array.`, () => {
    // @ts-expect-error
    expect(() => first('string')).toThrowError();
  });
});

describe('last() - Return the last element of an array.', () => {
  it(`PASSES if the last element is returned.`, () => {
    const arr = ['foo', 'bar', 'baz'];
    expect(last(arr)).toBeString().toBe('baz');
  });

  it(`Returns undefined if nothing is passed as a parameter.`, () => {
    expect(last()).toBeUndefined();
  });

  it(`THROWS if the passed parameter is NOT an array.`, () => {
    // @ts-expect-error
    expect(() => last('string')).toThrowError();
  });
});
