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
    // console.log('%c\n\n\n\ngot here tirgger time!', 'color:purple;font-size:24px;')
    if (!this.queue) {
      this.remove()
      return
    }

    let queue = this.queue
    if (!i) {
      i = 0
    }

    // console.log()
    for (let emitter$; (emitter$ = queue[i]); i++) { // eslint-disable-line
      if (emitter$.secondary) {
        // console.log('%csecondary push', 'color:purple;font-size16px;')
        if (!secondaryQueue) {
          secondaryQueue = []
        }
        secondaryQueue.push(emitter$)
      } else {
        // console.log('%cTRIGGER IT FROM THE EVENT!', 'color:purple;font-size16px;', queue.length)
        emitter$.trigger(this)
      }
    }

    if (secondaryQueue) {
      let cachedLength = queue.length
      if (!j) {
        j = 0
      }
      for (let secondary$; (secondary$ = secondaryQueue[j]); j++) { // eslint-disable-line
        // will be trigger emit - trigger
        // console.log('%csecondary TRIGGER IT FROM THE EVENT!', 'color:purple;font-size16px;')
        secondary$.trigger(this)
      }
      if (cachedLength !== queue.length) {
        this.trigger(i, secondaryQueue, j)
      } else {
        // console.log('remove it!')
        this.queue = null
        this.remove()
      }
    } else {
      this.queue = null
      // console.log('2 - remove it!', this.stamp)
      this.remove()
    }
  }
}
