var Observable = require('../../../../../lib/observable')

describe('subscribe on existing field',function(){

	var a = new Observable({
		aField:1
	})

	a.subscribe({
		aField:true	
	},function(){
		console.log('go!')
	},'special')

	// a.subscribe({
	// 	"*":true //any
	// 	"&":true //deep
	// 	somefield:true //field
	// },'aField')

})

describe('subscribe on non-existing field',function(){

	var a = new Observable()
	a.subscribe({
		aField:true	
	})

})

describe('subscribe on existing ref field',function(){

	var a = new Observable({
		aField:1
	})
	var b = new Observable(a)
	b.subscribe({
		aField:true	
	})

})

describe('subscribe on non-existing ref field',function(){

	var a = new Observable()
	var b = new Observable(a)
	b.subscribe({
		aField:true	
	})

})