var Observable = require('../../../../../../lib/observable')
var subcription
var $change
var $property
var count

beforeEach(function(){
	count = 0

	if(subcription){
		subcription.$listensOnAttach.each(function(p){
			if(p.$key === '$change'){
				$change = p.$attach
			}
			if(p.$key === '$property'){
				$property = p.$attach
			}
		})
	}

})

describe('subscribing to single existing field on instance', function() {
	var a = new Observable({
		$key:'a',
		aField:1
	})

	var b = new a.$Constructor({
		$key:'b'
	})

	it( 'subcribes to field', function(){
		subcription = b.subscribe({
			aField:true
		},function(){
			console.log('power')
			count++
		})
	})

	it( 'fires when field is updated', function() {
		a.aField.$val = 2
	// 	// expect(count).equals(1)


	// 	var nerdje = new Observable({
	// 		$trackInstances:true,
	// 		$on: {
	// 			$change:function() {
					
	// 			}
	// 		}
	// 	})

	// 	var instanceVanNerdje = new nerdje.$Constructor()

	// 	instanceVanNerdje.on('$change',function(){
	// 		console.log('GEEKY NERD')
	// 	})

	// 	nerdje.$val = 1

	})

})