// Simple utility tests for Next.js frontend

describe('Basic Math', () => {
  it('should add two numbers', () => {
    expect(1 + 1).toBe(2);
  });

  it('should subtract two numbers', () => {
    expect(5 - 3).toBe(2);
  });

  it('should multiply two numbers', () => {
    expect(3 * 4).toBe(12);
  });
});

describe('String Operations', () => {
  it('should concatenate strings', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World');
  });

  it('should check string length', () => {
    expect('test'.length).toBe(4);
  });

  it('should convert to uppercase', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
  });
});

describe('Array Operations', () => {
  it('should add elements to an array', () => {
    const arr = [1, 2];
    arr.push(3);
    expect(arr).toEqual([1, 2, 3]);
  });

  it('should check array length', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
  });

  it('should filter array', () => {
    const arr = [1, 2, 3, 4, 5];
    const filtered = arr.filter((n) => n > 3);
    expect(filtered).toEqual([4, 5]);
  });

  it('should map array', () => {
    const arr = [1, 2, 3];
    const mapped = arr.map((n) => n * 2);
    expect(mapped).toEqual([2, 4, 6]);
  });
});

describe('Object Operations', () => {
  it('should create an object', () => {
    const obj = { name: 'Test', value: 123 };
    expect(obj.name).toBe('Test');
    expect(obj.value).toBe(123);
  });

  it('should spread objects', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { ...obj1, c: 3 };
    expect(obj2).toEqual({ a: 1, b: 2, c: 3 });
  });
});

describe('Type Checking', () => {
  it('should check typeof', () => {
    expect(typeof 'hello').toBe('string');
    expect(typeof 123).toBe('number');
    expect(typeof true).toBe('boolean');
    expect(typeof {}).toBe('object');
    expect(typeof []).toBe('object');
    expect(typeof undefined).toBe('undefined');
  });

  it('should check Array.isArray', () => {
    expect(Array.isArray([])).toBe(true);
    expect(Array.isArray({})).toBe(false);
    expect(Array.isArray('string')).toBe(false);
  });
});

