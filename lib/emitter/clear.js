'use strict'
exports.define = {
  clear (event) {
    var stamp = event.stamp
    this.removeDataStorage(event)
    this.removeQueue(event)
    if (this.binds) {
      delete this.binds[stamp]
    }
    if (this.contextBinds) {
      delete this.contextBinds[stamp]
    }
  }
}
