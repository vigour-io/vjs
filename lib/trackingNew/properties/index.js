var Observable = require('../observable')
var trackingEmitter = require('./emitter')

function track (data, event, type, object = data) {
  let listener = this._on[event.type]
  if (listener) {
    if (data === null) { listener.key = event.type = 'remove' }
    let id = typeof type === 'string' ? type : listener.path.join('.')
    trackingEmitter.emit(object, event, this, listener.key, false, id)
  }
}
// track: {
//   val: [ 'click', 'lol'],
//   type: 'pageview',
//   contextual: true // || id or rick
// }

module.exports = new Observable({
  on: {
    data: {
      tracking (data, event) {
        for (let i = 0, length = data.val.length; i < length; i++) {
          this.parent.on(data.val[i], [track, true])
        }
      }
    }
  },
  properties: {
    type: new Observable({
      on: {
        data: {
          tracking (data) {
            //type bitch
          }
        }
      }
    }),
    contextual: new Observable({
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
