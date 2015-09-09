var Observable = require('../../../../lib/observable')

console.clear()

describe('subscribe on field', function() {

	it( 'should fire once', function() {
		var a = new Observable({
			aField:1
		})

		a.subscribe({
			aField:true
		},function(){
			console.log('go!go')
		})

		a.aField.$val = 2

	})

})

//op subsEmitter komt fire waar je een listener aan kan meegeven en een target

//.$exec in emitter moet een extra arg krijgen voor een listener (specific)
//+ een extra bind argument (alleen voor deze case)



	// a.subscribe({
	// 	"*":true //any
	// 	"&":true //deep
	// 	somefield:true //field
	// },'aField')
