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
      if (this._parent && this._parent.emitInternal && this._parent !== event.origin) {
        this._parent.emitInternal(data, event, bind, key, trigger, ignore)
      }
      return _emitInternal.call(this, data, event, bind, key, trigger, ignore)
    }
  },
  on: {
    parent: {
      operatorCache: removeOperatorsCache
    },
    remove: {
      operatorCache: function () {
        var parent = this.parent
        if (parent) {
          removeOperatorsCache(parent)
        }
      }
    }
  }
})

function removeOperatorsCache (parent) {
  if (parent._operators) {
    delete parent._operators
  }
}

module.exports = obs.Constructor
// this is dirty (requiring at the bottom, val uses Operator for instanceof checks)
obs.inject(require('./val'))
