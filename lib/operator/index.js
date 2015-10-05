'use strict'
var Observable = require('../observable')
var _emitInternal = Observable.prototype.emitInternal

var obs = new Observable({
  // for operators you dont want bind -- thats a bit annoying
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
      operator: function (parent) {
        if (!this._order) {
          // length support ... - is perfect for that
          // make these less important
          if (!parent._operatorIndex) {
            parent._operatorIndex = 1
          }
          parent._operatorIndex++
          this._order = parent._operatorIndex
        }
        removeOperatorsCache(parent)
      }
    },
    remove: {
      operator: function () {
        var parent = this._parent
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
