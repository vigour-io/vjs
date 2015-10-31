'use strict'
describe('input', function () {
  var Observable = require('../../../../../lib/observable')
  it('instance, block update on instance', function () {
    var cnt = 0
    var a = new Observable({
      key: 'a',
      on: {
        data (data) {
          console.log('fire:', data, this.path)
          cnt++
        }
      }
    })
    var b = new a.Constructor({
      key: 'b',
      val: 'this is b'
    })
    cnt = 0
    a.val = 'this is a!'
    expect(cnt).to.equal(1)
  })

  // so why does context not have the correct data???
  // and what are the implications?

  // same for always emitting instances -- how much heavier does it make things
  xit('context, block update on context', function () {
    // console.clear()
    var cnt = 0
    var a = new Observable({
      key: 'a',
      trackInstances: true,
      b: {
        on: {
          data (data) {
            cnt++
            console.log('fire:', data, this.path)
          }
        }
      }
    })
    var b = new a.Constructor({
      key: 'b',
      b: 'this is b!'
    })
    cnt = 0
    // console.clear()
    a.b.val = 'this is b!'
    expect(cnt).to.equal(1)
  })
})
