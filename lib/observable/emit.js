'use strict'
var Event = require('../event')
var util = require('../util')
var convertToArray = util.convertToArray

exports.inject = [
  require('./instances'),
  require('./instances/emit'),
  require('./instances/context')
]

exports.define = {
  emit: function (type, event, meta, extraMeta) {
    if (event === false) {
      return
    }
    var context = this._context
    var emitter = this.on && this.on[ type ]
    if (emitter) {
      if (event === void 0) {
        event = new Event(this, type)
      }
      this.emitInstances(emitter, event, arguments)
      this.emitContext(emitter, event, arguments)
      this.emitInternal(emitter, type, event, meta, extraMeta, arguments)
      if (!context) {
        this.clearContext()
      }
    }
    this.emitQueue(type, event, context)
    return event
  },
  emitQueue: function (type, event, context) {
    if (event) {
      if (event.type === type &&
        ((event.origin === this) &&
          // jsStandard error: want to use == here
          // can be null or undefined
          (event.context == context)
        ) &&
        !event.block
      ) {
        var queue = event.queue
        var propertyDefinitions = this._properties
        if (
          queue &&
          propertyDefinitions &&
          (!propertyDefinitions.on.base._properties[type] ||
          propertyDefinitions.on.base._properties[type].base.executeQueue !== false
          )
        ) {
          event.loop()
        }
      } else {
        if (event.resolving) {
          if (event.context === event.resolving) {
            event.clear()
          }
        }
      }
    }
  },
  emitInternal: function (emitter, type, event, meta, extraMeta, args) {
    if (meta) {
      if (extraMeta) {
        args = convertToArray(args)
        args.unshift(event)
        args[1] = this
        args[2] = void 0
        emitter.emit.apply(emitter, args)
      } else {
        emitter.emit(event, this, void 0, meta)
      }
    } else {
      // this is so wrong....
      // console.error('-------- do this... -------', this.$path)
      emitter.emit(event, this)
    }
  }
}
