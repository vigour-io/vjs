'use strict'
var Observable = require('../observable')
var _emit = Observable.prototype.emit
var Event = require('../event')

var obs = new Observable({
  properties: {
    operator: '_operator',
    order (val) {
      var bind = this.getBind()
      if (bind._operators) {
        // add hasOwnProperty this will create problems -- else make new
        delete bind._operators
      }
      this._order = val
    }
  },
  bind () {
    let parent = this.parent
    return parent && parent.getBind()
  },
  define: {
    emit (key, data, event, ignore) {
      if (event || event === void 0 && (event = new Event(this, key))) {
        if (key === 'data' && event.type === 'data') {
          let parent = this._parent
          if (parent && parent.emit && !(event.origin === parent)) {
            // have to cancel if this guy created the event
            parent.emit(key, data, event, ignore)
          }
        }
      }
      return _emit.call(this, key, data, event, ignore)
    }
  },
  on: {
    parent: {
      operator (parent, event, operator) {
        parent = operator.parent
        if (!operator._order) {
          if (!parent._operatorIndex) {
            parent._operatorIndex = 1
          }
          parent._operatorIndex++
          operator._order = parent._operatorIndex
        }
        removeOperatorsCache(parent)
      }
    },
    remove: {
      operator (data, event, operator) {
        removeOperatorsCache(operator.parent)
      }
    }
  }
})

function removeOperatorsCache (parent) {
  if (parent._operators) {
    // add hasOwnProperty this will create problems -- else make new
    delete parent._operators
  }
}

module.exports = obs.Constructor
// this is dirty (requiring at the bottom, val uses Operator for instanceof checks)
obs.inject(require('./val'))
