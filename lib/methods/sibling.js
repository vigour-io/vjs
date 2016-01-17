'use strict'
var Base = require('../base')

exports.define = {
  previousSibling (infinite, exclude) {
    var prev
    return this.parent.each((prop, key) => {
      if (prop === this) {
        return prev
      }
      if (prop instanceof Base && key !== exclude) {
        prev = prop
      }
    }) || infinite && prev
  },
  nextSibling (infinite, exclude) {
    var next
    var parent = this.parent
    return parent.each((prop, key) => {
      if (prop instanceof Base && next && key !== exclude) {
        console.log('return!', key, prop)
        return prop
      }
      if (prop === this) {
        next = this
      }
    }) || infinite && parent.firstChild()
  },
  firstChild (exclude) {
    return this.each(function (prop, key) {
      if (prop instanceof Base && key !== exclude) {
        return prop
      }
    })
  }
}
