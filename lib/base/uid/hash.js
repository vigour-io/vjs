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
        let parent = this
        let str = ''
        while (parent && parent.key) {
          // exclude top or marker automaticly!!! very important can then be used for syncpath as well
          str += parent.key
          parent = parent._parent
        }
        this._uid = hash(str)
      }
      return this._uid
    }
  },
  getHashedPath () {
    if (this._context) {
      // check for double contexts and shit -- can all be handled on this level
      let cache = this._hashCache
      if (!this.hasOwnProperty('_hashCache')) {
        this._hashCache = cache = {}
      }
      // make multiple contexts thing
      let ret = cache[this._context.uid] // not enough yet!!!
      if (ret) {
        return ret
      }

      let parent = this
      let str = ''
      while (parent && parent.key) {
        str += parent.key
        parent = parent.parent
      }
      this._hashCache[this._context.uid] = ret = hash(str)
      return ret
    } else {
      return this.uid
    }
  }
}
// not enough! -- this cache can also be used ofcourse for other purposes
// also clear it again here very importante
