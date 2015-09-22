'use strict'
// listeners
module.exports = function onChange (event, removed, subsemitter, refLevel, level, val, map, bind) {
  if (removed) {
    // TODO: this just updates the entire subscription, bad!
    var subsOrigin = subsemitter._$parent._$parent
    var updateSubscription

    if (subsOrigin._$input) {
      updateSubscription = true
    } else {
      for (var i in map) {
        if (i === '$parent') {
          updateSubscription = true
          break
        }
      }
    }

    if (updateSubscription) {
      // set the status of this subscription
      val[this.$key] = true
      // update entire subscription
      subsemitter.$loopSubsObject(subsOrigin, subsemitter._$pattern, event, 1, level, void 0, true)
    }
  }

  subsemitter._execEmit(this, map, refLevel, event)
}
