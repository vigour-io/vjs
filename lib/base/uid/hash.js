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
    get () {
      if (!this.hasOwnProperty('_uid')) {
        let parent = this
        let str = ''
        while (parent && parent.key) {
          str += parent.key
          parent = parent._parent
        }
        this._uid = hash(str) // hash // will create collisions -- so thats not so good -- make entry points on val?
      }
      return this._uid
    }
  },
  getHashedPath (cache) {
    if (this._context) {
      if (!cache) {
        cache = this.contextMap()
      }
      if (cache.val) {
        return cache.val
      }
      let parent = this
      let str = ''
      while (parent && parent.key) {
        str += parent.key
        let lparent = parent
        let cntx = parent._context
        let level = parent._contextLevel
        parent = parent.parent
        if (lparent._context !== cntx) {
          lparent._context = cntx || null
          lparent._contextLevel = level || null
        }
      }
      cache.val = hash(str)
      return cache.val
    } else {
      return this.uid
    }
  }
}
