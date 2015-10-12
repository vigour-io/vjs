describe('instances', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var cnt = 0
    var a = new Observable({
      on: {
        data: {
          condition: function (data, done, event) {
            setTimeout(done, 10)
          },
          val: function () {
            cnt++
            if (cnt === 2) {
              done()
            }
          }
        }
      }
    })
    var b = new a.Constructor()
    a.val = 'a change!'
  })
})

describe('context', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    console.clear()
    var cnt = 0
    var dataCnt = 0
    var fired = []
    var a = new Observable({
      key: 'a',
      time: 10,
      on: {
        data: {
          condition: function (data, done, event) {

            setTimeout(() => done(), this.time.val)
          },
          val: function (data) {
            fired.push(this.path[0])
            cnt++
            if(data === 'a change!') {
              dataCnt++
            }
            if (cnt === 5 && dataCnt === 3) {

              // expect(fired).to.deep.eql(['b', 'c', 'a', 'b', 'c'])
              done()
            }
          }
        }
      }
    })

    // behaviour now is fire for each -- im fix operator first
    // then we have batch

    // think about the inputs what to do with them -- context will become a nightmare -- context condition is only from the original
    // -- last things are fired with wrong time i geuss (the a time)

    var b = new a.Constructor({time: 200, key: 'b'})

    var c = new b.Constructor({time: 30, key: 'c'})

    a.val = 'a change!'
  })
})
