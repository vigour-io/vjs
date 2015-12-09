'use strict'
var isEmpty = require('../../util/is/empty')

require('colors-browserify')

module.exports = function triggerInternal (event) {
  var binds = this.binds && this.binds[event.stamp]
  this.removeQueue(event)

  console.log(binds, event.stamp)
  if (binds) {
    console.group()
    console.log('exec stamp binds emitter/method'.magenta.bold.inverse, 'stamp:', event.stamp, !!event.condition)
    console.log(Object.keys(binds))
    for (let i in binds) {
      // console.warn('-- binds -->', event.stamp, '---', i, this.path)

      // console.warn('-- binds -->', i, this.path)

      let bound = binds[i]
      let data = bound.data
      let bind = bound.val
      console.log('exec uid:', i)

      if (bound.context) {
        console.log('exec context uid:', i)

        console.log('should be some context in this bitch', bound)
        this.triggerContext(bound, event, data, i)
        // this is the correct place
        // bound.context[0].bind.setContextChain(bound.context)
      }

      if (bind) {
        console.log('exec normal uid:', i, bind, bind.path)

        bind.clearContextUp()
        this.execInternal(bind, event, data)
        // removal is too fast for condition!
      }
      // console.log('ok delete bind!', i)
      delete binds[i]
    }

    if (isEmpty(binds)) {
      delete this.binds[event.stamp]
    }
  }
  console.groupEnd()
}

// need this!
