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
          this.setKey(key, property, event)
        })
      } else {
        for (let i in val) {
          this.setKey(i, val[i], event)
        }
      }
    }
  }
})

module.exports = cache.Constructor
