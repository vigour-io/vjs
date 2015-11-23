var Base = require('../../../../lib/base/')
var plain = require('vigour-js/lib/methods/plain')

describe('complex object.plain', function () {
  it('should work on regular objects with Base properties', function () {
    var base = new Base({
      prop: 'boom'
    })
    var obj = {
      base: base
    }
    var Class = new Base({
      obj: {
        useVal: obj
      }
    }).Constructor
    Class.prototype.inject(plain)
    var instance = new Class({})
    var expected = {
      obj: {
        base: {
          prop: 'boom'
        }
      }
    }
    expect(instance.plain()).to.eql(expected)
  })
})
