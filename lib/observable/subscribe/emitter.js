var Base = require('../../base')
var MetaEmitter = require('../on/metaemitter')
var subscribe = require('./function')

var set = MetaEmitter.prototype.$set

module.exports = new MetaEmitter({
	$define: {
		$exclude: false
	},
	$on: {
		$newParent: {
			$useVal: function(parent, event) {
				var target = parent.$parent
				var pattern = this.$pattern
				subscribe( target, this.$pattern )
			}
		}
	},
	$flags: {
		$pattern: function( val, event ) {
			this.$pattern = new Base( val )
			var target = this.$parent.$parent
			// TODO: event should not be false here
			subscribe( target, this, event )
		}
	}
}).$Constructor
