'use strict'
/**
 * @function loop
 * loop trough event queue
 * @param {integer} i - current index of queue defaults to 0 if undefined
 * @param {array} secondaryQueue - queue of secondaryQueue
 * @param {integer} j - current index of secondaryQueue defaults to 0 if undefined
 * @memberOf Event#
 */
module.exports = function (i, secondaryQueue, j) {
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
      emitter$.emit(this, void 0, true)
      emitter$.isQueued = null
    }
  }

  if (secondaryQueue) {
    var cachedLength = queue.length
    if (!j) {
      j = 0
    }
    for (var secondary$; (secondary$ = secondaryQueue[j]); j++) {
      secondary$.emit(this, void 0, true)
    }
    if (cachedLength !== queue.length) {
      this.loop(i, secondaryQueue, j)
    } else {
      this.clear()
    }
  }
}
