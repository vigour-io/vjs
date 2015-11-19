var Observable = require('../../observable')
var trackingEmitter = require('../emitter')
var types = require('./type')

// initialze
function track (data, event, type, object = data) {
  let listener = this._on[event.type]
  if (listener) {
    if (data === null) { listener.key = event.type = 'remove' }
    let id = typeof type === 'string' ? type : listener.path.join('.')
    trackingEmitter.emit(object, event, this, listener.key, false, id)
  }
}

module.exports = new Observable({
  on: {
    data: {
      tracking (data, event) {
        console.log('this',this.properties)
        for (let i in data) {
          this.parent.on(i, [track, data[i]])
          types(data[i])
        }
      }
    }
  },
  properties: {
    // make observable constructer for each one
    // combine different 'methods'
    // one consolidated vObj
    pageview: new Observable({
      defaults (data) {
        console.log('ok')
      }
    }),
    identify: new Observable({
      on: {
        data: {
          tracking (data) {
            //context mofo
          }
        }
      }
    }),
    event: new Observable({
      on: {
        data: {
          tracking (data) {
            //context mofo
          }
        }
      }
    })
  }
})
