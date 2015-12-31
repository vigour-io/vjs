'use strict'
var uid = 0

/**
 * @property uid
 * injectable for generation of uids -- handy if you want weakmap-like behaviour
 * @memberOf Base#
 * @param {object} val
*/
var hash = require('../util/hash')
exports.define = {
  uid: {
    get: function () {
      if (!this.hasOwnProperty('_uid')) {
        // this is so fucking awesome
        this._uid = hash(this._path.join('.'))
      }
      return this._uid
    }
  }
}
