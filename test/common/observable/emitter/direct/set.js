'use strict'
describe('set', function () {
  var Observable = require('../../../../../lib/observable')
  var obs, cnt, cnt2

  beforeEach(function () {
    cnt = 0
    cnt2 = 0
  })

  it('creates an observable, does not fire listeners', function () {
    obs = new Observable({
      key: 'obs',
      specialField: {
        on: {
          data: function () {
            expect(this.val).msg('specialField').to.equal('hello')
            cnt2++
          }
        }
      },
      on: {
        data: function (data, event) {
          cnt++
          this.set({
            specialField: 'xxxx',
            letsSee: true
          }, event)
          this.set({
            specialField: 'hello'
          }, event)
        }
      }
    })
    expect(cnt).msg('obs listener fired').to.equal(0)
    expect(cnt2).msg('specialField fired').to.equal(0)
  })

  it('sets observable fires listeners once', function () {
    obs.set({ hello: true })
    expect(cnt).msg('obs4 listener fired').to.equal(1)
    expect(cnt2).msg('specialField fired').to.equal(1)
  })

  it('change nested fields , fire correct emitters', function () {
    var a = new Observable({
      key: 'a',
      on: {
        data: function () {
          cnt++
        }
      },
      x: {
        on: {
          data: function (data, event) {
            cnt2++
          }
        }
      }
    })
    a.set({
      x: true
    })
    expect(cnt).to.equal(0)
    expect(cnt2).to.equal(1)
  })

  it('extends emit to fire parents , fire correct emitters', function () {
    var emit = Observable.prototype.emit
    var valueIsSet
    var a = new Observable({
      key: 'a',
      on: {
        data: function () {
          valueIsSet = this.x.val
          cnt++
        }
      },
      x: {
        define: {
          emit: function (key, data, event, ignore) {
            var parent = this.parent
            var ret = emit.apply(this, arguments)
            while (parent) {
              parent.emit(key, data, event, ignore)
              parent = parent.parent
            }
            return ret
          }
        },
        on: {
          data: function (data, event) {
            cnt2++
          }
        }
      }
    })
    a.set({
      x: true
    })
    expect(cnt).msg('a').to.equal(1)
    expect(valueIsSet).to.equal(true)
    expect(cnt2).to.equal(1)
  })
})
