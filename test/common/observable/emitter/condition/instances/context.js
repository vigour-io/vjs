'use strict'
describe('context', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var timer = 0
    var interval = setInterval(function () {
      if (timer < 1000) {
        timer += 50
      }
    }, 50)

    var fired = {
      a: { time: [], data: [] },
      b: { time: [], data: [] }
    }

    var a = new Observable({
      key: 'a',
      time: 100,
      on: {
        data: {
          condition (data, next, event) {
            setTimeout(() => next(), this.time.val)
          },
          val (data) {
            var key = this.path[0]
            fired[key].time.push(timer)
            fired[key].data.push(data)
          }
        }
      }
    })

    // fires for this as well make an overwrite settings
    var b = new a.Constructor({ key: 'b', time: 300 }) // eslint-disable-line
    a.val = 'a change!'

    setTimeout(function () {
      clearInterval(interval)
      expect(fired.a.time).to.deep.equal([ 100 ])
      expect(fired.b.time).to.deep.equal([ 300, 300 ])
      expect(fired.a.data).to.deep.equal([ 'a change!' ])
      expect(fired.b.data).to.deep.equal([ { key: 'b', time: 300 }, 'a change!' ])
      done()
    }, 400)
  })

  it('fires condition trigger on resolved instance', function (done) {
    var cnt = 0
    var a = new Observable({
      key: 'a',
      on: {
        data: {
          condition: function (data, next, event) {
            cnt++
            next()
          }
        }
      }
    })
    var b = new a.Constructor({ key: 'b' }, false)
    b.once(function () {
      expect(cnt).to.equal(1)
      done()
    })
    b.val = 'value'
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
