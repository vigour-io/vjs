'use strict'

exports.define = {
  params: {
    get: function getParams () {
      return this.convert({
        exclude: exclude
      })
    }
  }
}

function exclude (property, key, base) {
  return key[0] === '#' && !base._properties[key]
}
