'use strict'
var isEmpty = require('../../util/is/empty')
window.cnt = 0
module.exports = function triggerInternal (binds, event) {
  if (binds) {
    delete binds.val
    // make this better
    for (let uid in binds) {
      let bind = binds[uid]
      let data // = bound._input //do later!
      // if (bound.context) {
        // this.triggerContext(bound, event, data, i)
      // }
      //

      //----slowness!------
      let parent = bind.parent
      if (parent) {
        // share this over binds etc
        let contextInstances
        let parentInstances
        let path = []
        let instance
        while (parent) {
          parentInstances = parent.getInstances()
          if (parentInstances) {
            contextInstances = parentInstances
            break
          }
          path.push(parent.key)
          parent = parent._parent
        }
        if (contextInstances) {
          for (let i = 0, length = contextInstances.length; i < length; i++) {
            instance = contextInstances[i]
            instance.clearContext()
            for (let j = path.length - 1; j >= 0 && instance; j--) {
              instance = instance[path[j]]
            }
            if (instance) {
              cnt ++
              this.execInternal(instance[bind.key], event, data)
            }
          }
        }
      }
      //----slowness!------

      if (bind) {
        // bind.clearContextUp()
        this.execInternal(bind, event, data)
      }
      // delete binds[uid]
    }
  }
}
//
// while (parent) {
//   parentInstances = parent.getInstances()
//   if (parentInstances) {
//     contextInstances = parentInstances
//     break
//   }
//   path.push(parent.key)
//   parent = parent._parent
// }
//
// if (contextInstances) {
//   for (let i = 0, length = contextInstances.length; i < length; i++) {
//     instance = contextInstances[i]
//     instance.clearContext()
//
//     for (let j = path.length - 1; j >= 0 && instance; j--) {
//       property = path[j]
//       instance = instance[property]
//     }
