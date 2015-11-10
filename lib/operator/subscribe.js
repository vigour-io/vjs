'use strict'
var Operator = require('./')
var objectCache = require('./cache/object')
exports.inject = require('./val')
exports.properties = {
  $: function (pattern) {
    if (typeof pattern === 'string') {
      let keys
      let value = true
      if (~pattern.indexOf('/')) {
        keys = pattern.split('/')
        for (let i = keys.length - 1; i >= 0; i--) {
          let key = keys[i]
          if (key === '..') {
            key = 'parent'
          } else if (key === '...') {
            key = 'upward'
          }
          pattern = {}
          pattern[key] = value
          value = pattern
        }
      } else {
        keys = pattern.split('.')
        for (let i = keys.length - 1; i >= 0; i--) {
          let key = keys[i]
          pattern = {}
          pattern[key] = value
          value = pattern
        }
      }
    }
    this.setKey('$subscribe')
    this.subscribe(pattern, function (data, event) {
      console.error('subscribe!', this.path, '<----',data.origin.path)
      this.$subscribe.set(data.origin)
    }).run()
  },
  $subscribe: new Operator({
    key: '$subscribe',
    operator: function (val, operator, origin) {
      console.log('sub operator', val, operator)
      var parsed = operator.parseValue(val, origin)
      var cached = objectCache.call(this, parsed)
      if (cached) {
        // events etc to these sets!
        cached.clear()
        cached.set(parsed)
        return cached
      } else {
        return parsed
      }
    }
  })
}
// 'use strict'
// var Operator = require('./')
// var objectCache = require('./cache/object')
// exports.inject = [
//   require('./val')
// ]

// exports.properties = {
//   $: {
//     val: new Operator({
//       key: '$',
//       define: {
//         set: function (pattern) {

//           // ../../field === parent.parent.field
//           if (typeof pattern === 'string') {
//             var keys
//             var value = true
//             if (~pattern.indexOf('/')) {
//               keys = pattern.split('/')
//               for (let i = keys.length - 1; i >= 0; i--) {
//                 let key = keys[i]
//                 if (key === '..') {
//                   key = 'parent'
//                 } else if (key === '...') {
//                   key = 'upward'
//                 }
//                 pattern = {}
//                 pattern[key] = value
//                 value = pattern
//               }
//             } else {
//               keys = pattern.split('.')
//               for (let i = keys.length - 1; i >= 0; i--) {
//                 let key = keys[i]
//                 pattern = {}
//                 pattern[key] = value
//                 value = pattern
//               }
//             }
//           }
//           this._parent.subscribe(pattern, function (data, event) {
//             // if (!this.hasOwnProperty('_$') && this._$._context) {
//             //   this._$.resolveContext({}, event)
//             // }
//             this._$.output = data.origin
//             this.emit('data', event)
//           }).run()
//         }
//       },
//       operator: function (val, operator, origin) {
//         var parsed = operator.parseValue(val, origin)
//         var cached = objectCache.call(this, parsed)
//         if (cached) {
//           // events etc to these sets!
//           cached.clear()
//           cached.set(parsed)
//           return cached
//         } else {
//           return parsed
//         }
//       }
//     }),
//     override: '_$'
//   }
// }
