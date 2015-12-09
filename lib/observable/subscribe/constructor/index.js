'use strict'
var Emitter = require('../../../emitter')
var Base = require('../../../base')
var setKey = Base.prototype.setKey

var pattern = new Base({
  properties: {
    $condition: true,
    $any: true,
    _stamp: true
  },
  define: {
    setKey (key, val, event, nocontext, escape) {
      if (key === 'parent') {
        return setKey.call(this, '$parent', val, event, nocontext, escape)
      }
      return setKey.apply(this, arguments)
    }
  },
  ChildConstructor: 'Constructor'
})

module.exports = new Emitter({
  emitInstances: false,
  properties: {
    pattern: pattern
  },
  inject: [
    require('../run'),
    require('../field'),
    require('../object'),
    require('../upward'),
    require('../findemit'),
    require('../condition')
  ],
  define: {
    generateConstructor () {
      return function derivedBase (val, event, parent, key) {
        Base.apply(this, arguments)
        if (parent && !parent[key]) {
          this.subField(false, void 0, parent.parent, this.pattern, 0, { val:true }, {})
        }
      }
    }
  }
}).Constructor
