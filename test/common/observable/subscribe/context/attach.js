'use strict'
var Observable = require('../../../../../lib/observable')

describe('attach listeners in context', function () {
  it('can create attach listeners in multiple contexts', function () {
    var b = new Observable({
      key: 'b'
    })

    var dirty = new Observable({
      key: 'dirty'
    })

    var clean = new Observable({ key: 'clean' })

    var measure = {
      c: 0,
      b: 0,
      molly: {
        c: 0
      }
    }

    b.subscribe({
      yuzi: true
    }, [function () {
      measure[this.path[0]]++
    }, clean], 'drolly')

    var c = new b.Constructor({
      key: 'c'
    })

    c.subscribe({
      yuzi: true
    }, [function (data, event, thing) {
      measure.molly[this.path[0]]++
    }, dirty], 'molly')

    b.set({ yuzi: true })
    expect(measure).to.deep.equal({
      b: 1,
      c: 1,
      molly: {
        c: 1
      }
    })
  })
})
