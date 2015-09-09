var Observable = require('../../../../lib/observable')
var count

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

describe('subscribe on any existing field', function() {

	it( 'should fire once', function() {
		var a = new Observable({
			aField:1
		})

		a.subscribe({
			"*":true
		},function(){
			count++
		})

		a.aField.$val = 2

		expect(count).equals(1)

	})

})

describe('subscribe on any non-existing field', function() {

	it( 'should fire once', function() {
		var a = new Observable()

		a.subscribe({
			"*":true
		},function(){
			count++
		})

		a.set({aField:1})

		a.aField.$val = 2

		expect(count).equals(1)

	})

})

describe('subscribe on existing parent', function() {

	it( 'should fire once', function() {
		var a = new Observable()

		var b = new Observable({
			$key:'b',
			a:{ $useVal: a }
		})

		a.subscribe({
			$parent:true
		},function(){
			count++
		})

		b.$val = 1

		expect(count).equals(1)

	})

})

describe('subscribe on non-existing parent', function() {

	it( 'should fire once', function() {
		var a = new Observable()

		a.subscribe({
			$parent:true
		},function(){
			count++
		})

		var b = new Observable({
			$key:'b',
			a:{ $useVal: a }
		})

		b.$val = 1

		expect(count).equals(1)

	})

})

describe('subscribe on existing field on non-existing parent', function() {

	it( 'should fire once', function() {
		var a = new Observable()

		a.subscribe({
			$parent:{
				bField:true
			},
		},function(){
			count++
		})

		var b = new Observable({
			$key:'b',
			bField:1,
			a:{ $useVal: a }
		})

		b.bField.$val = 2

		expect(count).equals(1)

	})

})

describe('subscribe on non-existing field on non-existing parent', function() {

	it( 'should fire once', function() {
		var a = new Observable()

		a.subscribe({
			$parent:{
				bField:true
			},
		},function(){
			count++
		})

		var b = new Observable({
			$key:'b',
			a:{ $useVal: a }
		})

		b.set({
			bField:1
		})

		b.bField.$val = 2

		expect(count).equals(1)

	})

})

describe('subscribe on referenced obj, 1 level, existing field', function() {

	console.clear()

	it( 'should fire once', function() {
		
		var a = new Observable({
			aField:1
		})

		var b = new Observable(a)

		b.subscribe({
			aField:true
		},function(){
			count++
		})

		a.aField.$val = 2

		expect(count).equals(1)

	})

})

describe('subscribe on referenced obj, 2 levels, existing field', function() {

	it( 'should fire once', function() {
		
		var a = new Observable({
			aField:1
		})

		var b = new Observable(a)
		var c = new Observable(b)

		c.subscribe({
			aField:true
		},function(){
			count++
		})

		a.aField.$val = 2

		expect(count).equals(1)

	})

})

describe('subscribe on referenced obj, 2 levels, several locations', function() {

	it( 'should fire once', function() {
	
		console.clear()

		var a = new Observable({
			aField:1
		})

		var b = new Observable({
			$val:a,
			bField:1
		})

		var c = new Observable(b)

		c.subscribe({
			aField:true,
			bField:true
		},function(){
			count++
		})

		a.aField.$val = 2
		b.bField.$val = 2

		console.log('fun times')

		expect(count).equals(2)

	})

})

describe('subscribe on referenced obj, 2 levels, non-existing field', function() {

	it( 'should fire once', function() {
		
		var a = new Observable()
		var b = new Observable(a)
		var c = new Observable(b)

		c.subscribe({
			aField:true
		},function(){
			count++
		})

		b.set({aField:1})

		b.aField.$val = 2

		a.set({aField:1})

		a.aField.$val = 2

		expect(count).equals(1)

	})

})

describe('subscribe on referenced obj, 2 levels, non-existing field, $parent', function() {

	it( 'should fire once', function() {
		
		var a = new Observable()
		var b = new Observable(a)
		var c = new Observable(b)

		c.subscribe({
			$parent:true
		},function(){
			count++
		})

		var d = new Observable({
			a:{$useVal:a}
		})

		d.$val = 1

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
