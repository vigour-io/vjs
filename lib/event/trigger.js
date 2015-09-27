'use strict'
/**
 * @function trigger
 * loop trough event queue
 * @param {integer} i - current index of queue defaults to 0 if undefined
 * @param {array} secondaryQueue - queue of secondaryQueue
 * @param {integer} j - current index of secondaryQueue defaults to 0 if undefined
 * @memberOf Event#
 */
module.exports = function (i, secondaryQueue, j) {
  // this is the nested needs to call
  // do checks in here
  if (this.isTriggered || j !== void 0 || i !== void 0) {
    if (!this.queue) {
      console.warn('no event queue, stop')
      this.remove()
      return
    }

    var queue = this.queue
    if (!i) {
      i = 0
    }

    for (var emitter$;(emitter$ = queue[i]);i++) {
      if (emitter$.secondary) {
        if (!secondaryQueue) {
          secondaryQueue = []
        }
        secondaryQueue.push(emitter$)
      } else {
        emitter$.trigger(this)
      }
    }

    if (secondaryQueue) {
      var cachedLength = queue.length
      if (!j) {
        j = 0
      }
      for (var secondary$; (secondary$ = secondaryQueue[j]); j++) {
        //will be trigger emit - trigger
        secondary$.trigger(this)
      }
      if (cachedLength !== queue.length) {
        this.trigger(i, secondaryQueue, j)
      } else {
        this.remove()
      }
    }
  }
}
