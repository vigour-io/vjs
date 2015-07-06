var Event = require('../base/on/event')
var A_splice = Array.prototype.splice

var $getPropertyValue = require('../../lib/base/set').$getPropertyValue
var $handleShifted = require('./handleshifted')

module.exports = function $splice(start, remove) {
  if(!remove) remove = 0

	var event = new Event()
    event.$val = arguments
    event.$origin = this

    var ret
    if(remove) {
      if(remove === 1) {
        ret = [this[start]]
      } else {
        ret = []
        for(var i = start, n = remove ; n ; n-- && i++ ) {
          ret.push(this[i])
        }
      }
    }
    
    var newValues = arguments.length - 2
    var length = this.length
    
    A_splice.apply(this, arguments)

    var i = Math.min(start, length)

    var newValsOldKeys = Math.min(newValues, length-start)

    while(newValsOldKeys) {
      this[i] = $getPropertyValue(this[i], event, this, i)
      i++
      newValsOldKeys--
    }

    var newValsNewKeys = start + newValues - length

    if(newValsNewKeys > 0) {
      while(newValsNewKeys) {
        // console.warn('new value in new key', i)
        this[i] = $getPropertyValue(this[i], event, this, i)
        i++
        newValsNewKeys--
      }
    } else if(newValues > remove){

      var oldValsOldKeys = -newValsNewKeys - remove
      newValsNewKeys = 0
      // console.log('oldValsOldKeys',oldValsOldKeys, newValsNewKeys, oldValsOldKeys, remove)
      while(oldValsOldKeys) {
        // console.warn('old value in old key', i)
        var item = this[i]
        if(item._$parent === this) {
          // console.log('i am the parent')
          item._$key = i
        } else {
          // console.log('oh noes I am context bay')
          this.$createListContextGetter(i)
        }
        i++
        oldValsOldKeys--
      }
        

    }

    if(length) {
      var oldValsNewKeys = newValues - newValsNewKeys - remove
      if(oldValsNewKeys > 0) {
        while(oldValsNewKeys) {
          // console.warn('old value in new key', i)
          var item = this[i]
          if(item._$parent === this) {
            // console.log('i am the parent')
            item._$key = i
          } else {
            // console.log('oh noes I am context bay')
            this.$createListContextGetter(i)
          }
          i++
          oldValsNewKeys--
        }  
      }
    }

    if(ret) {
      for(var i = 0, l = ret.length ; i < l ; i++) {
        console.warn('remove!')
        // ret[i].remove(event)
      }
      return ret
    }

  
}

// module.exports = function $splice(start, remove) {
//   if(!remove) remove = 0

//   var event = new Event()
//     event.$val = arguments
//     event.$origin = this

//     var ret
//     if(remove) {
//       if(remove === 1) {
//         ret = [this[start]]
//       } else {
//         ret = []
//         for(var i = start, n = remove ; n ; n-- && i++ ) {
//           ret.push(this[i])
//         }
//       }
//     }

//     var newValues = arguments.length - 2
//     var length = this.length
    
//     A_splice.apply(this, arguments)

//     var i = Math.min(start, length)

//     var newValsOldKeys = Math.min(newValues, length-start)

//     while(newValsOldKeys) {
//       this[i] = $getPropertyValue(this[i], event, this, i)
//       i++
//       newValsOldKeys--
//     }

//     var newValsNewKeys = start + newValues - length

//     if(newValsNewKeys > 0) {
//       while(newValsNewKeys) {
//         // console.warn('new value in new key', i)
//         this[i] = $getPropertyValue(this[i], event, this, i)
//         i++
//         newValsNewKeys--
//       }
//     } else if(newValues > remove){

//       var oldValsOldKeys = -newValsNewKeys - remove
//       newValsNewKeys = 0
//       // console.log('oldValsOldKeys',oldValsOldKeys, newValsNewKeys, oldValsOldKeys, remove)
//       while(oldValsOldKeys) {
//         // console.warn('old value in old key', i)
//         var item = this[i]
//         if(item._$parent === this) {
//           // console.log('i am the parent')
//           item._$key = i
//         } else {
//           // console.log('oh noes I am context bay')
//           this.$createListContextGetter(i)
//         }
//         i++
//         oldValsOldKeys--
//       }
        

//     }

//     if(length) {
//       var oldValsNewKeys = newValues - newValsNewKeys - remove
//       if(oldValsNewKeys > 0) {
//         while(oldValsNewKeys) {
//           // console.warn('old value in new key', i)
//           var item = this[i]
//           if(item._$parent === this) {
//             // console.log('i am the parent')
//             item._$key = i
//           } else {
//             // console.log('oh noes I am context bay')
//             this.$createListContextGetter(i)
//           }
//           i++
//           oldValsNewKeys--
//         }  
//       }
//     }

//     if(ret) {
//       for(var i = 0, l = ret.length ; i < l ; i++) {
//         console.warn('remove!')
//         // ret[i].remove(event)
//       }
//       return ret
//     }

  
// }

