'use strict'
describe('context', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var cnt = 0
    setInterval(function () {
      if (cnt < 1000) {
        cnt += 50
        console.warn('tick:', cnt)
      }
    },50)
    console.clear()
    var cnt = 0
    var dataCnt = 0
    var fired = []
    var a = new Observable({
      key: 'a',
      time: 100,
      on: {
        data: {
          condition (data, next, event) {
            console.log('fuck yu!', this.path, this.time.val) // wrong context!
            // context get switched around of course
            setTimeout(() => next(), this.time.val)
          },
          val (data) {
            console.log(' ---> ghello do ')
            console.log('  hello', data)
            fired.push(this.path[0])
            cnt++
            if (data === 'a change!') {
              dataCnt++
            }
            console.log('  ???', cnt, dataCnt, this.path)
            // this should fire 3 times for each context!
            if (cnt === 5 && dataCnt === 3) {
              // expect(fired).to.deep.eql(['b', 'c', 'a', 'b', 'c'])
              done()
            }
          }
        }
      }
    })
    console.log('---------------------------------')
    var b = new a.Constructor({ key: 'b', time: 300 })
    // var c = new b.Constructor({time: 30, key: 'c'}) // eslint-disable-line
    console.log('-----------a change--------------')
    // a en b!
    a.val = 'a change!'
  })

  xit('fires condition trigger on resolved context', function (done) {
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
