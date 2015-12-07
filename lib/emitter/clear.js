'use strict'
exports.define = {
  clear (event) {
    console.error('clear emitter!')
    this.removeQueue(event)
    if (this.binds) {
      delete this.binds[event.stamp]
      // maybe nested as well?
    }
  }
}
