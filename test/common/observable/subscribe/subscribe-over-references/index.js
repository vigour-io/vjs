var L = 0
var log = window.log = prepLogger()

var Observable = require('../../../../../lib/observable')
var SubsEmitter = require('../../../../../lib/observable/subscribe/emitter')

console.clear()

describe('subscribe-over-references', function() {

	it('subscribe over reference already present', function() {
		// ======================
		var $pattern = {
			ref: true
		}
		// ----------------------
		var handler
		var counter = 0
		var A = new Observable({
			$key: 'A',
			Akey: 'REFTHIS!'
		})

		var obs = new Observable({
			$key: 'obs',
			ref: A.Akey,
			$on: {}
		})

		var subsEmitter = new SubsEmitter({
			handerl1: function(event, meta) {
				log.event(this, event, meta)
				counter++
				if(handler) {
					handler(this, event, meta)
				}
			},
			$pattern: $pattern
		}, false, obs.$on)

		obs.set({
			$on: {
				durps: subsEmitter
			}
		})
		// ======================

		// L = 1

		handler = function(self, event, meta) {

		}

		log.header('ok fire over a reference bayne!')
		try{
			A.Akey.$val = 'ha change this reffed value!'
			log.warn('wut', A.Akey.$uid)
		} catch( e ) {
			log.error(e)
			throw e
		}

	})

	it.skip('change referenced value (not the reference itself)', function() {

	})

	it.skip('change reference to non reference with new endpoint', function() {

	})

	it.skip('should clean the previously referenced value', function() {

	})

	it.skip('change reference to non reference without new endpoint', function() {

	})

	it.skip('add endpoint to new non reference value', function() {

	})

	it.skip('change reference to other reference', function() {

	})

	it.skip('remove a reference that is subscribed over', function() {

	})

	it.skip('remove a referenced value', function() {

	})

	it.skip('reference a reference', function() {

	})

	it.skip('change the first reference', function() {

	})

	it.skip('change the second reference', function() {

	})

	it.skip('change multiple references in the same set', function() {

	})

})


function prepLogger(){
	var log = makeChecked(console.log)
	for(var k in console) {
		var thing = console[k]
		if(typeof thing === 'function') {
			log[k] = makeChecked(thing)
		}
	}
	log.header = function logHeader(header) {
		log(
			'%c------------- ' + header,
			'margin: 5px; color:blue; font-size: 16pt'
		)
	}
	log.event = function logEvent(self, event, meta) {
		log.error('SUBSEMITTER HANDLER FIRED!', meta)
	  log.group()
	  log('this:', self, '\n')
	  log('meta:', meta, '\n')
	  log.groupEnd()
	}
	return log
}


function makeChecked(thing) {
	return function() {
		if(typeof L !== 'undefined' && L) {
			return thing.apply(console, arguments)
		}
	}
}
