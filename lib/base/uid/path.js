'use strict'
var hash = require('../../util/hash')
/**
 * @property uid
 * injectable for generation of uids -- handy if you want weakmap-like behaviour
 * @memberOf Base#
 * @param {object} val
*/
exports.define = {
  uid: {
    get: function () {
      if (!this.hasOwnProperty('_uid')) {
        this._uid = hash(this._path.join())
      }
      return this._uid
    }
  }
  // uid: {
  //   get: function () {
  //     if (!this.hasOwnProperty('_uid')) {
  //       this._uid = hash(this._path.join('.'))
  //     }
  //     return this._uid
  //   }
  // }
}
