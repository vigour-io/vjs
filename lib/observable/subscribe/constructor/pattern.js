'use strict'
exports.properties = {
  pattern (val, event) {
    var parent = this._parent
    if (parent) {
      let obs = parent._parent
      obs.setKey('pattern')
      obs.pattern.set(val, void 0, void 0, 'sub_')
      this._map = {}
      this.subField(false, event, obs, obs.pattern, 0, true, this._map)
    }
    this._pattern = val
  }
}
