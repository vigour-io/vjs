var L = 0
describe('subscribe-by-key', function() {

	var Observable = require('../../../../lib/observable')
	var SubsEmitter = require('../../../../lib/observable/subscribe/emitter')



	describe('subscribe by key already present', function() {

		// ======================
		var $pattern = {
	    key1: true
	  }
	  // ----------------------
		var handler
		var counter = 0
		var obs = new Observable({
		  key1: 'val1',
		  $on: {}
		})
		obs._$key = 'obs'
		var subsEmitter = new SubsEmitter({
		  handerl1: function(event, meta) {
		  	log.event(this, event, meta)
		  	counter++
		  	if(handler) {
		  		log.header('boom ok do handler')
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

		it('should fire when property is changed with .$val', function(){
			L = 1
			log.header('11111111111')
			var h_self
			var h_event
			var h_meta
			handler = function(self, event, meta) {
				h_self = self
				h_event = event
				h_meta = meta
			}
			
			obs.key1.$val = 'heee'
			expect(counter).to.equal(1)
			expect(h_self).to.equal(obs)

			obs.key1.$val = 'ha'
			expect(counter).to.equal(2)
		})

		it('should fire when property is changed with .$set', function(){
			L = 1
			log.header('22222222222')
			var h_self
			var h_event
			var h_meta
			handler = function(self, event, meta) {
				h_self = self
				h_event = event
				h_meta = meta
			}
			
			counter = 0
			obs.key1.$val = 'dursh'

			// obs.set({
			// 	key1: 'dursh'
			// })
			expect(h_self).to.equal(obs)
			console.log('?!?!?!', counter)
			expect(counter).to.equal(1)
			obs.set({
				key1: 'shurkeeke'
			})
			expect(counter).to.equal(2)
		})

	})



	describe.skip('subscribe by key not yet present, then add', function() {

		// ======================
		var $pattern = {
	    key1: true
	  }
	  // ----------------------
		var handler
		var counter = 0
		var obs = new Observable({
		  $on: {}
		})
		obs._$key = 'obs'
		var subsEmitter = new SubsEmitter({
		  handerl1: function(event, meta) {
		  	logSubsEvent(event, meta)
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

		it('fires when property is added', function(){
			obs.set({
				key1: 'firstval'
			})
			expect(counter).to.equal(4)
		})

		it('fires when property is added', function(){

		})

	})

	describe.skip('remove subscribed over key, then add it anew', function() {

	})

	describe.skip('subscribe by multiple keys', function() {
		
	})

	describe.skip('subscribe by nested key', function() {
		
	})

	describe.skip('subscribe by multiple nested keys', function() {
		
	})

})

var log = makeChecked(console.log)

for(var k in console) {
	var thing = console[k]
	if(typeof thing === 'function') {
		log[k] = makeChecked(thing)
	}
}

function makeChecked(thing) {
	return function() {
		if(typeof L !== 'undefined' && L) {
			return thing.apply(console, arguments)
		}
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