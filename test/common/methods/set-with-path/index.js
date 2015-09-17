var Base = require('../../../../lib/base/')
var SetWithPath = require('../../../../lib/methods/setWithPath')

Base.prototype.inject(SetWithPath)

describe('setWithPath', function() {
  var a

  beforeEach(function() {
    a = new Base({
      $key: 'a'
    })
  })

  it('should set and get the $val', function() {
    var result = a.setWithPath('x.y.z', {
      $val: 'rahh'
    })

    expect(a.x.y.z.$val).to.eql('rahh')
    expect(result).to.eql(a.x.y.z)
  })

  it('should be able to set the $val within path string', function() {
    var result = a.setWithPath('j.k.l.$val', 'rahh')

    expect(a.j.k.l.$val).to.eql('rahh')
    expect(result).to.eql('rahh')
  })

  it('should set the path but be empty when set is not defined', function() {
    var result = a.setWithPath('o.p.q')

    expect(a.o.p.q).to.be.defined
    expect(a.o.p.q).to.be.instanceOf(Base)
    expect(a.o.p.q._$input).to.be.undefined
  })

})
