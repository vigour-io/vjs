'use strict'

module.exports = function (emitter, bind, event, data) {
  if (!emitter.getBind(event, bind, 'val')) {
    // will add an attach field for from instances
    emitter.setBind(event, bind, data)
    return true
  }
}
