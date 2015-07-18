var log = require('../../lib/dev/log')

//-------------------------------------------------------------

var Base = require('../../lib/base')

log('test property event type')
log('catch stamp!')
console.log('\n\n\n\nCATCH IT')

var burk = new Base({
  $key:'burk',
  $on: {
    $change: function(e) {
      log('hello change on typing', e)
    }
  }
})

burk.$set({
  gurken:true
})


log(burk.$on)

//how to overwrite $on listener on val
//make choice!

//if on(change) do ---

//add $$on method


burk.$remove()

