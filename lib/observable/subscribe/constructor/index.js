'use strict'
var Emitter = require('../../../emitter')
var Base = require('../../../base')
var set = Base.prototype.set

module.exports = new Emitter({
  emitInstances: false,
  secondary: true,
  properties: {
    pattern: new Base({
      define: {
        set (val, event, nocontext, escape) {
          return set.call(this, val, event, nocontext, 'sub_')
        }
      }
    })
  },
  inject: [
    require('../run'),
    require('../field'),
    require('../object'),
    require('../upward'),
    require('../findemit')
  ]
}).Constructor
