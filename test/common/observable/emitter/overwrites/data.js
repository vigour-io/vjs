'use strict'
describe('data', function () {
  var Observable = require('../../../../../lib/observable')
  it('instance, block update on instance', function () {
    var cnt = 0
    var a = new Observable({
      key: 'a',
      on: {
        data (data) {
          cnt++
        }
      }
    })
    var b = new a.Constructor({ //eslint-disable-line
      key: 'b',
      val: 'this is b'
    })
    cnt = 0
    a.val = 'this is a!'
    expect(cnt).to.equal(1)
  })

  it('instance, block update on instance, nested', function () {
    var cnt = 0
    var a = new Observable({
      key: 'a',
      on: {
        data (data) {
          cnt++
        }
      }
    })
    var b = new a.Constructor({ //eslint-disable-line
      key: 'b',
      randomField: true
    })
    cnt = 0
    a.set({ randomField: 'this is a!' })
    expect(cnt).to.equal(1)
  })

  it('instance, block update on instance, using val', function () {
    var cnt = 0
    var a = new Observable({
      key: 'a',
      on: {
        data (data) {
          cnt++
        }
      }
    })
    var b = new a.Constructor({ //eslint-disable-line
      key: 'b',
      val: 'this is b',
      randomField: true
    })
    cnt = 0
    a.set({ val: 'this is a!' })
    expect(cnt).to.equal(1)
  })

  describe('instance, block update on instance, nested removal', function () {
    var a, b, cnt, randomFieldCnt
    beforeEach(function () {
      cnt = 0
      randomFieldCnt = 0
    })
    it('fires once for instance creation', function () {
      a = new Observable({
        key: 'a',
        on: {
          data (data) {
            cnt++
          }
        },
        randomField: {
          on: {
            data (data) {
              console.log('yo cnt', this.path)
              randomFieldCnt++
            }
          }
        }
      })
      b = new a.Constructor({
        key: 'b'
      })
      expect(cnt).to.equal(1)
      expect(randomFieldCnt).to.equal(0)
    })

    it('fires once for instance field removal', function () {
      b.randomField.remove()
      expect(randomFieldCnt).to.equal(1)
      expect(cnt).to.equal(1)
      expect(b.randomField).to.equal(null)
    })

    it('fires once for set on origin', function () {
      a.set({ randomField: 'this is a!' })
      expect(randomFieldCnt).to.equal(1)
      expect(cnt).to.equal(0)
    })
  })

  it('instance, block update on instance, nested, property', function () {
    var cnt = 0
    var a = new Observable({
      key: 'a',
      on: {
        property (data) {
          cnt++
        }
      }
    })
    var b = new a.Constructor({ //eslint-disable-line
      key: 'b',
      randomField: true
    })
    cnt = 0
    a.set({ randomField: 'this is a!' })
    expect(cnt).to.equal(1)
  })

  it('context, block update on context', function () {
    var cnt = 0
    var a = new Observable({
      key: 'a',
      trackInstances: true,
      b: {
        on: {
          data (data) {
            cnt++
          }
        }
      }
    })
    var b = new a.Constructor({ //eslint-disable-line
      key: 'b',
      b: 'this is b!'
    })
    cnt = 0
    a.b.val = 'this is a!'
    expect(cnt).to.equal(1)
  })

  it('context nested, block update on context', function () {
    var cnt = 0
    var a = new Observable({
      key: 'a',
      trackInstances: true,
      b: {
        on: {
          data (data) {
            cnt++
          }
        }
      }
    })
    var b = new a.Constructor({ //eslint-disable-line
      key: 'b',
      b: { c: 'b' }
    })
    cnt = 0
    a.b.set({ c: 'a' })
    expect(cnt).to.equal(1)
  })
})
