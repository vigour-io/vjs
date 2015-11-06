'use strict'
exports.define = {
  generateId () {
    return this._patternId ? ++this._patternId : (this._patternId = 1)
  }
}
