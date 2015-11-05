'use strict'
var Emitter = require('../../../emitter')
var Base = require('../../../base')

module.exports = new Emitter({
  secondary: true,
  inject: [
    require('../methods'),
    require('../properties')
  ],
  define: {
    generateConstructor () {
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
