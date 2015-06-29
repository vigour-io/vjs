var test = require('../')
var describe = test.describe
var it = test.it
var expect = test.expect

describe('Operators', function() {
  var Base
  it('require Base', function () {
    Base = require('../../lib/base')
  })

  var first
  it('use add on a number', function(){
    first = new Base({
      $val: 3,
      $add: 5
    })
    expect(first.$val).to.equal(8)
  })

  var second
  it('use add on an object', function(){
    second = new Base({
      key1: 'val1',
      $add: {
        addkey1: 'addval1',
        addkey2: 'addval2',
        $add: {
          nestedaddkey: 'nestedaddval'
        }
      }
    })
    second._$key = 'second'

    var val = second.$val

    expect(val.key1.$val).to.equal('val1')
    expect(val.addkey1.$val).to.equal('addval1')
    expect(val.addkey2.$val).to.equal('addval2')
    expect(val.nestedaddkey.$val).to.equal('nestedaddval')

    expect(val.nestedaddkey.$path).to.deep.equal(['second', '$results', 'nestedaddkey'])
    expect(val.nestedaddkey.$origin.$path).to.deep.equal(['second', '$add', '$add', 'nestedaddkey'])
  })

  
  it('use map', function(){
    var third = new Base({
      f1: 'val1',
      f2: 'val2',
      f3: 'val3',
      $map: function(property, key) {
        

        switch(key) {
          case 'f1':
            return 1
          break;
          case 'f2':
            return {$val: 2, $add: 4}
          break;
          case 'f3': 
            return function(val) {
              console.log('i now hold value', val, 'make me somethin?')
              return 'fnresult'
            }
          break;
        }
      }
    })


    expect(third.f1.$val).to.equal('val1')

    expect(third.$val.f2.$val).to.equal(6)

    var val = third.$val



    

    console.log('?!?!?', third.f1.$val)

    console.log('val', val.$toString())

  })





})
 