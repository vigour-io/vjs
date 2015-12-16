'use strict'
// lets make this into an array like object
// fix key moving! (make it special -- think about context)
var Observable = require('../../observable')
var Base = require('../../base')

var cache = new Observable({
  key: '_cache',
  define: {
    set (val, event) {
      console.log('----cache:', this.path.join('.'))
      if (val instanceof Base) {
        val.each((property, key) => {
          console.log('--key:', key, property)
          if (property._input !== null) {
            console.log('--set key:', key, property)
            this.setKey(key, property, event)
          }
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
