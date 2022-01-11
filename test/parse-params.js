const test = require('ava')
const { parseParams } = require('../src')

test('parses strings', (t) => {
  t.plan(1)
  const parsed = parseParams('foo=bar,baz=qux')
  t.deepEqual(parsed, { foo: 'bar', baz: 'qux' })
})

test('converts numbers', (t) => {
  t.plan(1)
  const parsed = parseParams('foo=bar,baz=5')
  t.deepEqual(parsed, { foo: 'bar', baz: 5 })
})

test('handles empty strings', (t) => {
  t.plan(1)
  const parsed = parseParams('foo=bar,baz=')
  t.deepEqual(parsed, { foo: 'bar', baz: '' })
})
