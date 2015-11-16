var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var countOne
var countTwo

beforeEach(() => {
  countOne = 0
  countTwo = 0
})

// describe('multiple subs on same target, parent', () => {
//   var subscriptionOne
//   var subscriptionTwo
//   var a = new Observable({
//     title: 'foo',
//     one: {},
//     two: {}
//   })

//   it('subscribes to field', () => {
//     subscriptionOne = a.one.subscribe({
//       parent: {
//         title: true
//       }
//     }, function (data, event) {
//       countOne++
//     })
//     subscriptionTwo = a.two.subscribe({
//       parent: {
//         title: true
//       }
//     }, function (data, event) {
//       countTwo++
//     })
//     expect(countOne).equals(0)
//   })

//   it('fires when updated', () => {
//     a.title.val = 'bar'
//     expect(countOne).equals(1)
//     expect(countTwo).equals(1)
//   })
// })

// describe('multiple subs on same target, upward', () => {
//   var subscriptionOne
//   var subscriptionTwo
//   var a = new Observable({
//     title: 'foo',
//     one: {},
//     two: {}
//   })

//   it('subscribes to field', () => {
//     subscriptionOne = a.one.subscribe({
//       upward: {
//         title: true
//       }
//     }, function (data, event) {
//       countOne++
//     })
//     subscriptionTwo = a.two.subscribe({
//       upward: {
//         title: true
//       }
//     }, function (data, event) {
//       countTwo++
//     })
//     expect(countOne).equals(0)
//   })

//   it('fires when updated', () => {
//     a.title.val = 'bar'
//     expect(countOne).equals(1)
//     expect(countTwo).equals(1)
//   })
// })

// describe('multiple subs on same target, non-existing parent', () => {
//   var subscriptionOne
//   var subscriptionTwo

//   var one = new Observable()
//   var two = new Observable()

//   var parent = new Observable({
//     title: 'Mary'
//   })

//   it('subscribes to field', () => {
//     subscriptionOne = one.subscribe({
//       parent: {
//         title: true
//       }
//     }, function (data, event) {
//       countOne++
//     })
//     subscriptionTwo = two.subscribe({
//       parent: {
//         title: true
//       }
//     }, function (data, event) {
//       countTwo++
//     })
//     expect(countOne).equals(0)
//     expect(countTwo).equals(0)
//   })

//   it('fires for one, when added to parent', () => {
//     parent.set({
//       child1: {
//         useVal: one
//       }
//     })
//     expect(countOne).equals(1)
//   })

//   it('fires for two, when added to parent', () => {
//     parent.set({
//       child2: {
//         useVal: two
//       }
//     })
//     expect(countTwo).equals(1)
//   })

//   it('fires when updated', () => {
//     parent.title.val = 'Fred'
//     expect(countOne).equals(1)
//     expect(countTwo).equals(1)
//   })
// })

// describe('multiple subs on same target, non-existing upward', () => {
//   var subscriptionOne
//   var subscriptionTwo

//   var one = new Observable()
//   var two = new Observable()

//   var parent = new Observable({
//     title: 'Mary'
//   })

//   it('subscribes to field', () => {
//     subscriptionOne = one.subscribe({
//       upward: {
//         title: true
//       }
//     }, function (data, event) {
//       countOne++
//     })
//     subscriptionTwo = two.subscribe({
//       parent: {
//         title: true
//       }
//     }, function (data, event) {
//       countTwo++
//     })
//     expect(countOne).equals(0)
//     expect(countTwo).equals(0)
//   })

//   it('fires for one, when added to parent', () => {
//     parent.set({
//       child1: {
//         useVal: one
//       }
//     })
//     expect(countOne).equals(1)
//   })

//   it('fires for two, when added to parent', () => {
//     parent.set({
//       child2: {
//         useVal: two
//       }
//     })
//     expect(countTwo).equals(1)
//   })

//   it('fires when updated', () => {
//     parent.title.val = 'Fred'
//     expect(countOne).equals(1)
//     expect(countTwo).equals(1)
//   })
// })

// describe('multiple subs on same target, non-existing parent, instances', () => {
//   var subscriptionOne
//   var subscriptionTwo

//   var one = new Observable()
//   var two = new Observable()

//   var parent = new Observable({
//     title: 'Mary'
//   })

//   it('subscribes to field', () => {
//     subscriptionOne = one.subscribe({
//       parent: {
//         title: true
//       }
//     }, function (data, event) {
//       countOne++
//     })
//     subscriptionTwo = two.subscribe({
//       parent: {
//         title: true
//       }
//     }, function (data, event) {
//       countTwo++
//     })
//     expect(countOne).equals(0)
//     expect(countTwo).equals(0)
//   })

//   it('fires for one, when added to parent', () => {
//     parent.set({
//       child1: {
//         useVal: new one.Constructor()
//       }
//     })
//     expect(countOne).equals(1)
//   })

//   it('fires for two, when added to parent', () => {
//     parent.set({
//       child2: {
//         useVal: new two.Constructor()
//       }
//     })
//     expect(countTwo).equals(1)
//   })

//   it('fires when updated', () => {
//     parent.title.val = 'Fred'
//     expect(countOne).equals(1)
//     expect(countTwo).equals(1)
//   })
// })

// describe('multiple subs on same target, upward, instance', () => {
//   var subscriptionOne
//   var subscriptionTwo
//   var parent = new Observable()
//   var a = new Observable({
//     one: {},
//     two: {}
//   })

//   it('subscribes to field', () => {
//   	console.log('-----one-----')
//     subscriptionOne = a.one.subscribe({
//       upward: {
//         title: true
//       }
//     }, function (data, event) {
//       countOne++
//     })

//     console.log('-----two-----')
//     subscriptionTwo = a.two.subscribe({
//       upward: {
//         title: true
//       }
//     }, function (data, event) {
//     	console.log('fun two!',countTwo)
//       countTwo++
//     })

//     expect(countOne).equals(0)
//   })

//   it('fires when updated', () => {
//   	console.log('-----set-----')
//     parent.set({
//     	title:'fonz',
//       child: {
//         useVal: new a.Constructor()
//       }
//     })
//     expect(countOne).equals(1)
//     expect(countTwo).equals(1)
//   })
// })

describe('removing reference listeners after reference switch', () => {
  var ref1 = new Observable({
    title: 'refOne'
  })
  var ref2 = new Observable({
    title: 'refOne'
  })
  var a = new Observable(ref1)

  it('subscribes to field', () => {
    a.subscribe({
      title: true
    }, function (data, event) {
      countOne++
    })
    expect(countOne).equals(0)
  })

  it('fires when ref1 is updated', function () {
    ref1.title.val = 'smur'
    expect(countOne).equals(1)
  })

  it('ref1 has listeners', function () {
    expect(testListeners(ref1.title).length).equals(1)
  })
  
  it('switch to ref2 => ref2 has listeners', function () {
  	console.log('-----switch reference-----')
  	a.set(ref2)
    expect(testListeners(ref2.title).length).equals(1)
  })

  it('removed ref1 listeners', function () {
    expect(testListeners(ref1.title).length).equals(0)
  })
})
