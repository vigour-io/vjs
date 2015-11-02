describe('combined', function () {
  var Observable = require('../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    
    var a = new Observable({
      key: 'a',
      b: {
        on: {
          data: {
            condition: function (data, next, event) {
              // do we want to use this data as an entry (emitter.data[stamp] ?)
              // maybe take it as input? we do need it for streams!
              expect(this._on.data.getData(event, this)).to.equal('?')
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
