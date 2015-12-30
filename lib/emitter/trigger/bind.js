'use strict'
var emitInstances = require('./instances')
var emitContext = require('./context')

module.exports = function (emitter, bind, event, data) {
  let parent = bind._parent
  let context = bind._context
  if (parent && emitter.emitContexts) {
    console.log('go!')
    emitContext(parent, bind, event, data, emitter, context)
    // bind.clearContext()
  }
  if (!context) {
    if (emitter.emitInstances) {
      emitInstances(bind, emitter, event, data)
    }
    emitter.execInternal(bind, event, data)
  }
  // bind.clearContextUp()
}
