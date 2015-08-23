var Base = require('../../base')
var Event = require('../../event')
var MetaEmitter = require('../on/metaemitter')
var subscribe = require('./function')

var set = MetaEmitter.prototype.$set



module.exports = new MetaEmitter({

	$define: {
		// $generateConstructor: function() {
		// 	return function SubsEmitter( val, event, parent, key ) {
		// 		console.error('SubsEmitter?!', event)
		//
		// 		if(val && event === void 0) {
		// 			console.error('make event?!')
		// 			event = new Event( this, '$change' )
		// 		}
		// 		this.$clearContext()
		// 		Base.call(this, val, event, parent, key )
		// 	}
		// },
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
			event = subscribe( target, this, event || void 0 )
			if(this._$emitting) {
				target.emit( this.$key, event )
			}
		}
	}
}).$Constructor
