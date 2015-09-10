//injectable


var trackingEmitter = require('./emitter')

//globa tracking emitter



exports.$flags = {
  $track: function( val, event ) {

    console.error(val, event) //set event
    if(val === true ) {
      console.error('-----')

      //now also for all emitters that are allready there
      //this.$on --- each



      if(this.$on) {

      }
      this.$on.each( function( property) {
        //hello

      })

      this.on('$value', function( event, meta ) {
        console.log('lezzcheck this!', event, meta )
      }, 'track')

    }

  }
}
