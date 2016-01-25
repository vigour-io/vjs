var Observable = require('vigour-js/lib/observable')

describe('remove listeners + multiple removes in one set', function () {
  var cnt = 0
  it('should fire all remove listeners covered by a set', function () {
    var purk = new Observable({
      p1: {
        on: {
          remove () {
            cnt++
          }
        }
      },
      p2: {
        on: {
          remove () {
            cnt++
          }
        }
      },
      p3: {
        on: {
          remove () {
            cnt++
          }
        }
      },
      p4: {
        on: {
          remove () {
            cnt++
          }
        }
      }
    })

    cnt = 0
    purk.set({
      p1: null,
      p2: null,
      p3: null,
      p4: null
    })
    expect(cnt).equals(4)
  })

  var Ding = new Observable({
    on: {
      remove () {
        cnt++
      }
    }
  }).Constructor

  var Holder = new Observable({
    ChildConstructor: Ding
  }).Constructor

  it('should fire for every Ding removed', function () {
    var holder = new Holder({
      p1: true,
      p2: true,
      p3: true,
      p4: true
    })
    cnt = 0
    holder.set({
      p1: null,
      p2: null,
      p3: null,
      p4: null
    })
    expect(cnt).equals(4)
  })

  require('./context')
})
