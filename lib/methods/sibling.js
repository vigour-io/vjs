'use strict'
exports.define = {
  previousSibling (infinite) {
    var prev
    return this.parent.each((prop) => {
      if (prop === this) {
        return prev
      }
      prev = prop
    }) || infinite && prev
  },
  nextSibling (infinite) {
    var next
    var parent = this.parent
    return parent.each((prop) => {
      if (next) {
        return prop
      }
      if (prop === this) {
        next = this
      }
    }) || infinite && parent.firstChild()
  },
  firstChild () {
    return this.each(function (prop) {
      return prop
    })
  }
}
