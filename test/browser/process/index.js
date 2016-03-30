
var app = require('../../../ui/app')
   .inject( require( '../../../ui/app/values' ) )

// console.clear()

app.state.val = 'blurf'
app.state.on('blurf', function() {
  console.log('BLURF!')
})
app.state.on('smurf', function() {
 console.log('smurf!')
})
// app.state.on(function( val ) {
//   alert(val)
// })

app.initialised.update()



// setTimeout(function() {




  // console.clear()
  console.log('setting smurf!')

  app.state.val = 'smurf'
  // app.initialised.update()
// }, 100)