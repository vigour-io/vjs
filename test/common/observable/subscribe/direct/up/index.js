var Observable = require('../../../../../../lib/observable')
var count

beforeEach(function(){
	count = 0
})

describe('subscribing to non existing upward, two levels, nested field', function() {
	var a = new Observable()
	var grandParent
	var parent
	
	it( 'subcribes to parent on a', function(){
		a.subscribe({
			$upward:{
				field:true,
				power:true
			}
		},function( event, meta ){
			count++
		})
	})

	it( 'fires when added to parent', function() {
		parent = new Observable({
			field:true,
			a:{$useVal:a}
		})
		expect(count).equals(1)
	})

	it( 'does not fire when parent is added to grandparent', function() {
		grandParent = new Observable({
			field:true,
			p:{$useVal:parent}
		})
		expect(count).equals(0)
	})

	it( 'fires when adding other sub field to grandparent', function() {
		grandParent.set({
			power:true
		})
		expect(count).equals(1)
	})

})

describe('subscribing to rendered', function() {
	var a = new Observable()
	var parent

	it( 'subcribes to parent on a', function(){
		a.subscribe({
			$upward:{
				rendered:true
			}
		},function( event, meta ){
			count++
		})
	})

	it( 'does not fire when added to parent (loop)', function() {
		for (var i = 10; i >= 0; i--) {
			parent = new Observable({
				a:{$useVal:a}
			})
			a = parent
		}
		expect(count).equals(0)
	})

	it( 'fires when rendered set to true', function() {
		parent.set({rendered:true})
		expect(count).equals(1)
	})	

})