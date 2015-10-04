var Base = require('../../../lib/base')
var Observable = require('../../../lib/observable')
var util = require('../../../lib/util')
var isPlainObj = util.isPlainObj

// Base.prototype.define({
//   safelySet: function (val, event, nocontext) {
//     var base = this
//     var resolveContext = !nocontext && base._context
//     if (isPlainObj(val)) {
//       if (resolveContext) {
//         base = base.resolveContext(val, event)
//       } else {
//         var changed
//         for (var key in val) {
//           if (base._input === null) {
//             break
//           }
//           if (key === 'val') {
//             if (base.setValue(val[key], event, resolveContext)) {
//               changed = true
//             }
//           } else {
//             if (base.safelySetKey(key, val[key], event, nocontext)) {
//               changed = true
//             }
//           }
//         }
//         if (!changed) {
//           return
//         }
//       }
//     } else {
//       base = base.setValue(val, event, resolveContext)
//     }
//     return base
//   },
//   safelySetKey: function (key, val, event, nocontext) {
//     var property = this[key]
//     if (this.properties[key] || property && !property.Constructor) {
//       key = 'escaped_' + key
//       property = this[key]
//     }
//     // return this.safelySetKeyInternal(key, val, this[key], event, nocontext)
//     if (property) {
//       if (property._parent !== this) {
//         if (val === null) {
//           this[key] = null
//           return this
//         } else {
//           var Constructor = property.Constructor
//           this[key] = new Constructor(void 0, false, this, key)
//           this[key].safelySet(val, event)
//           return this[key]
//         }
//       } else {
//         property.safelySet(val, event, nocontext)
//         return
//       // double check if not returning anything is the best choice
//       }
//     } else {
//       if (val !== null) {
//         this.addNewProperty(key, val, property, event)
//         return this
//       } else {
//         return
//       }
//     }
//   }
// })

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
    console.log(JSON.stringify(test.convert(), false, 2))
  })
})

describe('safelySet on Observable', function () {
  it('should store the reserved fields elsewhere', function () {
    var test = new Observable()
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
    console.log(JSON.stringify(test.convert(), false, 2))
  })
})
