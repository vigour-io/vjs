'use strict'
var Observable = require('../observable')
var _emitInternal = Observable.prototype.emitInternal

var obs = new Observable({
  bind: 'parent', // fix the bind -- also do for emitters (fn)
  properties: {
    operator: '_operator',
    order: '_order'
  },
  define: {
    emitInternal: function (data, event, bind, key, trigger, ignore) {
      if (this._parent && this._parent.emit && this._parent !== event.origin) {
        this._parent.emit(data, event, bind, key, trigger, ignore)
      }
      return _emitInternal.call(this, data, event, bind, key, trigger, ignore)
    }
  }
})

module.exports = obs.Constructor

// this is dirty (requiring at the bottom, val uses Operator for instanceof checks)
obs.inject(require('./val'))
