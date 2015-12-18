'use strict'
// lets make this into an array like object
// fix key moving! (make it special -- think about context)
var Observable = require('../../observable')
var Base = require('../../base')

var cache = new Observable({
  key: '_cache',
  define: {
    set (val, event) {
      if (val instanceof Base) {
        val.each((property, key) => {
          if (property._input !== null) {
            this.setKey(key, property, event)
          }
        })
        val.clearContextUp()
      } else {
        for (let i in val) {
          this.setKey(i, val[i], event)
          // this.parent.clearContextUp()
        }
      }
    }
  }
})

module.exports = cache.Constructor
