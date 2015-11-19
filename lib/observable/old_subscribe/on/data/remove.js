'use strict'
module.exports = function onRemove (data, event, emitter, pattern, mapValue, subscriber) {
  if (subscriber._input || mapValue.parent) {
    // TODO clean this one! Now we are redoing entire subscription
    pattern[this.key].val = true
    emitter.subscribePattern(data, event, subscriber)
  }
}
