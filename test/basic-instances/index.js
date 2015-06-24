var test = require('../')
var describe = test.describe
var it = test.it
var expect = test.expect

describe( 'test Base Constructor', function () {
  var Base
  it( 'require Base', function () {
    Base = require('../../lib/base')
  })
  var first
  it( 'make first instance', function () {
    first = new Base({
      k1: 'v1',
      k2: 'v2',
      k3:{
        k3_1: 'v3_1',
        k3_2: 'v3_2'
      }
    })
    
    expect(first.k1.$val).to.equal('v1')
    expect(first.k2.$val).to.equal('v2')
    expect(first.k3.k3_1.$val).to.equal('v3_1')
    expect(first.k3.k3_2.$val).to.equal('v3_2')
    
  })


  var second
  it( 'make second from first.$Constructor', function () {

    second = new first.$Constructor({
      k2: 'c2',
      k3: {
        k3_2: 'c3_2'
      }
    })

    expect(second.k1.$val).to.equal('v1')
    expect(second.k2.$val).to.equal('c2')
    expect(second.k3.k3_1.$val).to.equal('v3_1')
    expect(second.k3.k3_2.$val).to.equal('c3_2')

  })


  it( 'changes in first reflect in non "own" properties', function () {
    
  })

})

