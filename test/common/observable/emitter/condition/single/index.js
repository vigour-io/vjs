'use strict'
describe('direct', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var a = new Observable({
      val: 10,
      on: {
        data: {
          condition: function (data, cb, event) {
            if (data > 0) {
              setTimeout(cb, data)
            } else {
              cb(new Error('make number', data))
            }
          },
          val: function () {
            done()
          }
        }
      }
    })
    a.val = 20
  })

  it('fires error', function (done) {
    var a = new Observable({
      val: 10,
      on: {
        error: function (data) {
          done()
        },
        data: {
          condition: function (data, cb, event) {
            if (data > 0) {
              setTimeout(cb, data)
            } else {
              // also data
              cb(new Error('make number'))
            }
          }
        }
      }
    })
    a.val = 'aaa'
  })

  it('fires base listeners', function (done) {
    var cnt = 0
    var timer
    setTimeout(() => { timer = true }, 10)
    var a = new Observable({
      key: 'a',
      on: {
        data: {
          condition: function (data, next, event) {
            cnt++
            expect(this.path[0]).to.equal('a')
            setTimeout(next, 50)
          }
        }
      }
    })
    var b = new Observable({
      key: 'b',
      val: a
    })
    b.once(function (data) {
      expect(timer).to.equal(true)
      expect(data).to.equal('value')
      expect(cnt).to.equal(1)
      done()
    })
    a.val = 'value'
  })

  it('fires over reference', function (done) {
    var cnt = 0
    var timer
    setTimeout(() => { timer = true }, 10)
    var b = new Observable({ key: 'b' })
    var a = new Observable({
      key: 'a',
      val: b,
      on: {
        data: {
          condition: function (data, next, event) {
            cnt++
            expect(this.path[0]).to.equal('a')
            setTimeout(next, 50)
          }
        }
      }
    })
    a.once(function (data) {
      expect(timer).to.equal(true)
      expect(data).to.equal('value')
      expect(cnt).to.equal(1)
      done()
    })
    b.val = 'value'
  })
})
