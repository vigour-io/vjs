'use strict'
exports.properties = {
  pattern (val, event) {
    var parent = this._parent
    if (parent) {
      let observable = parent._parent
      observable.setKey('pattern')
      observable.pattern.set(val, void 0, void 0, 'sub_')

      // observable.set({
      //   pattern: val
      // }, void 0, void 0, 'sub_')
      this.subscribePattern(false, event, observable)
    }
    this._pattern = val
  }
}
