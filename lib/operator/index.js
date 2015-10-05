'use strict'
var Observable = require('../observable')
var emit = Observable.prototype.emit

var obs = new Observable({
  bind: 'parent', // fix the bind -- also do for emitters (fn)
  properties: {
    operator: '_operator',
    order: '_order'
  },
  define: {
    emit: function (data, event, bind, key, trigger, ignore) {
      if (this._parent && this._parent.emit) {
        this._parent.emit(data, event, bind, key, trigger, ignore)
      }
      return emit.call(this, data, event, bind, key, trigger, ignore)
    }
  }
})

module.exports = obs.Constructor
// this is dirty (requiring at the bottom)
obs.inject(require('./val'))
