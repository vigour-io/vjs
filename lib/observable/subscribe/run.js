'use strict'
exports.define = {
  run (event) {
    var listens = this.listensOnAttach
    var obs = this._parent.parent
    var key = this.key
    for (var i in listens) {
      if (i[0] !== '_' && i !== 'key') {
        let listener = listens[i]
        if (listener.key === 'data') {
          let obj = listener._parent._parent
          console.log('listener!')
          obs.emit(key, {
            origin: obj
          }, event)
        }
      }
    }
  }
}
