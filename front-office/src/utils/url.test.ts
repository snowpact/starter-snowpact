import { describe, it, expect } from 'vitest';

import { urlJoin } from './url';

describe('urlJoin', () => {
  const testCases = [
    { input: [], expected: '' },
    { input: ['http://example.com', 'path', 'to', 'resource'], expected: 'http://example.com/path/to/resource' },
    { input: ['http://example.com/', '/path/', '/to/', '/resource/'], expected: 'http://example.com/path/to/resource' },
    { input: ['http://example.com', '', 'path', '', 'to', 'resource'], expected: 'http://example.com/path/to/resource' },
    { input: ['/', '/', '/'], expected: '/' },
    { input: ['http://example.com', 'path'], expected: 'http://example.com/path' },
    { input: ['https://example.com', 'path'], expected: 'https://example.com/path' }
  ];

  testCases.forEach(({ input, expected }) => {
    it(`should join ${JSON.stringify(input)} to ${expected}`, () => {
      expect(urlJoin(...input)).toEqual(expected);
    });
  });
});
