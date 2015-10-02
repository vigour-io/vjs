'use strict'

exports.getBind = function (previousValue) {
  var bind = this.bind
  var type
  if (bind) {
    type = typeof bind
    if (type === 'function') {
      bind = bind.call(this, previousValue)
    } else if (type === 'string') {
      bind = this.get(bind)
    } else {
      bind = this
    }
  }
  return bind
}
