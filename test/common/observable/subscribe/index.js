var Observable = require('../../../../lib/observable')
var count
console.clear()

beforeEach(function(){
	count = 0
})

describe('subscribe on existing field', function() {

	it( 'should fire once', function() {
		var a = new Observable({
			aField:1
		})

		a.subscribe({
			aField:true
		},function(){
			count++
		})

		a.aField.$val = 2

		expect(count).equals(1)

	})

})

describe('subscribe on non-existent field', function() {

	it( 'should fire once', function() {
		var a = new Observable()

		a.subscribe({
			aField:true
		},function(){
			count++
		})

		a.set({aField:1})

		a.aField.$val = 2

		expect(count).equals(1)

	})

})

describe('subscribe on existent nested field', function() {

	it( 'should fire once', function() {
		var a = new Observable({
			aField:{
				anotherField:1
			}
		})

		a.subscribe({
			aField:{
				anotherField:true
			}
		},function(){
			count++
		})

		a.aField.anotherField.$val = 2

		expect(count).equals(1)

	})

})

describe('subscribe on non-existent nested field in existing field', function() {

	it( 'should fire once', function() {
		var a = new Observable({
			aField:true
		})

		a.subscribe({
			aField:{
				anotherField:true
			}
		},function(){
			count++
		})

		a.aField.set({anotherField:true})

		a.aField.anotherField.$val = 2

		expect(count).equals(1)

	})

})

describe('subscribe on non-existent nested field in non-existent field', function() {

	it( 'should fire once', function() {
		var a = new Observable()

		a.subscribe({
			aField:{
				anotherField:true
			}
		},function(){
			count++
		})

		a.set({
			aField:{
				anotherField:true
			}
		})

		a.aField.anotherField.$val = 2

		expect(count).equals(1)

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
