'use strict'
var trigger = require('./method')

exports.define = {
  isExecutable: function (property, key, base, stamp) {
    // why do I need this property check
    var ignore = property && property._ignoreStamp
    if (ignore) {
      if (ignore === stamp) {
        return
      } else {
        property._ignoreStamp = null
        return !base._properties[key]
      }
    } else {
      return !base._properties[key]
    }
  },
  execInternal: function (bind, event) {
    var emitter = this
    var stamp = event.stamp
    var data = emitter.getData(event)

    if (emitter.base) {
      var type = emitter.key
      emitter.base.each(function (property) {
        property.emit(type, data, event)
      }, emitter.isExecutable, stamp)
    }

    if (emitter.setListeners) {
      emitter.setListeners.each(function (property) {
        bind.set(property, event)
      }, emitter.isExecutable, stamp)
    }
    var orig = bind
    bind = bind.getBind() // not rly sure about this one
    if (bind) {
      // set bind call using bind
      if (emitter.fn) {
        emitter.fn.each(function (property, key) {
          // bind on emitters is very confusing
          property.call(bind, data, event, orig)
        }, emitter.isExecutable, stamp)
      }

      if (emitter.attach) {
        emitter.attach.each(function (property) {
          execattach(property, bind, event, emitter, data)
        }, emitter.isExecutable, stamp)
      }
    // think of a storage name setListeners is a bit off
    }
  },
  trigger: function (event) {
    if (this.lastStamp !== event.stamp || !this.hasOwnProperty('lastStamp')) {
      if (this.condition && event.condition !== this.condition) {
        this.condition.trigger(event)
      } else {
        trigger.call(this, event)
      }
    }
  }
// // needs more tests
// // also add key
// trigger: function (val, target, event) {
//   if (!target && this._parent) {
//     target = this._parent._parent
//   }
//   if (!event) {
//     event = new Event(target, this.key)
//   }
//   if (val) {
//     if (typeof val === 'function') {
//       val.call(target, event, this.data)
//     } else if (val instanceof Base) {
//       val.emit(this.key, event)
//     } else {
//       execattach(val, target, event, this)
//     }
//   } else {
//     this.execInternal(target, event)
//   }
// }
}

function execattach (property, bind, event, emitter, data) {
  if (property[2]) {
    property[0].apply(
      bind,
      [ data, event ].concat(property[2])
    )
  } else {
    property[0].call(bind, data, event, property[1])
  }
}
