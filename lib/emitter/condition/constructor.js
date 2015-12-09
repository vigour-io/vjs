'use strict'
var Base = require('../../base')
var remove = Base.prototype.remove

function Condition (val, event, parent, key, escape) {
  if (event) {
    this._ignoreStamp = event.stamp
  }
  Base.apply(this, arguments)
}

module.exports = new Base({
  constructor: Condition,
  key: 'condition',
  ignoreInput: true,
  properties: {
    inProgress: true
  },
  inject: [
    require('./trigger'),
    require('./cancel')
  ],
  define: {
    bind () {
      return this.parent.parent.parent
    },
    generateConstructor () {
      return function (val, event, parent, key) {
        Condition.apply(this, arguments)
      }
    },
    remove () {
      console.error('remove -- cancel')
      this.cancel()
      return remove.apply(this, arguments)
    }
  }
}).Constructor
