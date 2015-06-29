var test = require('../')
var describe = test.describe
var it = test.it
var expect = test.expect

describe('Basic instances (inheritance, $parent & $path)', function () {
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
        k3_2: 'v3_2',
        k3_3: {
          k3_3_1: 'v3_3_1'
        }
      }
    })
    first._$key = 'first'
    
    expect(first.k1.$val).to.equal('v1')
    expect(first.k2.$val).to.equal('v2')
    expect(first.k3.k3_1.$val).to.equal('v3_1')
    expect(first.k3.k3_2.$val).to.equal('v3_2')
    
    expect(first.k1.$parent).to.equal(first)
    expect(first.k3.k3_3.k3_3_1.$parent.$parent.$parent)
      .to.equal(first)

  })


  var second
  it( 'make second from first.$Constructor', function () {

    second = new first.$Constructor({
      k2: 'c2',
      k3: {
        k3_2: 'c3_2'
      }
    })
    second._$key = 'second'

    expect(second.k1.$val).to.equal('v1')
    expect(second.k2.$val).to.equal('c2')
    expect(second.k3.k3_1.$val).to.equal('v3_1')
    expect(second.k3.k3_2.$val).to.equal('c3_2')

    expect(second.k1.$parent).to.equal(second)
    expect(second.k3.k3_3.k3_3_1.$parent.$parent.$parent)
      .to.equal(second)
    expect(second.k2.$parent).to.equal(second)
    expect(second.k3.k3_2.$parent.$parent).to.equal(second)

  })


  it( 'path checks', function () {
    var first_path1 = first.k3.k3_3.k3_3_1.$path
    expect(first_path1).to.deep.equal(
      ["first", "k3", "k3_3", "k3_3_1"]
    )
    var first_path2 = first.k2.$path
    expect(first_path2).to.deep.equal(
      ["first", "k2"]
    )
    var first_path3 = first.k1.$path
    expect(first_path3).to.deep.equal(
      ["first", "k1"]
    )

    var second_path1 = second.k3.k3_3.k3_3_1.$path
    expect(second_path1).to.deep.equal(
      ["second", "k3", "k3_3", "k3_3_1"]
    )
    var second_path2 = second.k2.$path
    expect(second_path2).to.deep.equal(
      ["second", "k2"]
    )
    var second_path3 = second.k1.$path
    expect(second_path3).to.deep.equal(
      ["second", "k1"]
    )
  })

  it('set inheritable property on first', function(){
    first.$set({
      newfield: 'newvalue'
    })
    expect(first.newfield.$val).to.equal('newvalue')
  })

  it('change should reflect in second', function(){
    expect(second.newfield.$val).to.equal('newvalue')
  })

})
