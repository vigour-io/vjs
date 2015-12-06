'use strict'
exports.define = {
  run (event) {
    var listens = this.listensOnAttach
    for (var i in listens) {
      if (i[0] !== '_' && i !== 'key') {
        let listener = listens[i]
        if (listener.key === 'data') {
          let obj = listener._parent._parent
          this._parent.parent.emit(this.key, {
            origin: obj
          }, event)
        }
      }
    }
  }
}
