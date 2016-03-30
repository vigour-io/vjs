'use strict'
exports.define = {
  run (event) {
    var listens = this.listensOnAttach
    if (listens) {
      listens.each((property, key) => {
        if (property.key === 'data') {
          let obj = property._parent._parent
          property.attach.each((property) => {
            this._parent.parent.emit(this.key, {
              origin: obj
            }, event)
          })
        }
      })
    }
  }
}
