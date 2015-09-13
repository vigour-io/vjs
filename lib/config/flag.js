var Config = require('./')

exports.$flags = {
  $config: function( val, event ) {
    console.log('should so some configurifig', val, event )
  }
}
