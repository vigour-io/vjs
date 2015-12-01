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
  ],
  define: {
    generateConstructor () {
      return function derivedBase (val, event, parent, key) {
        Base.apply(this, arguments)
        if (parent && !parent[key]) {
          this.subField(false, void 0, parent.parent, this.pattern, 0, true, {})
        }
      }
    }
  }
}).Constructor
