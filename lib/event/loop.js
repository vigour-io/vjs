'use strict'

/**
 * @function loop
 * loop trough event queue
 * @param {integer} [i] current index of queue defaults to 0 if undefined
 * @param {array} [metaQueue] queue of meta emitters
 * @param {integer} [j] current index of meta queue defaults to 0 if undefined
 * @memberOf Event#
 */
module.exports = function (i, metaQueue, j) {
  var queue = this.queue
  if (!i) {
    i = 0
  }

  for (var emitter$;(emitter$ = queue[i]);i++) {
    if (emitter$.meta) {
      if (!metaQueue) {
        metaQueue = []
      }
      metaQueue.push(emitter$)
    } else {
      emitter$.emit(this, void 0, true)
      emitter$.isQueued = null
    }
  }

  if (metaQueue) {
    var cachedLength = queue.length
    if (!j) {
      j = 0
    }
    for (var meta$; (meta$ = metaQueue[j]); j++) {
      meta$.emit(this, void 0, true)
    }
    if (cachedLength !== queue.length) {
      this.loop(i, metaQueue, j)
    } else {
      this.clear()
    }
  }
}
