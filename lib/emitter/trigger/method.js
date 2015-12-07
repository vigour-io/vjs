'use strict'

module.exports = function triggerInternal (event) {
  // = this.lastStamp
  var stamp = event.stamp
  // var contextBinds = this.contextBinds && this.contextBinds[stamp]
  var binds = this.binds && this.binds[stamp]

  // if (binds) {
  //   let first = contextBinds.first
  //   let bind
  //   delete contextBinds.first
  //   for (let i in contextBinds) {
  //     bind = this.setContextChain(contextBinds[i])
  //     // var data =
  //     console.error('ok got contextbind right hur')
  //     this.execInternal(bind, event, this.getBind(event, bind) && this.getBind(event, bind).data)
  //   }
  //   first[0].bind.setContextChain(first)
  // }

  if (binds) {
    console.log(this.binds)
    for (let i in binds) {
      let bound = binds[i]
      let data = bound.data
      if (bound.context) {
        execContext.call(this, bound, event, data)
        bound.context[0].bind.setContextChain(bound.context)
      }
    }

    for (let i in binds) {
      let bound = binds[i]
      let data = bound.data
      let bind = bound.val // different name
      if (bind) {
        bind.clearContextUp()
        this.execInternal(bind, event, data)
        delete binds[i]
      }
    }
  }
}

function execContext (bound, event, data) {
  for (let j in bound) {
    // make this better!
    // if first char is not number for example -- compare charcodes
    if (j !== 'data' && j !== 'val' && j !== 'context' && j !== 'chain') {
      console.log('bound!', bound)
      if (bound[j].chain) {
        console.log('@#!!@#!@#', j)
        let bind = this.setContextChain(bound[j].chain)
        this.execInternal(bind, event, data)
        delete bound[j].chain
        // can remove the queue remove when this is nice
      }
      execContext.call(this, bound[j], event, data)
    }
  }
}
