var L = 0

var log = window.log = prepLogger()
console.clear()
var handler
var h_self
var h_event
var h_meta
handler = function(self, event, meta) {
	h_self = self
	h_event = event
	h_meta = meta
}
describe('subscribe-by-key', function() {

	var Observable = require('../../../../../lib/observable')
	var SubsEmitter = require('../../../../../lib/observable/subscribe/emitter')

	describe('subscribe by key already present', function() {

		// ======================
		var $pattern = {
	    key1: true
	  }
	  // ----------------------

		var counter = 0
		var obs = new Observable({
			$key: 'obs',
		  key1: 'val1',
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

		it('should fire when property is changed with .$val', function(){
			// L = 1

			obs.key1.$val = 'heee'

			expect(counter).to.equal(1)
			expect(h_self).to.equal(obs)
			expect(h_meta).to.have.property('key1')
				.which.has.property('$val')
				.which.equals('heee')

			log('META', h_meta)
			// obs.key1.$val = 'ha'
			// expect(counter).to.equal(2)
		})

		it('should fire when property is changed with .set', function(){
			counter = 0
			obs.set({
				key1: 'shurkeeke'
			})
			expect(counter).to.equal(1)
			expect(h_self).to.equal(obs)
			expect(h_meta).to.have.property('key1')
				.which.has.property('$val')
				.which.equals('shurkeeke')

		})

	})



	describe('subscribe by key not yet present, then add', function() {

		// ======================
		var $pattern = {
	    key1: true
	  }
	  // ----------------------
		// var handler
		var counter = 0
		var obs = new Observable({
			$key: 'obs',
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

		it('fires when property is added', function(){
			log.header('2')

			counter = 0
			obs.set({
				key1: 'firstval'
			})

			expect(counter).to.equal(1)
			expect(h_self).to.equal(obs)
			expect(h_meta).to.have.property('_added')
				.which.has.property(0)
				.which.equals(obs.key1)

		})

		it('fires when previously added property is changed', function(){
			counter = 0
			obs.set({
				key1: 'flark'
			})
			expect(counter).to.equal(1)
			expect(h_self).to.equal(obs)
			expect(h_meta).to.have.property('key1')
				.which.equals(obs.key1)

			obs.key1.$val = 'shurk'
			expect(counter).to.equal(2)
			expect(h_self).to.equal(obs)
			expect(h_meta).to.have.property('key1')
				.which.equals(obs.key1)
		})

		it('should have removed missing property listener', function(){
			expect(obs.$on.$property.$attach).to.equal(null)
		})

	})

	describe('remove subscribed over key, then add it anew', function() {

		// ======================
		var $pattern = {
	    key1: true
	  }
	  // ----------------------
		var handler
		var counter = 0
		var obs = new Observable({
			$key: 'obs',
			key1: 'val1',
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

		it.skip('should fire when key is removed', function(){
			// L = 1
			log.header('ok remove shining')
			var check_meta
			handler = function(self, event, meta){
				log('handler!', self, event, meta)
				check_meta = meta
			}

			obs.key1.remove()
			expect(counter).to.equal(1)
		})
		it.skip('should fire when key is added anew', function(){
			log.warn('add anew!')
			obs.set({
				key1: 'newvalue'
			})
			expect(counter).to.equal(2)
		})
		it.skip('should fire when value is changed', function(){

		})
	})

	describe.skip('subscribe by multiple keys', function() {

	})

	describe.skip('subscribe by nested key', function() {

	})

	describe.skip('subscribe by multiple nested keys', function() {

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
