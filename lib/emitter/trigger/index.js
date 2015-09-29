'use strict'
var trigger = require('./method')

exports.define = {
  exclude: function (property, key, base, stamp) {
    var ignore = property._ignoreStamp
    if (ignore) {
      if (ignore === stamp) {
        return true
      } else {
        property._ignoreStamp = null
        // exclude is more basic now have to do "this._properties[key]" manualy
        return base._properties[key]
      }
    } else {
      return base._properties[key]
    }
  },
  execInternal: function (bind, event) {
    var emitter = this
    var stamp = event.stamp

    if (emitter.fn) {
      emitter.fn.each(function (property, key) {
        property.call(bind, emitter.data, event)
      }, emitter.exclude, stamp)
    }

    if (emitter.base) {
      var type = emitter.key
      emitter.base.each(function (property) {
        property.emit(type, emitter.data, event)
      }, emitter.exclude, stamp)
    }

    if (emitter.attach) {
      emitter.attach.each(function (property) {
        execattach(property, bind, event, emitter)
      }, emitter.exclude, stamp)
    }
    // think of a storage name setListeners is a bit off
    if (emitter.setListeners) {
      emitter.setListeners.each(function (property) {
        bind.set(property, event)
      }, emitter.exclude, stamp)
    }
  },
  trigger: function (event) {
    if (this.lastStamp !== event.stamp || !this.hasOwnProperty('lastStamp')) {
      if (this.condition) {
        this.condition.exec(event)
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

function execattach (property, bind, event, emitter) {
  if (property[2]) {
    property[0].apply(
      bind,
      [ emitter.data, event ].concat(property[2])
    )
  } else {
    property[0].call(bind, emitter.data, event, property[1])
  }
}
