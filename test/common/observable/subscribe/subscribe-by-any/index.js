var Observable = require('../../../../../lib/observable')
var SubsEmitter = require('../../../../../lib/observable/subscribe/emitter')

var L = 0
var log = window.log = prepLogger()
console.clear()
var counter
var h_self
var h_event
var h_meta

describe('subscribe-by-any', function() {

	describe('subscribe by any key already present', function(){
		var obs
		counter = 0
		obs = prepObs(
			{ key1: 'val1' },
			{ any$: true }
		)
		it.skip('should fire when subscribing', function() {
			// L = 1
			expect(counter).to.equal(1)
		})

		it.skip('should have correct meta', function() {

		})

		it('should fire when additional properties are added', function(){
			// L = 1
			counter = 0
			obs.set({
				key2: 'ha new value!'
			})
			expect(counter).to.equal(1)
		})

		it('should have correct meta', function() {
			expect(h_meta).to.have.property('_added')
				.which.has.property(0, obs.key2)
			expect(h_meta._added).to.not.have.property(1)
			expect(h_meta).to.have.property('key2', obs.key2)
		})

	})

	describe('subscribe by any key nested', function(){
		var obs
		counter = 0
		obs = prepObs(
			{ key1: { key2: { key3: 'heyval' } } },
			{ key1: { key2: { any$: true } } }
		)
		it.skip('should fire when subscribing', function() {
			expect(counter).to.equal(1)
		})

		it.skip('should fire on removal of property with any listener',
			function() {
				// L = 1
				log.header('removing does not fire!')
				log('obs.key1.key2.$on', obs.key1.key2.$on)
				log('obs.key1.key2.key3.$on', obs.key1.key2.key3.$on)

				// throw new Error('this doesn wurk')
				counter = 0
				obs.key1.key2.remove()
				expect(counter).to.equal(1)
			}
		)

		it.skip('should now have missing property listener',
			function() {
				L = 1
				log.header('heeu')
				log(obs.key1.$on)
			}
		)
	})


})


function prepObs(setobj, pattern) {
	var obs = new Observable({
		$key: 'obs',
		$on: {}
	})

	obs.set(setobj)

	var subsEmitter = new SubsEmitter({
		handerl1: function(event, meta) {
			log.event(this, event, meta)
			counter++
			h_self = this
			h_event = event
			h_meta = meta
		},
		$pattern: pattern
	}, false, obs.$on )


	obs.set({
		$on: {
			hashkey: subsEmitter
		}
	})

	return obs
}


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
		log.error('SubsEmitter HANDLER FIRED!', meta)
	  log.group()
	  log('this:', self, '\n')
	  log('meta:', meta, '\n')
	  log.groupEnd()
	}
	return log
}


function makeChecked(method) {
	return function() {
		if(typeof L !== 'undefined' && L) {
			method.apply(console, arguments)
			// TODO: log source line with new Error.stack but sourcemapped
		}
	}
}

function scrollDown(){
	window.scrollTo(0,document.body.scrollHeight)
}
