'use strict'
var Emitter = require('../../emitter')
var _emit = Emitter.prototype.emit

exports.inject = [
  require('../instances'),
  require('./instances'),
  require('./context')
]

exports.define = {
  getTriggerEvent: function (key) {
    var isProperty = this.get(
      '_properties.on.base._properties.' + key + '.base'
    )
    // should get default childconstructor settings not assume trigger as default
    return (!isProperty || isProperty.triggerEvent)
  },
  emit: function (key, event, meta, ignore) {
    // console.info('emit in obs', !!this._context, this._path)

    return _emit.call(this, event, meta, this, key, ignore)
  },
  emitInternal: function (event, bind, meta, key, trigger, ignore) {
    var context = this._context
    var emitter = this._on && this._on[key]
    if (emitter && !ignore) {
      // console.info('1emitInternal in obs', !!this._context)
      this.emitInstances(emitter, event)
      // console.info('2emitInternal in obs', !!this._context)
      this.emitContext(emitter, event)
      // console.info('3emitInternal in obs', !!this._context)
      // if (!context) {
      emitter.emit(event, meta, this)
      // }
      if (!context) {
        // console.log('-----')
        this.clearContext()
        // console.log('-----')
      }
    }
    return trigger
  }
}
