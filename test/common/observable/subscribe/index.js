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

		expect(count).equals(1)

	})

})

describe('subscribe on two non-existent fields', function() {

	it( 'should fire twice', function() {
		console.clear()
		var a = new Observable()

		a.subscribe({
			aField:true,
			anotherField:true
		},function(){
			count++
		})

		a.set({aField:1})
		a.set({anotherField:1})

		expect(count).equals(2)

		console.log('----------')

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
			$val:1,
			$key:'b',
			a:{ $useVal: a }
		})

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

		expect(count).equals(1)

	})

})

describe('subscribe on referenced obj, 1 level, existing field', function() {

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

	it( 'should fire twice', function() {
	
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

		expect(count).equals(2)

	})

})

describe('subscribe on referenced obj, 2 levels, non-existing field', function() {

	it( 'should fire once', function() {
		
		console.clear()

		var a = new Observable({$key:'a'})  //{aField: true, bField: true, cField: true}
		var b = new Observable({$key:'b',$val:a}) //{aField: true, bField: true, cField: true}
		var c = new Observable({$key:'c',$val:b}) //{aField: true, bField: true, cField: true}

		c.subscribe({
			aField:true
		},function(){
			count++
		})

		b.set({aField:1})

		a.set({aField:1})

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

		expect(count).equals(1)

	})

})

describe('subscribe on referenced obj, 2 levels, non-existing field, $parent, "*"', function() {

	it( 'should fire twice', function() {

		var a = new Observable()
		var b = new Observable(a)
		var c = new Observable(b)

		c.subscribe({
			$parent:{
				"*":true
			}
		},function(){
			count++
		})

		var d = new Observable({
			x:0,
			y:0,
			a:{$useVal:a}
		})

		d.x.$val = 1
		d.y.$val = 1

		expect(count).equals(2)

	})

})

describe('subscribe on referenced obj, 2 levels, non-existing field, $parent, "*", "field"', function() {

	it( 'should fire twice', function() {

		var a = new Observable()
		var b = new Observable(a)
		var c = new Observable(b)

		c.subscribe({
			$parent:{
				"*":{
					field:true
				}
			}
		},function(){
			count++
		})

		var d = new Observable({
			x:0,
			y:0,
			a:{$useVal:a}
		})

		d.x.$val = 1
		d.y.$val = 1

		expect(count).equals(0)		

		d.x.set({
			field:true
		})

		d.y.set({
			field:true
		})

		expect(count).equals(2)

	})

})

describe('subscribe on referenced obj, 3 levels, non-existing fields', function() {

	it( 'should fire trice', function() {

		console.clear()

		var a = new Observable({$key:'a'})  //{aField: true, bField: true, cField: true}
		var b = new Observable({$key:'b',$val:a}) //{aField: true, bField: true, cField: true}
		var c = new Observable({$key:'c',$val:b}) //{aField: true, bField: true, cField: true}
		var d = new Observable({$key:'d',$val:c}) //{aField: true, bField: true, cField: true}

		d.subscribe({
			aField:true,
			bField:true,
			cField:true
		},function(){
			console.log('\n fires \n')
			count++
		})

		// console.log('set a.aField')

		// a.set({
		// 	aField:true
		// })

		console.log('set b.bField')

		b.set({
			bField:true
		})

		expect(count).equals(1)
		console.log('set c.cField')

		c.set({
			cField:true
		})

		expect(count).equals(2)
		console.log('set d.cField')

		d.set({
			cField:true
		})

		expect(count).equals(3)
		console.log('set c.cField again')

		c.set({
			cField:1
		})
		expect(count).equals(3)
		console.log('set d.cField again')

		d.set({
			cField:1
		})

		console.log('set d.aField')

		d.set({
			aField:true
		})

		expect(count).equals(5)
		console.log('set c.bField')

		c.set({
			bField:true
		})

		expect(count).equals(6)

		console.log('set c.aField')

		c.set({
			aField:true
		})

		expect(count).equals(6)

		console.log('----------------------------')

	})

})

//changing references