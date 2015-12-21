var Observable = require('vigour-js/lib/observable')

describe('remove listeners + multiple removes in one set', function () {
  var cnt = 0
  it('should fire all remove listeners covered by a set', function () {
    var purk = new Observable({
      p1: {
        on: {
          remove () {
            console.log('REMOVE p1!')
            cnt++
          }
        }
      },
      p2: {
        on: {
          remove () {
            console.log('REMOVE p2!')
            cnt++
          }
        }
      },
      p3: {
        on: {
          remove () {
            console.log('REMOVE p3!')
            cnt++
          }
        }
      },
      p4: {
        on: {
          remove () {
            console.log('REMOVE p4!')
            cnt++
          }
        }
      }
    })

    cnt = 0
    console.clear()
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
        console.log('REMOVE!', this.path)
        cnt++
      }
    }
  }).Constructor

  var Holder = new Observable({
    ChildConstructor: Ding
  }).Constructor

  xit('should fire for every Ding removed', function () {
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
})
