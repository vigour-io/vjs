'use strict'
var getLateral = require('../info').getLateral
var emit = require('../emit')

module.exports = function onData (data, event, emitter, pattern, info, mapvalue, context, test) {
  if (data === null) {
    if (context._input || mapvalue.parent) {
      pattern[this.key] = true
      emitter.subscribe(data, event, context, emitter._pattern)
    }
  }
  data = {
    prevValue: data,
    origin: this
  }

  if (getLateral(info) > 0) {
    // if(context._context !== _context){
    //   context.resolveContext({},event,_context)
    // }
    // if(test){
    //   console.log('!!!',test.context, test.map)
    //   emit(data, event, test.context, test.map, emitter.key)
    // }else{
      emitter.emit(data, event, context)
    // }
    // // emitter.emit(data, event, bind, key, ignore)
    // context.emit(emitter.key, data, event)
  } else {
    emit(data, event, this, mapvalue, emitter.key)
  }
}
