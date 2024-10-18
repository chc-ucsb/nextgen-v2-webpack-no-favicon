import { getRandomString, getUrlQueryString, hashCode, isEmptyString, isString, isURIComponentEncoded } from '../string';

describe(`getRandomString() - Generate a random alphanumeric string of an arbitrary length.`, () => {
  it(`PASSES if a length is supplied`, () => {
    expect(getRandomString(10)).toBeString();
  });

  it(`PASSES if the returned string is not empty`, () => {
    expect(getRandomString(10)).toBeString().toHaveLength(10);
  });

  it(`THROWS if length isn't supplied`, () => {
    expect(() => getRandomString(undefined)).toThrowError();
  });
});

describe(`hashCode() - Transform a given string into a numerical hash.`, () => {
  it(`Returns 0 if no string is passes.`, () => {
    expect(hashCode()).toBeNumber().toBe(0);
  });

  // it(`FAILS`)
});

// describe(`dataUriToBlob() - Convert a base64/URLEncoded data component to raw binary data held in a string.`, () => {});

describe(`isString() - Determine if a given input is a string.`, () => {
  it(`PASSES if the parameter is a string`, () => {
    expect(isString('foo')).toBeBoolean().toBeTrue();
  });

  it(`FAILS if the parameter is NOT a string`, () => {
    expect(isString(1)).toBeBoolean().toBeFalse();
  });
});

describe(`isEmptyString() - Determine if a given string is empty.`, () => {
  it(`PASSES if the input is ''`, () => {
    expect(isEmptyString('')).toBeBoolean().toBeTrue();
  });

  it(`FAILS if the input string is anything but ''`, () => {
    // @ts-expect-error
    expect(isEmptyString(0)).toBeBoolean().toBeFalse();
    // @ts-expect-error
    expect(isEmptyString({ a: 'foo', b: 'bar' }))
      .toBeBoolean()
      .toBeFalse();
    // @ts-expect-error
    expect(isEmptyString(['foo', 'bar']))
      .toBeBoolean()
      .toBeFalse();
  });
});

describe(`isURIComponentEncoded() - Determine if a URI component is encoded or not.`, () => {
  const testString = encodeURIComponent('foo bar');
  it(`PASSES if the input is encoded.`, () => {
    expect(isURIComponentEncoded(testString)).toBeBoolean().toBeTrue();
  });

  it(`FAILS if the input is not encoded.`, () => {
    expect(isURIComponentEncoded('foo bar')).toBeBoolean().toBeFalse();
  });
});

describe(`getUrlQueryString() - Get the query parameters from a URL.`, () => {
  it(`PASSES if the url contains query parameters.`, () => {
    const testString = 'https://www.testurl.com/?foo=bar';
    expect(getUrlQueryString(testString)).toBe('foo=bar');
  });

  it(`PASSES if the url doesn't contain query parameters.`, () => {
    const testString = 'https://www.testurl.com/';
    expect(getUrlQueryString(testString)).toBe(testString);
  });

  it(`THROWS if the input is not a string.`, () => {
    expect(() => getUrlQueryString(undefined)).toThrowError();
  });
});

// describe(`objToUrlQueryParams() - Transform an object into URL query parameters.`, () => {
// });

// describe(`parseGETURL() - Parses a url with GET parameters into a user-friendly object so you can access the parameter values.`, () => {});
//
// describe(`parseXML() - Determine if a given string is empty.`, () => {});
//
// describe(`truncateString() - Truncate a string to a given length, ending in an ellipsis.`, () => {});
//
// describe(`buildUrlParams() - Replaces all variable parameters in a url.`, () => {});
//
// describe(`isJSONValid - Determine if a given JSON object is valid or not.`, () => {});
//
// describe(`XMLtoJSON() - `, () => {});
//
// describe(`propExists() - Determine if a given string is not undefined, empty, or null.`, () => {});
//
// describe(`singleDigitToDouble() - Adds a leading zero to a single-digit number.`, () => {});
//
// describe(`wmstTimeToGranuleName() - Convert a WMS-Time string to a granule name.`, () => {});
