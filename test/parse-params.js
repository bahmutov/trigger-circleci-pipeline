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

test('converts booleans', (t) => {
  t.plan(1)
  const parsed = parseParams('foo=true,baz=false')
  t.deepEqual(parsed, { foo: true, baz: false })
})

test('handles empty strings', (t) => {
  t.plan(1)
  const parsed = parseParams('foo=bar,baz=')
  t.deepEqual(parsed, { foo: 'bar', baz: '' })
})

test('handles parameters with commas in quotes', (t) => {
  t.plan(1)
  const parsed = parseParams('foo=bar,baz="qux,quux",name=John')
  t.deepEqual(parsed, { foo: 'bar', baz: 'qux,quux', name: 'John' })
})

test('handles parameters with quotes at the end', (t) => {
  t.plan(1)
  const parsed = parseParams('foo=bar,baz="qux quux"')
  t.deepEqual(parsed, { foo: 'bar', baz: 'qux quux' })
})

test('handles multiple parameters with quotes', (t) => {
  t.plan(1)
  const parsed = parseParams('foo=bar,baz="qux,quux",name=John,last="one two"')
  t.deepEqual(parsed, {
    foo: 'bar',
    baz: 'qux,quux',
    name: 'John',
    last: 'one two',
  })
})

test('handles parameters with quotes', (t) => {
  t.plan(1)
  const parsed = parseParams('foo=bar,baz="42 20",name=John')
  t.deepEqual(parsed, { foo: 'bar', baz: '42 20', name: 'John' })
})

test('handles parameters with @', (t) => {
  t.plan(1)
  const parsed = parseParams('GREP_TAGS=",@editing,@item",MACHINES=1')
  t.deepEqual(parsed, { GREP_TAGS: ',@editing,@item', MACHINES: 1 })
})

test('handles spaces', (t) => {
  t.plan(1)
  const parsed = parseParams('GREP_TAGS=",@editing,@item",  MACHINES = 1')
  t.deepEqual(parsed, { GREP_TAGS: ',@editing,@item', MACHINES: 1 })
})
