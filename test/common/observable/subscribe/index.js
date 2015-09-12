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

		// console.clear()

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

		a.aField.set({anotherField2:true})

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

describe('subscribe on non-existent nested field in non-existent field, references', function() {

	it( 'should fire once', function() {
		var a = new Observable()
		var b = new Observable(a)
		var c = new Observable(b)

		// console.clear()

		c.subscribe({
			aField:{
				anotherField:{
					nextField:true
				}
			}
		},function(){
			count++
		})

		console.log('a.aField')

		a.set({
			aField:{
				anotherField:true
			}
		})

		expect(count).equals(0)

		console.log('b.aField')

		b.set({
			aField:true
		})		

		expect(count).equals(0)

		console.log('b.aField.anotherField.nextField')

		b.set({
			aField:{
				anotherField:{
					nextField:true
				}
			}
		})

		expect(count).equals(1)	

		a.set({
			aField:{
				anotherField:{
					nextField:true
				}
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

		console.log('subscribe to any')
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





// describe('subscribe on referenced obj, 2 levels, non-existing field, $parent, "*", "field"', function() {

// 	it( 'should fire twice', function() {

// 		console.clear()

// 		var a = new Observable()
// 		var b = new Observable(a)
// 		var c = new Observable(b)

// 		c.subscribe({
// 			$parent:{
// 				"*":{
// 					field:true
// 				}
// 			}
// 		},function(){
// 			count++
// 		})

// 		var d = new Observable({
// 			x:0,
// 			y:0,
// 			a:{$useVal:a}
// 		})

// 		d.x.$val = 1
// 		d.y.$val = 1

// 		expect(count).equals(0)		

// 		console.log('x set field')

// 		d.x.set({
// 			field:true
// 		})

// 		console.log('y set field')

// 		d.y.set({
// 			field:true
// 		})

// 		expect(count).equals(2)

// 	})

// })

describe('subscribe on referenced obj, 4 levels, non-existing fields on different levels', function() {

	it( 'should fire trice', function() {

		// console.clear()

		var a = new Observable({$key:'a'})  //{aField: true, bField: true, cField: true}
		var b = new Observable({$key:'b',$val:a}) //{aField: true, bField: true, cField: true}
		var c = new Observable({$key:'c',$val:b}) //{aField: true, bField: true, cField: true}
		var d = new Observable({$key:'d',$val:c}) //{aField: true, bField: true, cField: true}

		d.subscribe({
			// $parent:true,
			aField:true,
			bField:true,
			cField:true
		},function(){
			console.log(' . . fire')
			count++
		})

		b.set({
			bField:true
		})

		expect(count).equals(1)

		console.log('c.cField')

		c.set({
			cField:true
		})

		expect(count).equals(2)

		console.log('d.cField')

		d.set({
			cField:true
		})

		expect(count).equals(3)

		console.log('c.cField')

		c.set({
			cField:1
		})



		expect(count).equals(3)

		d.set({
			cField:1
		})

		expect(count).equals(4)

		d.set({
			aField:true
		})

		expect(count).equals(5)

		c.set({
			bField:true
		})

		expect(count).equals(6)

		c.set({
			aField:true
		})

		expect(count).equals(6)

	})

})

describe('subscribe on referenced obj, 4 levels, non-existing fields on different levels, $parent', function() {

	it( 'should fire trice', function() {
		
		// console.clear()
		
		var a = new Observable({$key:'a'})  //{aField: true, bField: true, cField: true}
		var b = new Observable({$key:'b',$val:a}) //{aField: true, bField: true, cField: true}
		var c = new Observable({$key:'c',$val:b}) //{aField: true, bField: true, cField: true}
		var d = new Observable({$key:'d',$val:c}) //{aField: true, bField: true, cField: true}

		d.subscribe({
			$parent:true,
			aField:true
		},function(){
			count++
			console.log('counting',count)
		})

		console.log('add a to parent')

		var parent  = new Observable({
			a:{$useVal:a}	
		})

		expect(count).equals(1)

		console.log('add c to parent')

		parent.set({
			c:{$useVal:c}
		})

		expect(count).equals(2)

		console.log('add b to parent')

		parent.set({
			b:{$useVal:b}
		})

		expect(count).equals(3)

	})

})




describe('subscribe on referenced obj, 4 levels, non-existing fields on different levels, $parent, nested', function() {

	it( 'should fire trice', function() {
		console.clear()
		var a = new Observable({$key:'a'})  //{aField: true, bField: true, cField: true}
		var b = new Observable({$key:'b',$val:a}) //{aField: true, bField: true, cField: true}
		var c = new Observable({$key:'c',$val:b}) //{aField: true, bField: true, cField: true}
		var d = new Observable({$key:'d',$val:c}) //{aField: true, bField: true, cField: true}

		d.subscribe({
			$parent:{
				field:true
			},
		},function(){
			count++
		})

		console.log('add a to parent')

		var parent  = new Observable({
			field:true,
			a:{$useVal:a}	
		})

		expect(count).equals(1)

		console.log('add b to parent')

		parent.set({
			b:{$useVal:b}
		})

		expect(count).equals(2)

		// console.log('add b to parent')

		// parent.set({
		// 	b:{$useVal:b}
		// })

		// expect(count).equals(2)

	})

})

// a - aChild1
//   - aChild2
//   - aChild3

// b - bChild1
//   - bChild2
//   - bChild3

// c - cChild1
//   - cChild2
//   - cChild3

setTimeout(function(){
	window.scrollTo(0,document.body.scrollHeight);
},500)

// changing references