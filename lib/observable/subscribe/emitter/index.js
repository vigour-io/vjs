'use strict'
var Emitter = require('../../../emitter')
var Base = require('../../../base')

module.exports = new Emitter({
  secondary: true,
  define: {
    subscribe: require('./subscribe'),
    upward: require('./upward'),
    generateConstructor: function () {
      return function derivedBase (val, event, parent, key) {
        var pattern = this._pattern
        Base.apply(this, arguments)
        this.clearContext()
        if (pattern && parent) {
          this.setKey('pattern', pattern, event)
        }
      }
    },
    run: function (event) {
      var emitter = this
      var listens = this.listensOnAttach
      if (listens) {
        listens.each(function (property, key) {
          if (property.key === 'data') {
            var obj = property._parent._parent
            property.attach.each(function (property) {
              emitter._parent.parent.emit(emitter.key, {origin: obj}, event)
            })
          }
        })
      }
    }
  },
  properties: {
    pattern: function (val, event) {
      var parent = this._parent
      var observable
      this._pattern = val
      if (parent) {
        observable = parent._parent
        this.subscribe(void 0, event, observable, val)
      } else {
        // console.warn('no parent yet --- need a way to know if this is added to a parent!')
      }
    }
  }
}).Constructor
