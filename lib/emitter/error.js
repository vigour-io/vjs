"use strict"

var Emitter = require('./index.js')
var emit = Emitter.prototype.emit
//make more complex

module.exports = new Emitter({
  $define: {
    emit: function( event, bind, force, error ) {
      //this --> de current instance van de error emitter



      if(!error) {
        var path = this.$path
        if(path.length > 2) {
          path = path.slice(0,-2)
        }
        error = new Error( 'error on path: "' + path.join('.') +'" ')
      }

      console.log('emitter error!', arguments )
      emit.call( this, event, bind, force, error )
    }
  }
}).$Constructor
