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
    it('remove a.b pass correct data', function () {
      a.set({b: null})
      expect(dataRecieved).to.equal(null)
    })
  })

  describe('ChildConstructor', function () {
    var Observable = require('../../../../../../lib/observable')
    var dataRecieved
    beforeEach(function () {
      dataRecieved = {}
    })
    var obs = new Observable({
      key: 'root',
      on: {
        data: function (data, event) {
          dataRecieved[this.path.join('.')] = data
        }
      },
      ChildConstructor: 'Constructor'
    })

    it('set a.b.c pass correct data to each level', function () {
      var obsInstance = new obs.Constructor()
      // ok so for this we only want to send the correct information!
      obsInstance.set({
        a: {
          b: 200
        }
      })
      expect(dataRecieved['root']).deep.equals({a: {b: 200}})
      expect(dataRecieved['root.a']).deep.equals({b: 200})
      expect(dataRecieved['root.a.b']).deep.equals(200)
      // expect(dataRecieved).to.deep.equal({ a: { b: 200 }})
    })
  })
})
