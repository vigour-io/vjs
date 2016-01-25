'use strict'
var Base = require('../../base')
var remove = Base.prototype.remove

// function Condition (val, event, parent, key, escape) {
//   Base.apply(this, arguments)
// }

module.exports = new Base({
  key: 'condition',
  ignoreInput: true,
  properties: {
    inProgress: true
  },
  inject: [
    require('./trigger')
  ],
  define: {
    generateConstructor () {
      return function (val, event, parent, key) {
        Base.apply(this, arguments)
      }
    },
    remove () {
      // console.error('remove -- cancel')
      // this.cancel()
      return remove.apply(this, arguments)
    }
  }
}).Constructor
