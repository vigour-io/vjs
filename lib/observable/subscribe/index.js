"use strict";

var define = Object.defineProperty
var Base = require('../index')
var proto = Base.prototype

var $subscribe = module.exports = function $subscribe(subsObj, listeners, event){
	var target = this

	target = handleRefs(target, subsObj, listeners, event)

	console.log('---------- > $SUPSCRIBS', subsObj)

	subsObj.$each(function(sub, key){
			
		console.log('huppa subscribe to', key, 'with', sub.$val, 'in', target.$path)

		if(key === 'any$') { // any$ 
			// listen to changes on all properties
			if(sub.$val === true)	{ // directly
				console.log('burf?')
				target.$each(function(targetProp) {

					targetProp = handleRefs(targetProp, subsObj, listeners, event)

					targetProp.$set({
						$on: listeners
					})
					if(event) {
						console.log('also fire dems listeren')
						fireListeners(targetProp, listeners, event)
					}
				})
			} else { // nested
				target.$each(function(targetProp) {
					targetProp = handleRefs(targetProp, subsObj, listeners, event)
					targetProp.$subscribe(sub, listeners, event)
				})
			}

			// add property listener to add listeners inside new properties
			console.log('adding property listener to', target )
			target.$set({
				$on:{
					$property: function(event, meta) {
						console.error('property listener shmekt!', event, meta)
						var added = meta.added
						if(added) {
							for(var i = 0, addkey ; addkey = added[i] ; i++) {
								console.log('added', addkey)

								var targetProp = target[addkey]
								
								if(sub.$val === true) {
									targetProp.$set({
										$on: listeners
									})
								} else {
									targetProp.$subscribe(sub, listeners, event)
								}

							}
						}
					}	
				}
			})

		} else { // not any$ > specific key

			var targetProp = target[key]



			if(targetProp) { // property is present
				console.log('yes i have that key!', key)
				targetProp = handleRefs(targetProp, subsObj, listeners, event)

				if(sub.$val === true) {
					targetProp.$set({
						$on: listeners
					})

					if(event) {
						console.log('also fire dems listeren')
						fireListeners(targetProp, listeners, event)
					}

				} else {
					targetProp.$subscribe(sub, listeners, event)
				}

				
			} else { // property is not present
				console.log('i fear i do not have that key yet!', key)

				// add property listener to add listeners inside new properties
				target.$set({
					$on:{
						$property: function missingField(event, meta) {
							var added = meta.added
							if(added && added.indexOf(key) !== -1) {

								var targetProp = target[key]

								if(sub.$val === true) {
									targetProp.$set({
										$on: listeners
									})
									console.log('also fire dems listeren')
									fireListeners(targetProp, listeners, event)
								} else {
									targetProp.$subscribe(sub, listeners, event)
								}

								// TODO: remove this missingField listener, if all fields are present

							}
						}
					}
				})

			}
		}
	})
}

define(proto, '$subscribe', {
	value: $subscribe
})

// TODO: have a way to fire specific listeners for now use this:
function fireListeners(firer, listeners, event){
	for(var type in listeners) {
		listeners[type].call(firer, event)
	}
}

function handleRefs(target, subsObj, listeners, event) {
  while( target._$val instanceof Base ) {
  	console.error('hey reference!', target.$path)
  	target.$set({
  		$on:{
  			$reference: referenceListener
  		}
  	})
    target = target._$val
  }
  return target
}

function clean(target, oldRef) {

}

function referenceListener(event, oldvalue) {
	console.error('!!! reference listener !!!')
	clean(oldvalue)
	var target
	if(!(this._$val instanceof Base)) { // no longer a reference
		// remove refListener
		// this.$removeListener(referenceListener)

		// subscribe to self
		

	} else { // still a reference
		// subscribe to new reffed stuff
		
	}


	

	
	
}