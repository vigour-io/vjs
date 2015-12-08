'use strict'
/**
 * @function trigger
 * loop trough event queue
 * @memberOf Event#
 */
module.exports = function () {
  if (this.isTriggered) {
    if (!this.queue) {
      this.remove()
      return
    }

    let queue = this.queue
    for (let emitter$, i = 0; (emitter$ = queue[i]); i++) { // eslint-disable-line
      emitter$.trigger(this)
      // queue.shift()
    }
    this.queue = null
    this.remove()
  }
}
