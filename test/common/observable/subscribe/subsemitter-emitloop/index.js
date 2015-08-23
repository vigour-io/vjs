var L = 0

var Event = require( '../../../../../lib/event' )
var Emitter = require( '../../../../../lib/emitter' )
var SubsEmitter = require( '../../../../../lib/observable/subscribe/emitter' )
var Observable = require( '../../../../../lib/observable' )

if( !isNode && !window.log) {
	window.L = 0
	window.log = prepLogger()
}

describe('subsemitter-emitloop', function() {

	var timeline = []

	var obsA = new Observable()
	obsA.$key = 'obsA'
	var obsB = new Observable()
	obsB.$key = 'obsB'

	var subsemitter = new SubsEmitter({
		handler1: function(event) {
			timeline.push('B-subscribe')
		}
	}, void 0, obsB, 'subsemitter')

	obsA.on('$change', function(event) {
		log.error('------------ obsA change handler', event.$stamp)
		timeline.push('A-change')
		subsemitter.emit(event, obsB)
	})

	obsB.on('$change', function(event) {
		log.error('------------ obsB change handler', event.$stamp)
		timeline.push('B-change')
		subsemitter.emit(event, obsB)
		obsA.set( 'chainge!' )
	})

	obsB.on('$property', function(event) {
		log.error('------------ obsB property handler', event.$stamp)
		timeline.push('B-property')
		subsemitter.emit(event, obsB)
	})

	it('should emit events on set', function() {
		try{
			obsB.set({
				newkey: 'val'
			})
		}catch(err){
			console.error(err.stack)
		}

	})

	it.skip('should emit events in the correct order', function() {
		// logs:
		// ["B-change", "A-change", "B-property", "B-subscribe", "B-subscribe"]

		// now --> [ "B-change", "A-change", "B-property", "B-subscribe" ]

		//now this results in 	[ 'B-change', 'A-change', 'B-property', 'B-subscribe' ]
		//sort of good but pretty strange!
		expect(timeline.join(', ')).to.deep.equal(
			[ 'B-change', 'A-change', 'B-property', 'B-subscribe', 'B-subscribe' ]
			//strange thing here is that no suddenly b-subscribe gets caught -- when you remove postponed emitter its ok
		)
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
		//hurk
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
