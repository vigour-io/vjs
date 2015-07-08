"use strict";

var define = Object.defineProperty
var Base = require('../index')
var proto = Base.prototype

var $subscribe = module.exports = function $subscribe(subsObj, listeners){
	var target = this

	console.error('$SUPSCRIBS', subsObj)

	subsObj.$each(function(sub, key){
			
		console.log('huppa subscribe to', key, 'with', sub, 'in', target)

		if(key === '$') {

		} else {
			var targetProp = target[key]

			if(targetProp) {
				console.log('yes i have that key!', key)
				targetProp.$set({
					$on: listeners
				})
			} else {
				console.log('i fear i do not have that key yet!', key)

			}
		}

		

		



	})


	if(subsObj.$val === true) {
		base.set({
			$on: listeners
		})
	} else {
		
	}
}

define(proto, '$subscribe', {
	value: $subscribe
})