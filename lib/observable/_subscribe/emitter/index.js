'use strict'
var Emitter = require('../../../emitter')
var Base = require('../../../base')

module.exports = new Emitter({
  secondary: true,
  define: {
    subscribe: require('./subscribe'),
    upward: require('./upward'),
    generateId () {
      return this._patternId ? ++this._patternId : (this._patternId = 1)
    },
    addListener (obj, type, attach) {
      var on = obj._on
      if (on) {
        let listener = on[type]
        if (listener) {
          let attach = listener.attach
          if (attach) {
            let alreadyHaveListener = attach.each((prop) => {
              return prop[1] === this
            })
            if (alreadyHaveListener) {
              return
            }
          }
        }
      }
      obj.on(type, attach)
    },
    generateConstructor () {
      return function derivedBase (val, event, parent, key) {
        var pattern = this._pattern
        Base.apply(this, arguments)
        this.clearContext()
        if (pattern && parent) {
          this.setKey('pattern', pattern, event)
        }
      }
    },
    run (event) {
      var emitter = this
      var listens = this.listensOnAttach
      if (listens) {
        listens.each(function (property, key) {
          if (property.key === 'data') {
            var obj = property._parent._parent
            property.attach.each(function (property) {
              emitter._parent.parent.emit(emitter.key, {
                origin: obj
              }, event)
            })
          }
        })
      }
    }
  },
  properties: {
    pattern (val, event) {
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
