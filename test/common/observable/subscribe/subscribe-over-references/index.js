var Observable = require('../../../../../lib/observable')
var SubsEmitter = require('../../../../../lib/observable/subscribe/emitter')

// Observable.inject(require('../../../../../lib/methods/toString'))

var L = 0
var log = window.log = prepLogger()
console.clear()
var counter
var h_self
var h_event
var h_meta

describe('subscribe-over-references', function() {

	describe('direct ref to endpoint', function(){
		var obs
		var refholder

		refholder = new Observable({
			$key: 'refholder',
			reffed: 'ref to me!'
		})
		counter = 0
		obs = prepObs(
			{ ref: refholder.reffed },
			{ ref: true }
		)

		it.skip('should fire when endpoint is present', function() {
			// L = 1
			expect(counter).to.equal(1)
		})

		it.skip('should have correct meta', function(){
			// L = 1
			log.header('check dat meta burr')
			log(h_meta)
		})

		it('should have refListener on ref', function(){
			// L = 1
			expect(obs.ref.$on.$reference).to.have.property('$attach')
			var attach = obs.ref.$on.$reference.$attach

			expect(attach).to.have.property(1)
			var attached = attach[1]

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
			}
		})

		obs = prepObs(
			{ ref: refholder.reffed },
			{ ref: { nest1: { nest2: true } } }
		)

		it.skip('should fire when subscribing', function(){
			expect(counter).to.equal(1)
		})
		it.skip('should have correct meta', function(){

		})
		it('should have reflistener', function(){
			L=1
			log.header('check listener?')
			log(obs.ref.$on)
		})

		it('should fire when changing ref target (with endpoint)',
			function(){
				L=1
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
			L=1
			scrollDown()
			log.header('>')
			log(refholder.reffed.$on)
		})

		it.skip('should still have reference listener', function(){

		})

		it.skip('should fire when new endpoint is updated', function(){

		})

		it.skip('should fire when changing ref target (without endpoint)',
			function(){

			}
		)
		it.skip('should have correct meta', function(){

		})

		it.skip('should fire when enpoint is added', function(){

		})
		it.skip('should have correct meta', function(){

		})

		it.skip('should work with any$', function(){

		})

	})

	describe('reference as intermediate property before any$', function(){

		it.skip('should clean correctly', function(){

		})

		it.skip('should add new any$ listeners correctly', function(){

		})

	})

	describe('changing ref target to other Observable',
		function(){
			var obs
			it.skip('should fire on change', function() {

			})

			it.skip('should have correct meta', function(){

			})

			it.skip('should not fire when enpoint is the same', function() {

			})

		}
	)

	describe('removing a referenced enpoint', function(){
		it.skip('should fire on remove', function() {

		})
		it.skip('should have correct meta', function(){

		})
	})

	describe('removing a reference that is subscribed over', function(){
		it.skip('should fire on remove', function() {

		})
		it.skip('should have correct meta', function(){

		})
	})

	describe('referencing references!', function(){
		it.skip('should fire listeners when enpoint is updated', function(){

		})
		it.skip('should have correct meta', function(){

		})
		it.skip('should fire when intermediate reference is removed',
			function() {

			}
		)
		it.skip('should have correct meta', function(){

		})
		it.skip(
			'should fire when intermediate reference is changed to non-reference ',
			function(){

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
		while(arguments[a]){args.push(arguments[a])}
		log.apply(log, args)
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
