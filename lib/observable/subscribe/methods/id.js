'use strict'
module.exports = function generateId () {
  return this._patternId ? ++this._patternId : (this._patternId = 1)
}
