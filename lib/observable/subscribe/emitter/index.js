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
      var listens = this.listensOnAttach
      if (listens) {
        listens.each((property, key) => {
          if (property.key === 'data') {
            var obj = property._parent._parent
            property.attach.each(function (property) {
              this._parent.parent.emit(this.key, {
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
      this._pattern = val
      if (parent) {
        let observable = parent._parent
        console.clear()
        observable.set({
          pattern:val
        },void 0, void 0, 'sub_')

        console.warn('pattern',observable.pattern,val)

        this.subscribe(void 0, event, observable, observable.pattern)
      } else {
        // console.warn('no parent yet --- need a way to know if this is added to a parent!')
      }
    }
  }
}).Constructor
