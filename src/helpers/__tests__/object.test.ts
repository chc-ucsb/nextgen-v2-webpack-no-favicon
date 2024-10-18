import { objPropExists, deepClone, getPropFromObject, convertPathToObjReference, convertPropsToUppercase, prettyPrintObject } from '../object';

const testObj = {
  Foo: 'bar',
  bar: 'FOO',
  b_az: 'baz',
  baz: {
    a: 1,
    b: [2, 3, 4],
    c: {
      d: {
        e: 'test',
      },
    },
  },
};

describe('objPropExists() - Checks if a property exists on an object.', () => {
  it('PASSES if a property exists on an object.', () => {
    const result = objPropExists(testObj, 'bar');
    expect(result).toBeBoolean().toBeTrue();
  });

  it(`FAILS if a property doesn't exist on an object.`, () => {
    const result = objPropExists(testObj, 'non-existent');
    expect(result).toBeBoolean().toBeFalse();
  });

  it(`THROWS if null is passed as a parameter.`, () => {
    expect(() => objPropExists(null, 'foo')).toThrowError();
  });

  it(`THROWS if undefined is passed as a parameter.`, () => {
    expect(() => objPropExists(undefined, 'foo')).toThrowError();
  });
});

describe('deepClone() - Deeply clone an object.', () => {
  const result = deepClone(testObj);

  it(`PASSES if the output matches the input`, () => {
    expect(result).toMatchObject(testObj);
  });

  it(`FAILS if the output doesn't match the input.`, () => {
    expect(result).not.toMatchObject({ foo: 'bar' });
  });
});

describe(`getPropFromObject() - Retrieve a property from an object.`, () => {
  it(`PASSES if the property exists.`, () => {
    const result = getPropFromObject(testObj, 'Foo');
    expect(result).not.toBeNull();
  });

  it(`Returns NULL if the property doesn't exist.`, () => {
    const result = getPropFromObject(testObj, 'non-existent');
    expect(result).toBeNull();
  });
});

describe(`convertPathToObjReference() - Dereference an object property path from a dot-notated string.`, () => {
  it(`PASSES if the path results in a property value being returned.`, () => {
    const path = 'baz.c.d.e';
    const result = convertPathToObjReference(testObj, path);
    expect(result).toMatch('test');
  });

  it(`FAILS if the path results in a property value of undefined`, () => {
    const path = 'not.a.path';
    const result = convertPathToObjReference(testObj, path);
    expect(result).toMatchObject({});
  });
});

// describe(`inherits() - Have a child object inherit properties from a parent.`, () => {
//   const obj = { q: () => 'test' };
//   it(`PASSES`, () => {
//     const result = inherits(testObj, obj);
//     expect(result)
//       .toBeObject()
//       .toHaveProperty('q');
//   });
//
//   it(`FAILS`, () => {});
// });

describe(`hasKey() - Determine if an object has a particular key set within its prototype.`, () => {
  const obj = { a: 'test', b: 'foo' };
  const prop = 'valueOf';

  it(`PASSES if the object does not have the key as a property. key is set on the object's prototype`, () => {
    expect(objPropExists(obj, prop)).toBeBoolean().toBeFalse();
  });

  // it(`FAILS`, () => {});
});

describe(`prettyPrintObject() - Print a formatted object to the console.`, () => {
  const result = prettyPrintObject(testObj);
  const stringified = JSON.stringify(testObj);

  it(`PASSES if the output is not the same as the regular non-spaced output from a JSON.stringify()`, () => {
    expect(result).not.toMatch(stringified);
  });

  it(`FAILS if the output length is not longer than the input length`, () => {
    expect(result.length).toBeGreaterThan(stringified.length);
  });
});

describe(`convertPropsToUppercase() - Format an object's properties to UPPERCASE.`, () => {
  it(`PASSES if all properties are UPPERCASE.`, () => {
    const result = convertPropsToUppercase(testObj);
    expect(result).toHaveProperty('FOO');
    expect(result).toHaveProperty('BAR');
    expect(result).toHaveProperty('B_AZ');
  });

  it(`THROWS if non-object is passed as a parameter.`, () => {
    expect(() => convertPropsToUppercase(['non-object'])).toThrowError();
  });
});
