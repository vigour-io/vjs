'use strict'
var isEmpty = require('../../util/is/empty')
module.exports = function triggerInternal (binds, event) {
  if (binds) {
    delete binds.val // make this better
    for (let uid in binds) {
      let bind = binds[uid]
      let data // = bound._input //do later!
      // if (bound.context) {
        // this.triggerContext(bound, event, data, i)
      // }
      //
      // missing instances how to do?
      //----slowness!------
      if (this.emitInstances) {
        let instances = bind.getInstances()
        // context will become more elloborate
        if (instances && !bind._context) {
          let instance
          let length = instances.length
          for (let i = 0; i < length; i++) {
            instance = instances[i]
            this.execInternal(instance, event, data)
            // if (!isOverwritten(this, instance, data, key)) {
            // instance.emit(key, data, event)
            // }
          }
        }
      }
      // if (!bind._context) {
      this.execInternal(bind, event, data)
      // }

      let parent = bind.parent
      if (parent) {
        // if bind._context use context!
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
              // ok so no data yet , no exclusion but system
              this.execInternal(instance[bind.key], event, data)
            }
          }
        }
      }
      //----slowness!------
      // bind.clearContextUp()
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
