'use strict'

exports.getBind = function (previousValue) {
  var bind = this.bind
  var type
  if (bind) {
    type = typeof bind
    if (type === 'function') {
      bind = bind.call(this, previousValue)
    } else if (type === 'string') {
      // how to solve context in here?
      // console.log(this.key, this._parent._context)
      bind = this.get(bind)
    }
    return bind
  }
  return this
}
