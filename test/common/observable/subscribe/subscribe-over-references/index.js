console.clear()

var Observable = require('../../../../../lib/observable')
var SubsEmitter = require('../../../../../lib/observable/subscribe/emitter')

// Observable.inject(require('../../../../../lib/methods/toString'))

if(!window.log) {
	window.L = 0
	window.log = prepLogger()
}

var counter
var h_self
var h_event
var h_meta

describe('subscribe-over-references', function() {

	describe('direct ref to endpoint', function(){
		var obs
		var refholder

		it('should subscribe to direct reference', function(){
			refholder = new Observable({
				$key: 'refholder',
				reffed: 'ref to me!'
			})
			counter = 0
			obs = prepObs(
				{ ref: refholder.reffed },
				{ ref: true }
			)
		})

		it('should fire when endpoint is present', function() {
			expect(counter).to.equal(1)
		})
		it('should have correct meta', function(){
			expect(h_meta).to.have.property('ref', refholder.reffed)
		})

		it('should have a refListener on ref', function(){
			expect(obs.ref.$on.$reference).to.have.property('$attach')
			var attach = obs.ref.$on.$reference.$attach

			expect(attach).to.have.property(1)
			var attached = attach[1]
			expect(attached).to.have.property(0)
				.which.has.property('name', 'refHandler')
			expect(attached).to.have.property(1, obs.$on.hashkey)

			expect(attach).to.not.have.property(2)
		})

		it('should fire when reffed target is updated', function(){
			counter = 0
			refholder.reffed.$val = 'ref to me! (changed)'
			expect(counter).to.equal(1)
		})
		it('should have correct meta', function(){
			expect(h_meta).to.have.property('ref', refholder.reffed)
		})

		it('should fire when reffed endpoint is removed', function(){
			counter = 0
			refholder.reffed.remove()
			expect(counter).to.equal(1)
		})
		it('should have correct meta', function(){
			expect(h_meta).to.have.property('ref')
			expect(h_meta.ref).to.have.property('_$val')
				.which.has.property('$val', null)
			expect(h_meta.ref).to.have.property('$val', null)
		})
	})

	describe('changing ref to non ref', function(){
		var obs
		var refholder

		it('should fire on change', function() {
			refholder = new Observable({
				$key: 'refholder',
				reffed: 'ref to me!'
			})
			obs = prepObs(
				{ ref: refholder.reffed },
				{ ref: true }
			)

			counter = 0
			obs.ref.$val = 'hey no longer ref!'
			expect(counter).to.equal(1)
		})

		it('should have correct meta', function(){
			expect(h_meta).to.have.property('ref', obs.ref)
		})

		it('should no longer have the refListener', function() {
			expect(obs.ref).to.have.property('$on')
				.which.has.property('$reference')
				.which.has.property('$attach')
				.which.equals(null)
		})

		it('should clean the previously referenced value', function() {
			expect(refholder.reffed).to.have.property('$on')
				.which.has.property('$change')
				.which.has.property('$attach')
				.which.equals(null)
		})

	})

	describe('reference as intermediate property', function(){
		var obs
		var refholder

		it('should subscribe with reference as intermediate property',
			function() {
				counter = 0
				refholder = new Observable({
					$key: 'refholder',
					reffed: {
						nest1:{
							nest2: true
						}
					},
					reffed2: {
						nest1:{
							nest2: 'ha different man!'
						}
					},
					reffed3: {
						nest1: {
							otherkey3: true
						}
					},
					reffed4: {
						nest1: {
							otherkey4: true
						}
					}
				})

				obs = prepObs(
					{ ref: refholder.reffed },
					{ ref: { nest1: { nest2: true } } }
				)
			}
		)

		it('should fire when subscribing', function(){
			expect(counter).to.equal(1)
		})
		it('should have correct meta', function(){
			expect(h_meta).to.have.property('ref')
				.which.has.property('nest1')
				.which.has.property('nest2', refholder.reffed.nest1.nest2)
		})
		it('should have a reflistener', function(){
			expect(obs.ref.$on.$reference).to.have.property('$attach')
			var attach = obs.ref.$on.$reference.$attach

			expect(attach).to.have.property(1)
			var attached = attach[1]
			expect(attached).to.have.property(0)
				.which.has.property('name', 'refHandler')
			expect(attached).to.have.property(1, obs.$on.hashkey)
			expect(attach).to.not.have.property(2)
		})

		it('should fire when changing ref target (with endpoint)',
			function(){
				counter = 0
				obs.ref.$val = refholder.reffed2
				counter = 1
			}
		)

		it('should have correct meta', function(){
			expect(h_meta).to.have.property('ref')
				.which.has.property('nest1')
				.which.has.property('nest2', refholder.reffed2.nest1.nest2)
		})

		it('should have cleaned previous target', function(){
			var oldendpoint = refholder.reffed.nest1.nest2
			expect(oldendpoint).to.have.property('$on')
				.which.has.property('$change')
				.which.has.property('$attach', null)

		})

		it('should still have a reference listener', function(){
			expect(obs.ref.$on.$reference).to.have.property('$attach')
			var attach = obs.ref.$on.$reference.$attach

			expect(attach).to.have.property(1)
			var attached = attach[1]
			expect(attached).to.have.property(0)
				.which.has.property('name', 'refHandler')
			expect(attached).to.have.property(1, obs.$on.hashkey)
			expect(attach).to.not.have.property(2)

		})

		it('should fire when new endpoint is updated', function(){
			counter = 0
			refholder.reffed2.nest1.nest2.$val = 'update!'
			expect(counter).to.equal(1)
		})
		it('should have correct meta', function(){
			expect(h_meta).to.have.property('ref')
				.which.has.property('nest1')
				.which.has.property('nest2', refholder.reffed2.nest1.nest2)
		})

		it('should fire when changing ref target (without endpoint)',
			function(){
				counter = 0
				obs.ref.$val = refholder.reffed3
				expect(counter).to.equal(1)
			}
		)
		it('should have correct meta', function(){
			log.header('!')
			expect(h_meta).to.have.property('ref', refholder.reffed3)
		})

		it('should fire when changing ref target (without endpoint) AGAIN',
			function(){
				counter = 0
				obs.ref.$val = refholder.reffed4
				expect(counter).to.equal(1)
			}
		)
		it('should have correct meta', function(){
			expect(h_meta).to.have.property('ref', refholder.reffed4)
		})

		it('should have cleaned missing property listener from previous value',
			function(){
				var oldmissing = refholder.reffed3.nest1
				expect(oldmissing).to.have.property('$on')
					.which.has.property('$property')
					.which.has.property('$attach', null)
			}
		)

		it('should fire when enpoint is added', function(){
			counter = 0
			refholder.reffed4.nest1.$val = {
				nest2: 'ha finally an enpoint!'
			}
			expect(counter).to.equal(1)
		})
		it('should have correct meta', function(){
			expect(h_meta).to.have.property('ref')
				.which.has.property('nest1')

			var meta_nest1 = h_meta.ref.nest1

			expect(meta_nest1).to.have.property('_added')
				.which.has.property(0, refholder.reffed4.nest1.nest2)

			expect(meta_nest1).to.have.property('nest2',
				refholder.reffed4.nest1.nest2
			)
		})

		it('should fire when intermediate reference is removed', function() {
			counter = 0
			L = 1
			log.header('REMOVE!')
			log.shine('?!', refholder.reffed4.nest1.nest2,
				refholder.reffed4.nest1.nest2.$val
			)
			try{
				obs.ref.remove()
			} catch(err) {
				log.error(err.stack)
				log.shine( 'but what?!',
					refholder.reffed4.nest1.nest2,
					refholder.reffed4.nest1.nest2.$val,
					refholder.reffed4.nest1,
					refholder.reffed4.nest1.$val,
					refholder.reffed4,
					refholder.reffed4.$val,
					refholder,
					refholder.$val
				)
				throw err
			}
			expect(counter).to.equal(1)
		})
		it('should have correct meta', function() {
			log.shine('meta', h_meta)
			L=0
		})


	})

	describe('reference as intermediate property before any$', function(){

		var obs
		var refholder

		it('should subscribe', function(){
			refholder = new Observable({
				$key: 'refholder',
				reffed: {
					nest1:{
						lurf: true,
						nest2: true
					}
				},
				reffed2: {
					nest1:{
						pursh: true,
						nest2: 'ha different man!'
					}
				},
				reffed3: {
					nest1: {
						shurpy: 4,
						otherkey3: true
					}
				},
				reffed4: {
					nest1: {
						shurpy: 6,
						otherkey4: true
					}
				}
			})

			counter = 0
			obs = prepObs(
				{ ref: refholder.reffed },
				{ ref: { nest1: { any$: true } } }
			)
		})



		it('should have added any listener', function(){
			expect(refholder.reffed.nest1).to.have.property('$on')
				.which.has.property('$property')
				.which.has.property('$attach')

			var attach = refholder.reffed.nest1.$on.$property.$attach

			expect(attach).to.have.property(1)
			var attached = attach[1]
			expect(attached).to.have.property(0)
				.which.has.property('name', 'anyHandler')
			expect(attached).to.have.property(1, obs.$on.hashkey)
			expect(attach).to.not.have.property(2)
		})

		it('should fire on ref switch to other target', function(){
			counter = 0
			obs.ref.$val = refholder.reffed2
			expect(counter).to.equal(1)
		})
		it('should have correct meta', function(){
			expect(h_meta).to.have.property('ref')
				.which.has.property('nest1')
				.which.has.property('nest2', refholder.reffed2.nest1.nest2)
		})


		it('should have removed any listener from old ref target', function(){
			var old = refholder.reffed.nest1
			expect(old).to.have.property('$on')
				.which.has.property('$property')
				.which.has.property('$attach', null)

		})

		it('should have removed endpoint listeners from old ref endpoints',
			function(){
				var old = refholder.reffed.nest1.nest2
				expect(old).to.have.property('$on')
					.which.has.property('$change')
					.which.has.property('$attach', null)

				old = refholder.reffed.nest1.lurf
				expect(old).to.have.property('$on')
					.which.has.property('$change')
					.which.has.property('$attach', null)

			})

		it('should fire when new endpoints are updated', function(){
			counter = 0
			refholder.reffed2.nest1.nest2.$val = 'shurp'
			expect(counter).to.equal(1)
		})

	})

	describe('removing a reference that is subscribed over', function(){
		it.skip('should fire on remove', function() {

		})
		it.skip('should have correct meta', function(){

		})
	})

	describe('referencing references!', function(){
		var reffed
		var reffedrefB
		var reffedrefA
		var obs

		it('should subscribe', function(){
			reffed = new Observable({
				$key: 'reffed',
				nest1: 'endpointman'
			})
			reffedrefB = new Observable({
				$key: 'reffedrefB',
				$val: reffed
			})
			reffedrefA = new Observable({
				$key: 'reffedrefA',
				$val: reffedrefB
			})
			counter = 0
			obs = prepObs(
				{ ref: reffedrefA },
				{ ref: { nest1: true } }
			)
		})

		it.skip('should fire because endpoint is present', function(){
			expect(counter).to.equal(1)
		})
		it('should fire listeners when enpoint is updated', function(){
			counter = 0
			reffed.nest1.$val = 'updated endpointman'
			expect(counter).to.equal(1)
		})
		it('should have correct meta', function(){
			expect(h_meta).to.have.property('ref')
				.which.has.property('nest1', reffed.nest1)
		})

		it('should fire when first ref is changed to non ref (without endpoint)',
			function(){
				counter = 0
				obs.ref.set({
					$val: void 0,
					otherval: 'durp'
				})
				expect(counter).to.equal(1)
			}
		)
		it('should have correct meta', function(){
			expect(h_meta).to.have.property('ref', obs.ref)
		})

		it('should have removed reference listener from reffedrefs',
			function() {
				expect(reffedrefA).to.have.property('$on')
					.which.has.property('$reference')
					.which.has.property('$attach', null)
				expect(reffedrefB).to.have.property('$on')
					.which.has.property('$reference')
					.which.has.property('$attach', null)

			}
		)

		it.skip('should fire when intermediate reference is removed',
			function() {
				counter = 0

			}
		)
		it.skip('should have correct meta', function(){

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
	log.shine = function(label) {
		log(
			'%c------------- ' + label,
			'margin: 5px; color:green; font-size: 12pt'
		)
		var args = []
		var a = 1
		while(arguments[a] !== void 0){
			args.push(arguments[a])
			a++
		}
		log.apply(console, args)
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
