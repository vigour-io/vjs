'use strict'
// var getLateral = require('../info').getLateral

// module.exports = function onData (data, event, emitter, pattern, info, mapValue, fireSubscription) {
//   if (data === null) {
//     let subscriber = emitter._parent.parent
//     if (subscriber._input || mapValue.parent) {
//       pattern[this.key].val = true
//       emitter.subscribeField(data, event, subscriber, subscriber.pattern)
//     }
//   }
//   data = {
//     prevValue: data,
//     origin: this
//   }

//   fireSubscription(data, event)
//   // if (getLateral(info) > 0) {
//   //   emitter.emit(data, event, subscriber)
//   // } else {
//   //   emit(data, event, this, mapValue, emitter.key)
//   // }
// }
