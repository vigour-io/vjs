'use strict'

exports.define = {
  emitInstances: function (emitter, data, event, key) {
    // !emitter is obviously super slow!
    // some emitter dont work here i geuss...
    if (!emitter || emitter.emitInstances) {
      let instances = this.getInstances()
      if (instances && !this._context) {
        let instance
        let length = instances.length
        for (let i = 0; i < length; i++) {
          instance = instances[i]

          if (key === 'data') {
            //make this efficient -- e.g. special data emitInstances and context?
            console.log('ok im emitting!', key, data, this.path)
            //typeof better determinig
            if (typeof data === 'string') {
              if (instance.hasOwnProperty('_input')) {
                console.warn('block!')
                // return
              }
            }
          }

          instance.emit(key, data, event)
        }
      }
    }
  }
}
