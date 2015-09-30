describe('single instance', function () {
  var Observable = require('../../../../../../lib/observable')

  it('fires condition trigger', function (done) {
    var a = new Observable({
      on: {
        data: {
          condition: function (complete, event) {
            console.log('should do something...')
            setTimeout(complete, 1000)
          },
          val: function () {
            console.error('--->hey do it!')
            done()
          }
        }
      }
    })

    console.error('no way gozee')
    a.val = 'a change!'
  })
})

/*
  condition uses parseValue
  hands in the this to parseValue and continiues from there
  -- preferbly the this .input
  -- condition is responsible for setting .output
*/
