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
            let attach = listener.attach
            for (let i in attach) {
              if (i[0] !== '_' && i !== 'key') {
                let field = attach[i][2][1]
                let lastStamp = obj._lastStamp
                if (!field._stamp || field._stamp !== lastStamp) {
                  // field.setKey('_stamp', lastStamp, event)
                  obs.emit(key, data === false ? data : {
                    origin: obj,
                    data: obj._input || {}
                  }, event)
                }
              }
            }
          }
        }
      }
    } else if (typeof id === 'object') {
      for (let i in listens) {
        if (i[0] !== '_' && i !== 'key') {
          let listener = listens[i]
          if (listener.key === 'data') {
            let obj = listener._parent._parent
            let attach = listener.attach
            for (let i in attach) {
              if (i[0] !== '_' && i !== 'key') {
                let field = attach[i][2][1]
                let lastStamp = obj._lastStamp
                if (!field._stamp || field._stamp !== lastStamp) {
                  // field.setKey('_stamp', lastStamp, event)
                  for (let i = id.length - 1; i >= 0; i--) {
                    let property = this.attach[id[i]]
                    if (property) {
                      property[0].call(obs, data === false ? data : {
                        origin: obj,
                        data: obj._input || {}
                      }, event, property[1])
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      console.warn('this run style is not supported yet, trying something')
      let property = this.attach[id]
      if (property) {
        for (let i in listens) {
          if (i[0] !== '_' && i !== 'key') {
            let listener = listens[i]
            if (listener.key === 'data') {
              let obj = listener._parent._parent
              let attach = listener.attach
              for (let i in attach) {
                if (i[0] !== '_' && i !== 'key') {
                  let field = attach[i][2][1]
                  let lastStamp = obj._lastStamp
                  if (!field._stamp || field._stamp !== lastStamp) {
                    // field.setKey('_stamp', lastStamp, event)
                    property[0].call(obs, data === false ? data : {
                      origin: obj,
                      data: obj._input || {}
                    }, event, property[1])
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
