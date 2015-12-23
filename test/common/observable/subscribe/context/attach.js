'use strict'
var Observable = require('../../../../../lib/observable')

var colors = require('colors-browserify')
describe('attach listeners in context', function () {

  it('can create attach listeners in multiple contexts', function () {


    var b = new Observable({
      key: 'b'
    })

    var dirty = new Observable({
      key: 'dirty'
    })

    var clean = new Observable({ key: 'clean' })

    b.subscribe({
      yuzi: true
    }, [function () {
      console.log('power ballz'.magenta, this.path.join('.'))
    }, clean], 'drolly')

    var c = new b.Constructor({
      key: 'c'
    })

    c.subscribe({
      yuzi: true
    }, [function (data, event, thing) {
      console.log('power ballz context boy'.magenta, this.path.join('.'), thing)
    }, dirty], 'molly')


    console.log(c)
    b.set({ yuzi: true })

  })

})
