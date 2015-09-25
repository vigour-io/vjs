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
          change: function () {
            expect(this.val).msg('specialField').to.equal('hello')
            cnt2++
          }
        }
      },
      on: {
        change: function (event) {
          cnt++
          event.block = true
          this.set({
            specialField: 'xxxx',
            letsSee: true
          }, event)
          this.set({
            specialField: 'hello'
          }, event)
          event.block = null
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
        change: function () {
          cnt++
        }
      },
      x: {
        on: {
          change: function (event, meta) {
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
})
