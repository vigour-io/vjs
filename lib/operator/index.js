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
      if (event === void 0) {
        event = new Event(this, key)
      }
      if (key === 'data' && event && event.type === 'data' && this._parent && this._parent.emit && !(event.origin === this._parent)) {
        // have to cancel if this guy created the event
        this._parent.emit(key, data, event, ignore)
      }

      return _emit.call(this, key, data, event, ignore)
    }
  },
  on: {
    parent: {
      operator (parent, event, operator) {
        parent = operator.parent

        let child = parent.ChildConstructor.prototype
        let on = child._on

        // do this already in subscribe operator

        if (on) {
          let ref = on.reference
          if (ref) {
            let attach = ref.attach
            if (attach) {
              var set = {}
              // child.$origin.remove()
              // do this in subscribe already?
              attach.each(function (property, key) {
                let attached = property[2]
                let pattern = attached[1]
                let map = attached[3]
                set[key] = {
                  map: map,
                  pattern: pattern.serialize()
                }

                var listens = property[1].listensOnAttach
                for (var i in listens) {
                  if (i[0] !== '_' && i !== 'key') {
                    let property = listens[i]
                    if (property.key === 'data') {
                      let attach = property.attach
                      for (let i in attach) {
                        attach.removeProperty(attach[i], i)
                      }
                    }
                  }
                }
              })
            }
          }
        }

        parent.setKey('_childSub', set, event)


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
