'use strict'
var Emitter = require('../../emitter')
var Base = require('../../base')

module.exports = new Emitter({
  inject: require('./loop'),
  secondary: true,
  properties: {
    pattern: function (val, event) {
      var parent = this._parent
      var observable
      this._pattern = val
      if (parent) {
        observable = parent._parent
        this.loop(event, void 0, observable, val)
      } else {
        console.warn('no parent yet --- need a way to know if this is added to a parent!')
      }
    }
  },
  define: {
    generateConstructor: function () {
      return function derivedBase (val, event, parent, key) {
        var pattern = this._pattern
        Base.apply(this, arguments)
        this.clearContext()
        if (pattern && parent) {
          this.setKey('pattern', pattern, event)
        }
      }
    }
  }
}).Constructor
