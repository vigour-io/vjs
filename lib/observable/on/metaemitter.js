var Emitter = require('../../emitter')
var last
var MetaEmitter = module.exports = new Emitter({
	$define: {
		$meta: true,
		$emit: function metaEmit( event, bind, force, meta ) {
      if( this.$lastStamp !== event.$stamp ) {
        if( !force ) { // only change is here
          // console.log('meta postpone', bind)
          this.$postpone( bind, event )
        } else if( !event.$block ) {
          if( bind ) {
            this.$pushBind( bind, event )
          }
          // console.error('meta exec!', bind)
          this.$exec( bind, event )
        }
      }
		}
	}
}).$Constructor
