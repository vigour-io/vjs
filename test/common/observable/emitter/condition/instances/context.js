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
            console.log('fire listener (condition passed)'.green.bold.inverse, ' path: "' + this.path.join('.') + '"', data)
          }
        }
      }
    })

    // fires for this as well make an overwrite settings
    var b = new a.Constructor({ key: 'b', time: 300 }) // eslint-disable-line
    a.val = 'a change!'

    setTimeout(function () {
      expect(fired.a.time).to.deep.equal([100])
      expect(fired.b.time).to.deep.equal([300, 300])
      expect(fired.a.data).to.deep.equal(['a change!'])
      expect(fired.b.data).to.deep.equal([{key: 'b', time: 300}, 'a change!'])
      clearInterval(interval)
      done()
    }, 400)
  })

  it('fires condition trigger on resolved context', function (done) {
    console.clear()
    var a = new Observable({
      key: 'a',
      time: 10,
      on: {
        data: {
          condition: function (data, next, event) {
            next()
          }
        }
      }
    })
    var b = new a.Constructor()
    b.on(() => done())
    b.val = 'value'
  })
})
