'use strict'
describe('data-argument', function () {
  var Observable = require('../../../../lib/observable')
  describe('instances', function () {
    var lastData
    var nestedlastData
    var a = new Observable({
      key: 'a',
      on: {
        data (data) {
          console.log('datax!', this.path, data)
          lastData = data
        }
      },
      nested: {
        on: {
          data (data) {
            console.log('datax!2', this.path, data)
            nestedlastData = data
          }
        }
      }
    })
    var b
    it('data should be a setobj', function () {
      b = new a.Constructor({
        key: 'b'
      })
      expect(lastData).to.deep.equal({ key: 'b'})
    })
    it('remove b-nested', function () {
      b.set({ nested: null })
      expect(nestedlastData).to.equal(null)
    })
    it('remove b', function () {
      b.remove()
      expect(lastData).to.equal(null)
    })
  })
})
