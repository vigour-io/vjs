var Observable = require('../../../../../../lib/observable')
var subcription
var count
var instance

beforeEach(function(){
	count = 0
})

describe('subscribing to single existing field on instance', function() {
	var a = new Observable({
		$key:'a',
		aField:1
	})

	it( 'subcribes to field', function(){
		subcription = a.subscribe({
			aField:true
		},function(){
			console.log('hey biatch', this.$path)
			instance = this
			count++
		})
	})

	var b = new a.$Constructor({
		$key:'b'
	})

	it( 'fires on instance', function(){
		b.set({aField:true})
		expect(count).equals(1)
		expect(instance.$key).equals('b')
	})

})

describe('subscribing to parent on instance', function() {
	var a = new Observable({
		$key:'a',
		b:{}
	})

	it( 'subcribes to field', function(){
		console.log('\n------------------\n')
		subcription = a.b.subscribe({
			$parent:{
				$parent:true
			}
		},function(){
			instance = this
			count++
		})
	})

	it( 'fires on instance', function(){
		console.clear()
		var b = new Observable({
			$key:'obsB',
			c:{
				specialUseValA:{ $useVal:a }
			}
		})
		console.log('ghello done')
		expect(count).equals(1)
		expect(instance === b.c.specialUseValA.b).ok
	})

})

describe('subscribing to nested field on instance', function() {
	var a = new Observable({
		$key:'a',
		aField:{
			bField:true
		}
	})

	it( 'subcribes to field', function(){
		console.log('------------------\n')
		subcription = a.subscribe({
			aField:{
				bField:true
			}
		},function(){
			instance = this
			count++
		})
	})

	it( 'fires on instance', function(){
		var b = new a.$Constructor({
			$key:'b'
		})

		b.set({
			aField:{
				bField:1
			}
		})

		console.log('>>>',instance )

		expect(count).equals(1)
		expect(instance.$key).equals('b')
	})

})

describe('subscribing to single existing field on instance', function() {
	var a = new Observable({
		$key:'aOrignator',
		aField:{
			bField:true
		}
	})

	it( 'subcribes to field', function(){
		console.error('------------------\n')
		subcription = a.subscribe({
			$parent:{
				$parent:{
					c:{
						ballz:true
					}
				}
			}
		},function(){
			console.log('haha',this.$path)
			count++
		})
	})

	it( 'fires on instance', function(){
		console.clear()
		console.error('---- interesting shit----')
		var b = new Observable({
			$key:'b',
			$trackInstances:true,
			c:{
				ballz:1
			}
		})

		//why remove???
		//fires since addToNewParent
		b.set({
			d:{
				hahaFuckeriDo:{
					$useVal:new a.$Constructor()
				}
			}
		})

		expect(count).equals(1)
		expect(instance.$key).equals('b')

	})

})
