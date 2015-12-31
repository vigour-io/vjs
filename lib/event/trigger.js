'use strict'
/**
 * @function trigger
 * loop trough event queue
 * @memberOf Event#
 */
// var isNumberLike = require('../util/is/numberlike')
// test later if faster
var excludes = {
  stamp: true,
  prevent: true,
  _triggered: true,
  type: true,
  _onClose: true,
  data: true
}
module.exports = function () {
  this._triggered = true
  for (var uid in this) {
    console.log(uid)
    if (!excludes[uid]) {
      this[uid].val.trigger(this[uid], this)
    }
  }
  this.remove()
}
