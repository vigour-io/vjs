var Emitter = require('../../emitter')
var hash = require('../../util/hash')

var SubsEmitter = new Emitter({
	$meta:true,
	$flags: {
		$pattern: function( val ) {
			console.log('xxxx', val)
		}
	}
	//maybe do some extras dont know yet
})

exports.$define = {
	subscribe:function( pattern, val, key, unique, event  ){
		var stringified = JSON.stringify(pattern)
		var hash = hash(stringified)
		var setObj = {$on:{}}

		if( !this.$on || !this.$on[hash]) {
			setObj[hash] = new SubsEmitter()
			this.set(setObj)
			this.$on[hash].$pattern = pattern
		} 

		this.on(hash, val, key, unique, event)
	}
}