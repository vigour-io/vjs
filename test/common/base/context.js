'use strict'
var Base = require('../../../lib/base')

describe('Base context', function () {
  var Foo = new Base().Constructor
  var a = new Base({
    key: 'a',
    nested: {
      properties: {
        foo: Foo
      }
    }
  })

  var b = new a.Constructor({
    key: 'b',
    nested: {
      foo: true
    }
  })

  var c = new b.Constructor({
    key: 'c'
  })

  it('nested property on c should have correct path', function () {
    expect(c.nested.foo.path).deep.equals(['c', 'nested', 'foo'])
  })
})
