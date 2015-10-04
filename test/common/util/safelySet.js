var Base = require('../../../lib/base')
var Observable = require('../../../lib/observable')

describe('safelySet on Base', function () {
  it('should store the reserved fields elsewhere', function () {
    var test = new Base()
    test.set({
      set: 'test',
      get: 'yoyo',
      setKey: 'funtimes',
      nerdje: {
        set: {
          get: {
            properties: {
              blups: true
            }
          }
        }
      },
      on: false
    }, void 0, void 0, true)
  })
})

describe('safelySet on Observable', function () {
  it('should store the reserved fields elsewhere', function () {
    var test = new Observable()
    test.set({
      set: 'test',
      get: 'yoyo',
      setKey: 'funtimes',
      setKeyInternal: {
        add: 12
      },
      nerdje: {
        set: {
          get: {
            properties: {
              blups: true
            }
          }
        }
      },
      on: false
    }, void 0, void 0, 'test_')
  })
})

// function startsWith (str, start) {
//   var i = 0
//   var letter = start[i]
//   while (letter) {
//     if (letter !== str[i]) {
//       return false
//     }
//     letter = start[++i]
//   }
//   return true
// }
