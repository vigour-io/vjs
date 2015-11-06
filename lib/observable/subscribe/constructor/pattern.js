'use strict'
exports.properties = {
  pattern (val, event) {
    var parent = this._parent
    console.log('pattern set')
    if (parent) {
      let obs = parent._parent
      obs.setKey('pattern')
      obs.pattern.set(val, void 0, void 0, 'sub_')
      this.subField(false, event, obs, obs.pattern, 0, true)
    }
    this._pattern = val
  }
}
