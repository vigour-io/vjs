var Observable = require('../../../../../lib/observable')

describe('combine the power', function () {
  var a = new Observable()

  a.set({
    b: {
      c: true
    }
  })

  it('222!!!' , function () {
    console.log('222')

    a.b.subscribe({
      c: true
    })
  })

  it('111!!!' , function () {
    console.log('111')
    a.subscribe({
      b: {
        c: true
      }
    })
  })

})
