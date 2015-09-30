describe('single instance', function () {
  var Observable = require('../../../../../../lib/observable')

  it('fires condition trigger', function (done) {
    var a = new Observable({
      on: {
        data: {
          condition: function () {
            console.log('should do something...')
            done()
          }
        }
      }
    })
  })
})

/*
  condition uses parseValue
  hands in the this to parseValue and continiues from there
  -- preferbly the this .input
  -- condition is responsible for setting .output
*/
