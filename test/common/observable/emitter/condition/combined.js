'use strict'
describe('combined', function () {
  var Observable = require('../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var a = new Observable({
      key: 'a',
      b: {
        on: {
          data: {
            condition (val, next, event, data) {
              expect(data).to.equal('?')
              setTimeout(done)
            }
          }
        }
      }
    })
    var b = new a.Constructor({key: 'b'})
    b.b.emit('data', '?')
  })
})
