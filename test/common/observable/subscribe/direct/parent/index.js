var Observable = require('../../../../../../lib/observable')
var count

beforeEach(function(){
	count = 0
})

describe('subscribing to existing parent', function() {
	var a = new Observable({
		$key:'a',
		b: {}
	})
	var parent = new Observable({
		$key:'a-parent',
		a:{ $useVal:a }
	})

	it( 'subcribes to parent on a', function(){
		a.b.subscribe({
			$parent:{$parent:true}
		},function( event, meta ){
			count++
		})
	})

	it( 'doesn\'t fire on subscribing', function(){
		expect(count).equals(0)
	} )

	it( 'fires when parent changes', function() {
		console.warn('lets fire this parent!')
		parent.$val = 1
		expect(count).equals(1)
	})

	// it('fires for a deeper level')

})

describe('subscribing to nested field on existing parent', function() {
	var a = new Observable({
		$key:'a',
		b:0,
		c: {
			d: {

			}
		}
	})

	it( 'subcribes to parent on a', function(){
		console.clear()
		console.error('--------')

		a.c.d.subscribe({
			$parent: {
				$parent: {
					b: true
				}
			}
		},function( event, meta ){
			console.error('ghello', this.$path)
			count++
		})

		console.error('murder it!')
		a.b.$val = 1
		console.error('--------')

		expect(count).equals(1)
	})

	// it('fires for a deeper level')
})

describe('subscribing to non existing parent', function() {
	var a = new Observable({$key:'a'})

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
		console.clear()
		console.error('ok have to do real talk')
		var parent = new Observable({
			blurf:{$useVal:a}
		})
		console.error('----------------')
		expect(count).equals(1)
	})

})
