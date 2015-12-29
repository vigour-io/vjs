'use strict'
var emitInstances = require('./instances')
var emitContext = require('./context')

module.exports = function (emitter, bind, event, data) {
  let parent = bind._parent
  let context = bind._context
  if (parent && emitter.emitContexts) {
    emitContext(parent, bind, event, data, emitter, context)
  }
  if (!context) {
    bind._context = null
    if (emitter.emitInstances) {
      emitInstances(bind, emitter, event, data)
    }
    emitter.execInternal(bind, event, data)
  }
}
