'use strict'
var Observable = require('../observable')

module.exports = new Observable({
  bind: 'parent', // fix the bind -- also do for emitters (fn)
  properties: {
    operator: function (val) {
      // wrap some more funky stuff here or make it easier to make result operators for obj
      this.operators[this.key] = true
      // maybe make this inheritable?
      this._operator = val
    }
  },
  define: {
    hasOperators: function (base) {
      for (var key in this.operators) {
        if (base[key]) {
          return true
        }
      }
    },
    operators: {
      value: {},
      writable: true
    }
  },
  inject: require('./val')
}).Constructor
