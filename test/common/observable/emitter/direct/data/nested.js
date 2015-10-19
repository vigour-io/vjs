'use strict'
describe('nested', function () {
  describe('basic', function () {
    var Observable = require('../../../../../../lib/observable')
    var dataRecieved
    var a = new Observable({
      key: 'a',
      b: {
        on: {
          data: function (data) {
            dataRecieved = data
          }
        }
      }
    })
    it('set b from a, pass correct data', function () {
      a.set({b: 20})
      expect(dataRecieved).to.equal(20)
    })
    it('set a.b.val pass correct data', function () {
      a.b.val = 21
      expect(dataRecieved).to.equal(21)
    })
  })

  describe('ChildConstructor', function () {
    var Observable = require('../../../../../../lib/observable')
    var dataRecieved
    var obs = new Observable({
      on: {
        data: function (data, event) {
          dataRecieved = data
          console.log(this.path, 'datax', data)
        }
      },
      ChildConstructor: 'Constructor'
    })

    it('set a.b.c pass correct data', function () {
      var b = new obs.Constructor()
      console.clear()
      // ok so for this we only want to send the correct information!

      b.set({
        a: {
          b: 200
        }
      })
      // expect(dataRecieved).to.deep.equal({ a: { b: 200 }})
    })

  })
})
