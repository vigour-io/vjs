'use strict'

var merge = require('../../util/merge')

module.exports = function (parsed) {
  let cache = this._cache
  if (typeof parsed === 'object') {
    if (parsed === null) {
      if (cache) {
        cache.remove()
      }
      return
    }
    if (!cache) {
      let child = this.ChildConstructor.prototype
      // let on = child._on

      this.setKey('_cache', {
        ChildConstructor: child,
        val: this
      })
      cache = this._cache

      // // //add event!
      // if (on) {
      //   let ref = on.reference
      //   if (ref) {
      //     let attach = ref.attach
      //     if (attach) {
      //       var set = {}
      //       // do this in subscribe already?
      //       attach.each(function (property, key) {
      //         let attached = property[2]
      //         let pattern = attached[1]
      //         let map = attached[3]
      //         set[key] = {
      //           map: map,
      //           pattern: pattern.serialize()
      //         }
      //         property[1].remove()
      //       })
      //     }
      //   }
      // }

      // cache._subscription = set
    }
    return cache
  } else if (cache) {
    cache.remove()
  }
}
