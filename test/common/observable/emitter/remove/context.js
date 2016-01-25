'use strict'

//resolve context for remove
describe('context', function () {
  var a
  var Observable = require('../../../../../lib/observable')
  var Event = require('../../../../../lib/event')
  it('create context observable', function () {
    a = new Observable({
      key: 'a',
      trackInstances: true,
      b: {
        trackInstances: true,
        c: {
          trackInstances: true
        }
      }
    })
  })

  it('removes and resolves context', function () {
    var b = new a.Constructor()
    expect(b.b).to.equal(a.b)
    b.b.c.remove()
    expect(b.b).to.not.equal(a.b)
  })

  it('removes and resolves context, with a delayed event', function () {
    var b = new a.Constructor()
    var ev = new Event()
    expect(b.b).to.equal(a.b)
    b.b.c.remove(ev)
    expect(b.b).to.not.equal(a.b)
    expect(b.b.c).to.be.ok
    ev.trigger()
    expect(b.b.c).to.be.not.ok
  })
})
