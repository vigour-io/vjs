'use strict'
var Observable = require('../observable')
var _emit = Observable.prototype.emit
var Event = require('../event')

var obs = new Observable({
  properties: {
    _operator: true,
    operator: '_operator'
  },
  bind () {
    let parent = this.parent
    return parent && parent.getBind()
  },
  define: {
    emit (key, data, event, ignore) {
      if (event || event === void 0 && (event = new Event(key))) {
        if (key === 'data' && event.type === 'data') {
          let parent = this._parent
          if (parent && parent.emit && !(event.origin === parent)) {
            parent.emit(key, data, event, ignore)
          }
        }
      }
      return _emit.call(this, key, data, event, ignore)
    }
  },
  on: {
    data (data, event) {
      if (this.parent) {
        this.parent.emit('data', data, event)
      }
    }
  }
})

module.exports = obs.Constructor
// this is dirty (requiring at the bottom, val uses Operator for instanceof checks)
obs.inject(require('./val'))
