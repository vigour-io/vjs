'use strict'
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var countOne
var countTwo

beforeEach(function () {
  countOne = 0
  countTwo = 0
})

// describe('simple condition', function () {
//   var obs = new Observable({
//     nested1: {
//       nest: {
//         title: 'foo'
//       },
//       trouble: false
//     },
//     nested2: {
//       subtitle: 'bar'
//     },
//     nested3: {
//       subtitle: 'funk'
//     }
//   })

//   obs = new obs.Constructor()

//   it('fired once', function () {
//     obs.subscribe({
//       nested1: {
//         nest: {
//           $condition: {
//             title: true
//           }
//         }
//       }
//     }, function (data) {
//       countOne++
//     }).run()

//     expect(countOne).equals(1)
//   })

//   // it('updating condition title doesnt fire subscription', function () {
//   //   obs.nested1.nest.title.val = 'bar'
//   //   expect(countOne).equals(0)
//   // })

//   // it('updating nested1 fires subscription', function () {
//   //   obs.nested1.val = 'foo'
//   //   expect(countOne).equals(1)
//   // })
// })

describe('simple condition context', function () {
  var obs = new Observable({
    mtvData: {
      NL: {
        title: 'flups'
      },
      DE: {
        title: 'flups'
      }
    }
  })
  var instance = new obs.Constructor()
  var sub = instance.subscribe({
    mtvData: {
      $any: {
        // title:true
        $condition: {
          title (title) {
            var firstLetter = title.val[0]
            return firstLetter === 'C' || firstLetter === 'A'
          }
        }
      },
      // DE: {
      //   // title:true
      //   $condition: {
      //     title (title) {
      //       var firstLetter = title.val[0]
      //       return firstLetter === 'C' || firstLetter === 'A'
      //     }
      //   }
      // }
    }
  }, function (data) {

  })
})