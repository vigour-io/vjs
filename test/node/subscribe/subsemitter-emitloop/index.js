describe('subsemitter-emitloop', function() {

	var Event
	var Emitter
	var SubsEmitter
	var Observable

	it.should('require', function(){
		Event = require( '../lib/event' )
		Emitter = require( '../lib/emitter' )
		SubsEmitter = require( '../lib/observable/subscribe/emitter' )
		Observable = require( '../lib/observable' )
	})

	it.skip('emits on SubsEmitter are meta-postponed ', function() {

		var obs = new Observable()

		var subsemitter = new SubsEmitter({
			listener: function( ) {
				console.log('subscription handler fired!')
			}
		})

		var emitterA = new Emitter({
			$change: {
				$val: function(event) {
					console.log('emitterA is fired')
				}
			}
		})

		var emitterB = new Emitter({
			$change: {
				$val: function(event) {
					console.log('emitterB is fired')
					subsemitter.$emit(event, obs)
					emitterA.$emit(event, obs)
					console.log('check out dat event!', event.$postponed)
				}
			}
		})

		var e = new Event()

		emitterB.$emit(e, obs)
		




	})
	
})
