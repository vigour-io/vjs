'use strict'
var Base = require('../../../base')
var pattern = new Base({
  define: {
    each (fn) {
      for (var i in this) {
        if (i[0] !== '_' && i !== 'key') {
          let property = this[i]
          if (property !== null) {
            let ret = fn.call(this, this[i], i)
            if (ret) return ret
          }
        }
      }
    },
    generateId () {
      return ++this._subcount
    }
  }
})

pattern.set({
  __subcount: 0,
  define: {
    _subcount: {
      get () {
        return this.__subcount.val
      },
      set (val) {
        this.__subcount.val = val
      }
    }
  },
  ChildConstructor: new pattern.Constructor({
    define: {
      _subcount: {
        get () {
          return this.parent._subcount
        },
        set (val) {
          this.parent._subcount = val
        }
      }
    }
  }).Constructor
})

exports.properties = {
  pattern: pattern.Constructor
}
