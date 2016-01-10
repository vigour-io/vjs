'use strict'
exports.define = {
  previousSibling () {
    var prev 
    return this.parent.each((prop) => {
      if (prop === this) {
        return prev
      }
      prev = prop
    })
  },
  nextSibling () {
    var next
    return this.parent.each((prop) => {
      if (next) {
        return prop
      }
      if (prop === this) {
        next = this
      }
    })
  }
}
