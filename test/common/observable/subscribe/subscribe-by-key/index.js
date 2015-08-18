
var Observable = require('../../../../../lib/observable')
var SubsEmitter = require('../../../../../lib/observable/subscribe/emitter')

var L = 0
var log = window.log = prepLogger()
console.clear()

var counter
var h_self
var h_event
var h_meta

describe('subscribe-by-key', function() {

	describe('subscribe by key already present', function() {

		var obs = prepObs(
			{ key1: 'val1' },
			{ key1: true }
		)

		it.skip('should fire emediately after subscribing', function(){
			counter = 0
			obs = prepObs(
				{ key1: 'val1' },
				{ key1: true }
			)
			expect(counter).to.equal(1)

		})

		it('should fire when property is changed with .$val', function(){
			// L = 1
			counter = 0
			try{
				obs.key1.$val = 'heee'
			} catch(e) {
				console.error(e)
			}


			expect(counter).to.equal(1)
			expect(h_self).to.equal(obs)
			expect(h_meta).to.have.property('key1')
				.which.equals(obs.key1)

		})

		it('should fire when property is changed with .set', function(){
			counter = 0
			obs.set({
				key1: 'shurkeeke'
			})
			expect(counter).to.equal(1)
			expect(h_self).to.equal(obs)
			expect(h_meta).to.have.property('key1')
				.which.equals(obs.key1)

		})

	})

	describe('subscribe by key not yet present, then add', function() {

		var obs

		it('should not fire on subscribing', function(){
			counter = 0
			obs = prepObs(
				{},
				{ key1: true }
			)
			expect(counter).to.equal(0)
		})

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

			expect(h_meta).to.have.property('key1')
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

		var obs = prepObs(
			{ key1: 'val1' },
			{ key1: true }
		)

		it('should fire when key is removed', function(){
			// L = 1
			counter = 0
			var key1 = obs.key1
			obs.key1.remove()
			expect(counter).to.equal(1)
			expect(h_meta).to.have.property('key1').which.equals(key1)
		})

		it('should now have missing property handler', function(){
			// L = 1
			expect(obs).to.have.property('$on')
				.which.has.property('$property')
				.which.has.property('$attach')
				.which.has.property(1)

			var attach = obs.$on.$property.$attach
			expect(attach).to.have.property(1)
			expect(attach).to.not.have.property(2)
			var attached = attach[1]
			expect(attached).to.have.property(0)
				.which.has.property('name')
				.which.equals('missingPropHandler')
			expect(attached).to.have.property(1)
					.which.equals(obs.$on.hashkey)
		})

		it('should fire when key is added anew', function(){
			// L = 1
			counter = 0
			obs.set({
				key1: 'newvalue'
			})
			expect(counter).to.equal(1)
			expect(h_self).to.equal(obs)
			expect(h_meta).to.have.property('_added')
				.which.has.property(0)
				.which.equals(obs.key1)

			expect(h_meta).to.have.property('key1')
				.which.equals(obs.key1)
		})

		it('should have removed missing property listener', function(){
			expect(obs.$on.$property.$attach).to.equal(null)
		})

		it('should fire when value is changed', function(){
			counter = 0
			obs.key1.$val = 'changedval'
			expect(counter).to.equal(1)
			expect(h_self).to.equal(obs)
			expect(h_meta).to.have.property('key1')
				.which.equals(obs.key1)
		})
	})

	describe('subscribe by multiple keys', function() {
		var obs

		it('should fire with multiple keys present', function(){
			// L = 1
			counter = 0
			obs = prepObs(
				{ key1: 'val1', key2: 'val2' },
				{ key1: true, key2: true }
			)

			// TODO expect it to fire emidiately
			// expect(counter).to.equal(1)

			obs.set({
				key1: 'val1_changed',
				key2: 'val2_changed'
			})
			expect(counter).to.equal(1)
			expect(h_self).to.equal(obs)
			expect(h_meta).to.have.property('key1')
				.which.equals(obs.key1)
			expect(h_meta).to.have.property('key2')
				.which.equals(obs.key2)
		})

		it( 'should not fire emediately after subscribing when all fields'+
			' are missing', function(){
			counter = 0
			obs = prepObs(
				{  },
				{ key1: true, key2: true }
			)
			expect(counter).to.equal(0)
		})

		it('should have one "missing property listener"', function(){
			expect(obs).to.have.property('$on').which.has.property('$property')
				.which.has.property('$attach')
			var attach = obs.$on.$property.$attach
			expect(attach).to.not.have.property(2)
		})

		it('should fire when multiple missing, then adding all', function(){
			counter = 0
			obs = prepObs(
				{  },
				{ key1: true, key2: true }
			)

			expect(counter).to.equal(0)

			obs.set({
				key1: 'val1_added',
				key2: 'val2_added'
			})

			expect(counter).to.equal(1)
			expect(h_self).to.equal(obs)
			expect(h_meta).to.have.property('key1')
				.which.equals(obs.key1)
			expect(h_meta).to.have.property('key2')
				.which.equals(obs.key2)
			expect(h_meta).to.have.property('_added')
			var added = h_meta._added
			expect(added).to.have.property(0)
				.which.equals(obs.key1)
			expect(added).to.have.property(1)
				.which.equals(obs.key2)
		})

		it('should fire when multiple missing, then adding one', function(){
			counter = 0
			obs = prepObs(
				{  },
				{ key1: true, key2: true }
			)
			expect(counter).to.equal(0)

			obs.set({
				key1: 'val1_added'
			})

			expect(counter).to.equal(1)
			expect(h_self).to.equal(obs)
			expect(h_meta).to.have.property('key1')
				.which.equals(obs.key1)
			expect(h_meta).to.not.have.property('key2')
			expect(h_meta).to.have.property('_added')
			var added = h_meta._added
			expect(added).to.have.property(0)
				.which.equals(obs.key1)
			expect(added).to.not.have.property(1)
		})

		it('should still have missing property handler', function(){
			expect(obs).to.have.property('$on')
				.which.has.property('$property')
				.which.has.property('$attach')
				.which.has.property(1)

			var attached = obs.$on.$property.$attach[1]

			expect(attached).to.have.property(0)
				.which.has.property('name')
				.which.equals('missingPropHandler')

			expect(attached).to.have.property(1)
					.which.equals(obs.$on.hashkey)
		})

		it('should fire when next property is added', function(){
			counter = 0
			obs.set({
				key2: 'val2_added'
			})

			expect(counter).to.equal(1)
			expect(h_self).to.equal(obs)
			expect(h_meta).to.have.property('key2')
				.which.equals(obs.key2)
			expect(h_meta).to.not.have.property('key1')
			expect(h_meta).to.have.property('_added')
			var added = h_meta._added
			expect(added).to.have.property(0)
				.which.equals(obs.key2)
			expect(added).to.not.have.property(1)
		})

		it('should have removed missing property listener', function(){
			expect(obs.$on.$property.$attach).to.equal(null)
		})

	})

	describe('subscribe by nested key', function() {
		var obs
		it('should not fire when intermediate steps are added', function(){
			// L = 1
			counter = 0
			obs = prepObs(
				{ },
				{ key1: { key2: { key3: true } } }
			)
			expect(counter).to.equal(0)
			obs.set({
				key1: { otherkey: true }
			})
			expect(counter).to.equal(0)
		})

		it('should have removed missing property listener from obs',
			function() {
				expect(obs).to.have.property('$on')
					.which.has.property('$property')
					.which.has.property('$attach')
					.which.equals(null)
			}
		)

		it('should have added a missing property listener to obs.key1',
			function() {
				expect(obs).to.have.property('key1')
					.which.has.property('$on')
					.which.has.property('$property')
					.which.has.property('$attach')
					var attach = obs.key1.$on.$property.$attach
					expect(attach).to.have.property(1)
						.which.has.property(0)
						.which.has.property('name')
						.which.equals('missingPropHandler')
					expect(attach).to.not.have.property(2)
			}
		)

		it('should fire when target is finally added', function(){
			// L = 1
			counter = 0
			obs.key1.set({
				key2: {
					key3: 'set dat val!'
				}
			})
			expect(counter).to.equal(1)
		})

		it('should have correct meta', function(){
			// L = 1
			expect(h_meta).to.have.property('key1')
			var key1 = h_meta.key1
			expect(key1).to.have.property('_added')
				.which.has.property(0, obs.key1.key2)
			expect(key1).to.have.property('key2')
				.which.has.property('key3', obs.key1.key2.key3)

		})
		var propcache
		it('should fire when intermediate property is removed', function(){

			L = 1
			log.header('look at listeners on key3')
			log(obs.key1.key2.key3.$on)

			// obs.key1.key2.key3.$val = 'SHRU'
			log('??', obs.key1.key2.key3.$on.$property)
			log('??', obs.key1.key2.$on && obs.key1.key2.$on.$property)
			log('??',
				obs.key1.$on && obs.key1.$on.$property, obs.key1.$on.$property.$path
			)
			log('??', obs.$on && obs.$on.$property, obs.$on.$property.$path)

			log.error('>>', obs.key1.$on.$property)

			//
			// // debugger
			counter = 0
			// propcache = obs.key1
			log.header('remose!')
			obs.key1.remove()
			expect(counter).to.equal(1)
		})

		it.skip('should have the removed property in meta', function(){
			// L = 1

		})
		it.skip('should now have a missing property listener', function(){
			// L = 1

		})

	})

	describe('subscribe by multiple nested keys', function() {
		var obs
		it('should not fire when no keys are present', function(){
			counter = 0
			obs = prepObs(
				{ },
				{
					keyA1: { keyA2: { keyA3: true } },
					keyB1: { keyB2: true }
				}
			)
			expect(counter).to.equal(0)
		})

		it('should not fire when intermediate properties are added', function(){
			counter = 0
			obs.set({
				keyA1: { otherkey: true }
			})
			expect(counter).to.equal(0)
		})

		it('should still have missing property listener on obs', function(){
			expect(obs).to.have.property('$on')
				.which.has.property('$property')
				.which.has.property('$attach')
				.which.has.property(1)

			var attach = obs.$on.$property.$attach
			expect(attach).to.have.property(1)
			expect(attach).to.not.have.property(2)
			var attached = attach[1]
			expect(attached).to.have.property(0)
				.which.has.property('name')
				.which.equals('missingPropHandler')
			expect(attached).to.have.property(1)
					.which.equals(obs.$on.hashkey)
		})

		it('should have added missing property listener on keyA1', function(){
			expect(obs).to.have.property('keyA1')
				.which.has.property('$on')
				.which.has.property('$property')
				.which.has.property('$attach')
				.which.has.property(1)

			var attach = obs.keyA1.$on.$property.$attach
			expect(attach).to.have.property(1)
			expect(attach).to.not.have.property(2)
			var attached = attach[1]
			expect(attached).to.have.property(0)
				.which.has.property('name')
				.which.equals('missingPropHandler')
			expect(attached).to.have.property(1)
					.which.equals(obs.$on.hashkey)
		})

		it('should fire when second missing property is added (completely)',
			function(){
				scrollDown()
				counter = 0
				obs.set({
					keyB1: {
						keyB2: 'hey'
					}
				})
				expect(counter).to.equal(1)
			}
		)

		it('should have correct meta', function(){
			// L = 1
			expect(h_meta).to.have.property('_added')
				.which.has.property(0, obs.keyB1)
			expect(h_meta).to.have.property('keyB1')
				.which.has.property('keyB2', obs.keyB1.keyB2)
			expect(h_meta._added).to.not.have.property(1)
		})

		it('should have removed missing property listener from obs', function(){
			expect(obs.$on.$property.$attach).to.equal(null)
		})

		it('should still have missing property listener on obs.keyA1', function(){
			scrollDown()
			expect(obs).to.have.property('keyA1')
				.which.has.property('$on')
				.which.has.property('$property')
				.which.has.property('$attach')
				.which.has.property(1)

			var attach = obs.keyA1.$on.$property.$attach
			expect(attach).to.have.property(1)
			expect(attach).to.not.have.property(2)
			var attached = attach[1]
			expect(attached).to.have.property(0)
				.which.has.property('name')
				.which.equals('missingPropHandler')
			expect(attached).to.have.property(1)
					.which.equals(obs.$on.hashkey)
		})

		it('should fire when all info is added', function(){
				scrollDown()
				counter = 0
				obs.set({
					keyA1: { keyA2: { keyA3: 'lala' } }
				})
				expect(counter).to.equal(1)
			}
		)

		it('should have correct meta', function(){
			// L = 1
			expect(h_meta).to.have.property('keyA1')
				.which.has.property('keyA2')
				.which.has.property('keyA3', obs.keyA1.keyA2.keyA3)

			expect(h_meta.keyA1).to.have.property('_added')
				.which.has.property(0, obs.keyA1.keyA2)

			expect(h_meta.keyA1._added).to.not.have.property(1)
		})
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
