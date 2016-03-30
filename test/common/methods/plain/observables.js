var Base = require('../../../../lib/base/')
var plain = require('vigour-js/lib/methods/plain')

describe('subclass.plain', function () {
  it('should work on instances of subclasses', function () {
    var Class = new Base({}).Constructor
    Class.prototype.inject(plain)
    var Subclass = new Class({}).Constructor
    var instance = new Subclass({
      prop: 'value'
    })
    var expected = {
      prop: 'value'
    }
    expect(instance.plain()).to.eql(expected)
  })
})
