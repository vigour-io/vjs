'use strict'
/**
 * @function trigger
 * loop trough event queue
 * @memberOf Event#
 */
// var isNumberLike = require('../util/is/numberlike')
module.exports = function () {
  for (var uid in this) {
    if (uid !== 'stamp' && uid !== 'type' && uid !== '_onClose') {
      this[uid].val.trigger(this[uid], this)
    }
  }
  this.remove()
}
