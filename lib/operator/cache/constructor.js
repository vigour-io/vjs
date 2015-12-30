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
            this.setKey(key, property, false)
          }
        })
        // val.clearContextUp()
      } else {
        for (let i in val) {
          this.setKey(i, val[i], event)
          // this.parent.clearContextUp()
        }
      }
    },
    filter (val, event) {
      this.each(function remove (property, key) {
        var field = val[key]
        if (!field || field._input === null) {
          property.remove(event)
        }
      })
    }
  }
})

module.exports = cache.Constructor