'use strict'
var Emitter = require('../../../emitter')
var Base = require('../../../base')

var LightObservable = new Base({
  inject: [
    require('../../constructor'),
    require('../../on'),
    require('../../emit'),
    require('../../off'),
    require('../../remove'),
    require('../../set')
  ]
}).Constructor

var setKey = LightObservable.prototype.setKey

module.exports = new Emitter({
  emitInstances: false,
  secondary: true,
  properties: {
    pattern: new LightObservable({
      define: {
        setKey (key, val, event, nocontext, escape) {
          if (key === 'parent') {
            key = '$parent'
          }
          return setKey.call(this, key, val, event, nocontext, escape)
        }
      },
      ChildConstructor: 'Constructor'
    })
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
          this.subField(false, void 0, parent.parent, this.pattern, 0, true, {})
        }
      }
    }
  }
}).Constructor
