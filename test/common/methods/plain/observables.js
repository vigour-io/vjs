var Base = require('../../../../lib/base/')
var plain = require('vigour-js/lib/methods/plain')

describe('subclass.plain', function () {
  it('should work on instances of subclasses', function () {
    var Class = new Base({}).Constructor
    var Subclass = new Class({}).Constructor
    Object.getPrototypeOf(Subclass.prototype).inject(plain)
    var instance = new Subclass({
      prop: 'value'
    })
    var expected = {
      prop: 'value'
    }
    expect(instance.plain()).to.eql(expected)
  })
})
