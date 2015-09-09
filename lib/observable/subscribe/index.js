var Emitter = require('../../emitter')
var hash = require('../../util/hash')

//moving listener

//references moving listener

//property listeners // moves etc

var SubsEmitter = new Emitter({
	$meta:true,
	$flags: {
		$pattern: function( val ) {
			//handle changing pattern (bit strange to do -- since key should change as well then)

			for(var i in val) {

			}






		}
	}
	//maybe do some extras dont know yet
}).$Constructor

exports.$define = {
	subscribe:function( pattern, val, key, unique, event  ){
		var stringified = JSON.stringify(pattern)
		var hashed = hash(stringified)
		var setObj = {$on:{}}
		if( !this.$on || !this.$on[hash]) {
			setObj.$on[hashed] = new SubsEmitter()
			this.set(setObj)
			this.$on[hashed].set({$pattern:pattern})
		}
		this.on(hashed, val, key, unique, event)
	}
}
