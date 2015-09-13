var Observable = require('../../../../../../lib/observable')
var count

beforeEach(function(){
	count = 0
})

describe('subscribing to existing parent', function() {
	var a = new Observable()
	var parent = new Observable({
		a:{$useVal:a}
	})

	it( 'subcribes to parent on a', function(){
		a.subscribe({
			$parent:true
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

describe('subscribing to non existing parent', function() {
	var a = new Observable()

	it( 'subcribes to parent on a', function(){
		a.subscribe({
			$parent:true
		},function( event, meta ){
			count++
		})
	})

	it( 'doesn\'t fire on subscribing', function(){
		expect(count).equals(0)
	} )

	it( 'fires when a is added to parent', function() {
		var parent = new Observable({
			a:{$useVal:a}
		})
		expect(count).equals(1)
	})

})