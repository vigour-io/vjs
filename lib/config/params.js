'use strict'

exports.define = {
  params: {
    get: function getParams () {
      return this.convert({
        filter: filter
      })
    }
  }
}

function filter (property, key, base) {
  return key[0] !== '#' || !base._properties[key]
}
