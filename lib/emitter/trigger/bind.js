'use strict'
var emitInstances = require('./instances')
var emitContext = require('./context')

module.exports = function (emitter, bind, event, data) {
  // console.log('bin it!', bind._path)
  let parent = bind._parent
  let context = bind._context
  if (parent && emitter.emitContexts) {
    // console.log('!')
    emitContext(parent, bind, event, data, emitter, context)
  }
  if (!context) {
    bind.clearContextUp()
    if (emitter.emitInstances) {
      emitInstances(bind, emitter, event, data)
    }
    emitter.execInternal(bind, event, data)
    // restore context obviously nessecary here
  }
}
