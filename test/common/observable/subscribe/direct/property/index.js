var Observable = require('../../../../../../lib/observable')
var count

beforeEach(function(){
	count = 0
})

describe('subscribing to single existing field', function() {
	var a = new Observable({
		aField:1
	})

	it( 'subcribes to field', function(){
		a.subscribe({
			aField:{
				$val:true
			}
		},function( event, meta ){
			count++
		})
	})

	it( 'doesn\'t fire on subscribing', function(){
		expect(count).equals(0)
	} )

	it( 'fires when field is updated', function() {
		a.aField.$val = 2
		expect(count).equals(1)
	})

})

describe('subscribing on non-existent field', function() {

	var a = new Observable()

	it( 'subcribes to field', function(){
		a.subscribe({
			aField:true
		},function(){
			count++
		})
	})

	it( 'doesn\'t fire on subscribing', function(){
		expect(count).equals(0)
	})

	it( 'fires when field is created', function() {

		console.error('allrgith this bitch aint firin\'')

		a.set({aField:true})

		console.error('-----------------')

		expect(count).equals(1)
	})

	it( 'fires when field is updated', function() {
		a.aField.$val = 2
		expect(count).equals(1)
	})

})

//
// describe('subscribing on two non-existent fields', function() {
//
// 	var a = new Observable()
//
// 	it( 'subcribes to two fields', function(){
// 		a.subscribe({
// 			aField:true,
// 			anotherField:true
// 		},function(){
// 			count++
// 		})
// 	})
//
// 	it( 'doesn\'t fire on subscribing', function(){
// 		expect(count).equals(0)
// 	} )
//
// 	it( 'fires when one field is created', function() {
// 		a.set({aField:true})
// 		expect(count).equals(1)
// 	})
//
// 	it( 'fires when other field is created', function() {
// 		a.set({anotherField:true})
// 		expect(count).equals(1)
// 	})
//
// 	it( 'fires when one field is updated', function() {
// 		a.aField.$val = 2
// 		expect(count).equals(1)
// 	})
//
// 	it( 'fires when other field is updated', function() {
// 		a.anotherField.$val = 2
// 		expect(count).equals(1)
// 	})
//
// })
//
// describe('subscribing on existent nested field', function() {
//
// 	var a = new Observable({
// 		aField:{
// 			anotherField:1
// 		}
// 	})
//
// 	it( 'subcribes to nested field', function(){
// 		a.subscribe({
// 			aField:{
// 				anotherField:true
// 			}
// 		},function(){
// 			count++
// 		})
// 	})
//
// 	it( 'doesn\'t fire on subscribing', function(){
// 		expect(count).equals(0)
// 	} )
//
// 	it( 'fires when nested field is updated', function(){
// 		a.aField.anotherField.$val = 2
// 		expect(count).equals(1)
// 	})
//
// })
//
// describe('subscribing on non-existent nested field in existing field', function() {
//
// 	var a = new Observable({
// 		aField:true
// 	})
//
// 	it( 'subcribes to nested field', function(){
// 		a.subscribe({
// 			aField:{
// 				anotherField:true
// 			}
// 		},function(){
// 			count++
// 		})
// 	})
//
// 	it( 'doesn\'t fire on subscribing', function(){
// 		expect(count).equals(0)
// 	} )
//
// 	it( 'fires when nested field is created', function(){
// 		a.aField.set({anotherField:true})
// 		expect(count).equals(1)
// 	})
//
// 	it( 'fires when nested field is updated', function(){
// 		a.aField.anotherField.$val = 2
// 		expect(count).equals(1)
// 	})
//
// })
//
// describe('subscribe on non-existent nested field in non-existent field', function() {
//
// 	var a = new Observable()
//
// 	it( 'subcribes to nested field', function(){
// 		a.subscribe({
// 			aField:{
// 				anotherField:true
// 			}
// 		},function(){
// 			count++
// 		})
// 	})
//
// 	it( 'doesn\'t fire on subscribing', function(){
// 		expect(count).equals(0)
// 	} )
//
// 	it( 'doesn\'t fire on setting top level field', function(){
// 		a.set({aField:true})
// 		expect(count).equals(0)
// 	} )
//
// 	it( 'fires when nested field is created', function(){
// 		a.aField.set({anotherField:true})
// 		expect(count).equals(1)
// 	})
//
// 	it( 'fires when nested field is updated', function(){
// 		a.aField.anotherField.$val = 2
// 		expect(count).equals(1)
// 	})
//
// })
