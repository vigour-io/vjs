'use strict'
describe('context', function () {
  var Observable = require('../../../../../../lib/observable')

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

  describe('complex', function () {
    var Observable = require('../../../../../../lib/observable')
    var fired
    var timer
    var interval
    var a

    beforeEach(function () {
      clearInterval(interval)
      interval = setInterval(function () {
        if (timer < 1000) {
          timer += 50
        }
      }, 50)
      timer = 0
      fired = {
        a: { time: [], data: [] },
        b: { time: [], data: [] }
      }
      a = new Observable({
        key: 'a',
        time: 100,
        on: {
          data: {
            condition (data, next, event) {
              console.log('condition'.green.bold, ' ', data, this.path, event.stamp)
              setTimeout(() => next(), this.time.val)
            },
            val (data) {
              console.log('trigger condition'.green.bold, ' ', data, this.path)
              var key = this.path[0]
              fired[key].time.push(timer)
              fired[key].data.push(data)
            }
          }
        }
      })
    })

    it('fires condition trigger', function (done) {
      // fires for this as well make an overwrite settings
      var b = new a.Constructor({ key: 'b', time: 300 }) // eslint-disable-line
      a.val = 'a change!'
      setTimeout(function () {
        expect(fired.a.time).to.deep.equal([ 100 ])
        expect(fired.b.time).to.deep.equal([ 300, 300 ])
        expect(fired.a.data).to.deep.equal([ 'a change!' ])
        expect(fired.b.data).to.deep.equal([ { key: 'b', time: 300 }, 'a change!' ])
        done()
      }, 400)
    })

    it('fires condition trigger', function (done) {
      console.clear()
      var b = new Observable({
        key: 'b',
        trackInstances: true,
        nested: { useVal: new a.Constructor() }
      })
      var c = new b.Constructor({ key: 'c' }) // eslint-disable-line
      a.val = 'a change!'
      setTimeout(function () {
        console.log('ok ok ok', JSON.stringify(fired, false, 2))
      }, 400)
    })
  })
})
