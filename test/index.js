const test = require('tape');

test('42 is a number', t => {
  const actual = typeof 42;
  const expected = 'number';
  t.equal(actual, expected);

  t.end();
});
