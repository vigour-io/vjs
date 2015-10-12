describe('combined', function () {
  var Observable = require('../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    console.clear()
    var cnt = 0
    var a = new Observable({
      key: 'a',
      b: {
        on: {
          data: {
            condition: function (data, done, event) {
              console.log('fire condition', this.path, data.key)
              setTimeout(done)
            }
          }
        }
      }
    })

    // behaviour now is fire for each -- im fix operator first
    // then we have batch
    // think about the inputs what to do with them -- context will become a nightmare -- context condition is only from the original
    // -- last things are fired with wrong time i geuss (the a time)
    // console.log('b!')
    var b = new a.Constructor({key: 'b'})
    // console.log('c!')
    // var c = new b.Constructor({time: 30, key: 'c'})
    // console.log('a!', 'context of condition needs to work')
    b.b.emit('data', '?')
  })
})
