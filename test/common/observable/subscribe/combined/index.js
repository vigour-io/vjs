var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var countOne
var countTwo
beforeEach(() => {
	countOne = 0
	countTwo = 0
})

describe('multiple subs on same target, parent', () => {
  var subscriptionOne
  var subscriptionTwo
  var a = new Observable({
    title: 'foo',
    one: {},
    two: {}
  })

  it('subcribes to field', () => {
    subscriptionOne = a.one.subscribe({
      parent: {
        title: true
      }
    }, function (data, event) {
      countOne++
    })
    subscriptionTwo = a.two.subscribe({
      parent: {
        title: true
      }
    }, function (data, event) {
      countTwo++
    })
    expect(countOne).equals(0)
  })

 // it('added a data listener to one', () => {
 //    var listenersOne = testListeners(subscriptionOne)
 //    console.log('make it:',listenersOne, subscriptionOne)
 //    console.log('--->',testListeners(a.title))

 //    expect(listenersOne.length).equals(1)
 //    expect(listenersOne).contains('data')
 //  })

 //  it('added a data listener to two', () => {
 //    var listenersTwo = testListeners(subscriptionTwo)
 //    expect(listenersTwo.length).equals(1)
 //    expect(listenersTwo).contains('data')
 //  })

  it('fires when updated', () => {
  	a.title.val = 'bar'
    expect(countOne).equals(1)
    expect(countTwo).equals(1)
  })
})

describe('multiple subs on same target, non-existing parent', () => {
  var subscriptionOne
  var subscriptionTwo
  var one = new Observable()
  var two = new Observable()
  var parent = new Observable({
  	title:'Mary'
  })
  it('subcribes to field', () => {
    subscriptionOne = one.subscribe({
      parent: {
        title: true
      }
    }, function (data, event) {
      countOne++
    })
    subscriptionTwo = two.subscribe({
      parent: {
        title: true
      }
    }, function (data, event) {
      countTwo++
    })
    expect(countOne).equals(0)
    expect(countTwo).equals(0)
  })

  it('fires for one, when added to parent', () => {
  	console.log('---adding---')
  	parent.set({
  		useVal:one
  	})
  	expect(countOne).equals(1)
  })

	it('fires for two, when added to parent', () => {
  	parent.set({
  		useVal:two
  	})
  	expect(countTwo).equals(1)
  })

	// it('added a data listener to one', () => {
 //    var listenersOne = testListeners(subscriptionOne)
 //    console.log('make it:',listenersOne, subscriptionOne)
 //    console.log('--->',testListeners(a.title))

 //    expect(listenersOne.length).equals(1)
 //    expect(listenersOne).contains('data')
 //  })

 //  it('added a data listener to two', () => {
 //    var listenersTwo = testListeners(subscriptionTwo)
 //    expect(listenersTwo.length).equals(1)
 //    expect(listenersTwo).contains('data')
 //  })

  // it('fires when updated', () => {
  // 	a.title.val = 'bar'
  //   expect(countOne).equals(1)
  //   expect(countTwo).equals(1)
  // })
})