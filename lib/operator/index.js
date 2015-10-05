'use strict'
var Observable = require('../observable')
var _emit = Observable.prototype.emit
var Event = require('../event')

var obs = new Observable({
  // for operators you dont want bind -- thats a bit annoying
  properties: {
    operator: '_operator',
    order: '_order'
  },
  define: {
    //  emit: function (key, data, event, ignore) {
    emit: function (key, data, event, ignore) {
      if(event===void 0) {
        event = new Event(this, key)
      }
      console.log('updace')
      //  && this.parent !== event.origin
      if (event && this._parent && this._parent.emit) {
        this._parent.emit(key, data, event, ignore)
      }
      return _emit.call(this, key, data, event, ignore)
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
