describe('subsemitter-emitloop', function() {

	var Event
	var Emitter
	var SubsEmitter
	var Observable

	it('requires', function(){
		Event = require( '../../../../lib/event' )
		Emitter = require( '../../../../lib/emitter' )
		SubsEmitter = require( '../../../../lib/observable/subscribe/emitter' )
		Observable = require( '../../../../lib/observable' )
	})

	it.skip('emits on SubsEmitter are meta-postponed ', function() {

		var timeline = []

		var obsA = new Observable()
		obsA._$key = 'obsA'
		var obsB = new Observable()
		obsB._$key = 'obsB'

		var subsemitter = new SubsEmitter({
			handler1: function(event) {
				console.error('xxxxxxxxxxxxxx obsB property handler', event.$stamp)
				timeline.push('B-subscribe')
			}
		}, void 0, obsB)

		obsA.on('$change', function(event) {
			console.error('------------ obsA change handler', event.$stamp)
			timeline.push('A-change')
			subsemitter.$emit(event, obsB)
		})

		obsB.on('$change', function(event) {
			console.error('------------ obsB change handler', event.$stamp)
			timeline.push('B-change')
			subsemitter.$emit(event, obsB)
			obsA.$val = 'chainge!'
		})

		obsB.on('$property', function(event) {
			console.error('------------ obsB property handler', event.$stamp)
			timeline.push('B-property')
			subsemitter.$emit(event, obsB)
		})

		obsB.set({
			newkey: 'val'
		})

		console.log('>>>>', timeline)
		// logs:
		// ["B-change", "A-change", "B-property", "B-subscribe", "B-subscribe"]

		expect(timeline).to.deep.equal(
			[ 'B-change', 'A-change', 'B-subscribe', 'B-property', 'B-subscribe' ]
		)




	})
	
})
