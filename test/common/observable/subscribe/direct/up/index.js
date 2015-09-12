var Observable = require('../../../../../../lib/observable')
var count

beforeEach(function(){
	count = 0
})

describe('subscribing to existing upward, one level', function() {
	var a = new Observable()
	var parent = new Observable({
		a:{$useVal:a}
	})

	it( 'subcribes to parent on a', function(){
		a.subscribe({
			$upward:true
		},function( event, meta ){
			count++
		})
	})

	it( 'doesn\'t fire on subscribing', function(){
		expect(count).equals(0)
	} )

	it( 'fires when parent changes', function() {
		parent.$val = 1
		expect(count).equals(1)
	})

})

describe('subscribing to existing upward, two levels', function() {
	var a = new Observable()
	var parent = new Observable({
		a:{$useVal:a}
	})
	var grandParent = new Observable({
		p:{$useVal:parent}
	})

	it( 'subcribes to parent on a', function(){
		a.subscribe({
			$upward:true
		},function( event, meta ){
			count++
		})
	})

	it( 'doesn\'t fire on subscribing', function(){
		expect(count).equals(0)
	} )

	it( 'fires when parent changes', function() {
		grandParent.$val = 1
		expect(count).equals(1)
	})

})

describe('subscribing to non existing upward, two levels', function() {
	var a = new Observable()
	var parent
	it( 'subcribes to parent on a', function(){
		a.subscribe({
			$upward:true
		},function( event, meta ){
			count++
		})
	})

	it( 'doesn\'t fire on subscribing', function(){
		expect(count).equals(0)
	} )

	it( 'fires when added to parent', function() {
		parent = new Observable({
			a:{$useVal:a}
		})
		expect(count).equals(1)
	})

	it( 'fires when parent is added to grandparent', function() {
		var grandParent = new Observable({
			p:{$useVal:parent}
		})
		expect(count).equals(1)
	})
})

describe('subscribing to non existing upward, two levels, nested field', function() {
	var a = new Observable()
	var parent
	it( 'subcribes to parent on a', function(){
		a.subscribe({
			$upward:{
				field:true
			}
		},function( event, meta ){
			count++
		})
	})

	it( 'doesn\'t fire on subscribing', function(){
		expect(count).equals(0)
	} )

	it( 'fires when added to parent', function() {
		parent = new Observable({
			field:true,
			a:{$useVal:a}
		})
		expect(count).equals(1)
	})

	it( 'fires when parent is added to grandparent', function() {
		var grandParent = new Observable({
			field:true,
			p:{$useVal:parent}
		})
		expect(count).equals(1)
	})
})