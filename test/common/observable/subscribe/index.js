var Observable = require('../../../../lib/observable')

console.clear()

describe('subscribe on field', function() {

	var a = new Observable({
		aField:1
	})

	a.subscribe({
		aField:true
	},function(){
		console.log('go!')
	},'special')

})



	// a.subscribe({
	// 	"*":true //any
	// 	"&":true //deep
	// 	somefield:true //field
	// },'aField')
