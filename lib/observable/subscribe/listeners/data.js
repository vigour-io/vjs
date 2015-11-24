'use strict'
var resolvePattern = require('../resolve')
var createData = require('../createdata')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue) {
    // check if removed
    if (data === null) {
      pattern.val = true
      emitter.findResubscribe(data, event, this, pattern, mapvalue)
    }
    // emit
    data = createData(this, data)
    // uses the map to find the subscriber(s)
    emitter.findEmit(data, event, this, mapvalue)
  },

  reference (data, event, emitter, pattern, current, mapvalue, context) {
    if (data === null) {

      // let test = pattern
      // let p = []
      // while (test) {
      //   if(!test.parent) break
      //   p.push(test.key)
      //   test = test.parent
      // }
      // for (let i = p.length - 1; i >= 0; i--) {
      //   let key = p[i]
      //   console.log('key',key, test)
      //   if (key === 'sub_parent') {
      //     test = test.sub_parent || test.upward || test
      //   } else {
      //     test = test[key]
      //   }
      // }

      // console.log('TEST',test.path)


      let patternContext = pattern._context
      if (patternContext) {
        let instances = patternContext._instances
        let path = []
        while (pattern !== patternContext) {
          path.push(pattern.key)
          pattern = pattern.parent
        }
        for (var i = instances.length - 1; i >= 0; i--) {
          pattern = instances[i]
          for (let i = path.length - 1; i >= 0; i--) {
            let key = path[i]
            if (key === 'sub_parent') {
              pattern = pattern.sub_parent || pattern.upward || pattern
            } else {
              pattern = pattern[key]
            }
          }
          pattern.val = true
        }
      } else {
        pattern.val = true
      }
      emitter.findResubscribe(data, event, context, pattern, mapvalue)
    }
    // emit
    data = createData(this, data)
    // needs some help to find the subscriber(s)
    emitter.findEmit(data, event, context, mapvalue)
  }
}
