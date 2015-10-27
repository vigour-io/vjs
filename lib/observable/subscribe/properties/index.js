'use strict'
exports.properties = {
  pattern (val, event) {
    var parent = this._parent
    if (parent) {
      let observable = parent._parent

      observable.set({
        pattern: val
      }, void 0, void 0, 'sub_')

      this.subscribe(void 0, event, observable, observable.pattern)
    }
    this._pattern = val
  }
}
