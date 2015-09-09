var Emitter = require('../../emitter')
var hash = require('../../util/hash')
var propertyListener = require('./property')
var Event = require('../../event')
//moving listener
//references moving listener
//property listeners // moves etc

var SubsEmitter = new Emitter({
	$meta:true,
	$flags: {
		$pattern: function( val, event ) {
			//handle changing pattern (bit strange to do -- since key should change as well then)
			var target = this._$parent._$parent

			for(var i in val) {
				if(target[i]) {
					target[i].on([
						function( event, meta, subs ) {
							subs.emit( event, target)
						},
						this
					])
				}
			}

		}
	}
	//maybe do some extras dont know yet
}).$Constructor

exports.$define = {
	subscribe:function( pattern, val, key, unique, event  ){
		var stringified = JSON.stringify(pattern)
		var hashed = hash(stringified)
		var setObj

		if( !this.$on || !this.$on[hash]) {
			setObj = {$on:{}}
			setObj.$on[hashed] = new SubsEmitter()
			this.set(setObj)
			this.$on[hashed].set({$pattern:pattern})
		}

		this.on(hashed, val, key, unique, event)

	}
}
