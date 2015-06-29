var test = require('../')
var describe = test.describe
var it = test.it
var expect = test.expect

describe('Bind', function() {

  var Base
  it('require Base', function () {
    Base = require('../../lib/base')
  })

  var first
  it('make first with first.a.b.c bound to ', function () {
    first = new Base({
      a: {
        b: {
          c: {
            $val: function() {
              return this.$path
            },
            $bind: function() {
              return this.$parent.$parent.$parent
            }
          }
        }
      }
    })
    first._$key = 'first'

    // console.log('first.a.b.c.$val', first.a.b.c.$val)
    expect(first.a.b.c.$val).to.deep.equal(['first'])
  })

  var second
  it('make second', function(){
    second = new first.$Constructor()
    second._$key = 'second'
    
    // console.log('second.a.b.c.$val', second.a.b.c.$val)
    expect(second.a.b.c.$val).to.deep.equal(['second'])
  })

})
