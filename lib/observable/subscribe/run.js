'use strict'
exports.define = {
  // TODO make this shorter
  run (data, event, id) {
    var listens = this.listensOnAttach
    var obs = this._parent.parent
    var key = this.key
    if (!id) {
      for (let i in listens) {
        if (i[0] !== '_' && i !== 'key') {
          let listener = listens[i]
          if (listener.key === 'data') {
            let obj = listener._parent._parent
            obs.emit(key, data === false ? data : {
              origin: obj,
              data: obj._input
            }, event)
          }
        }
      }
    } else if (typeof id === 'object') {
      for (let i in listens) {
        if (i[0] !== '_' && i !== 'key') {
          let listener = listens[i]
          if (listener.key === 'data') {
            let obj = listener._parent._parent
            for (let i = id.length - 1; i >= 0; i--) {
              let property = this.attach[id[i]]
              if (property) {
                property[0].call(obs, data === false ? data : {
                  origin: obj,
                  data: obj._input
                }, event, property[1])
              }
            }
          }
        }
      }
    } else {
      let property = this.attach[id]
      if (property) {
        for (let i in listens) {
          if (i[0] !== '_' && i !== 'key') {
            let listener = listens[i]
            if (listener.key === 'data') {
              let obj = listener._parent._parent
              property[0].call(obs, data === false ? data : {
                origin: obj,
                data: obj._input
              }, event, property[1])
            }
          }
        }
      }
    }
  }
}
