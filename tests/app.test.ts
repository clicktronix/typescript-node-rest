import { default as assert } from 'assert';

describe('App', () => {
  describe('App is working', () => {
    it('should return -1 when the value is not present', () => {
      const arr = [1, 2, 3];

      assert.equal(arr.indexOf(4), -1);
    });
  });
});
