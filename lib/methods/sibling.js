'use strict'
exports.define = {
  previousSibling () {
    var prev
    return this.parent.each(function (prop) {
      if (prop === this) {
        return prev
      }
    })
  },
  nextSibling () {
    var next
    return this.parent.each(function (prop) {
      if (next) {
        return prop
      }
      if (prop === this) {
        next = this
      }
    })
  }
}
