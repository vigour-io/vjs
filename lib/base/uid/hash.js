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
      let cache = this._hashCache
      if (!this.hasOwnProperty('_hashCache')) {
        cache = this._hashCache = {}
      }
      let compare = ''
      this.eachContext(function (level, cntxt) {
        compare += cntxt.uid
      })
      console.warn(compare)
      let ret = cache[compare] // not enough yet!!!
      if (ret) {
        return ret
      }
      let parent = this
      let str = ''
      while (parent && parent.key) {
        str += parent.key
        parent = parent.parent
      }
      this._hashCache[compare] = hash(str)
      return str
    } else {
      return this.uid
    }
  }
}
// what do we do with the events? need to think of something smart there
// hashes allways habe same lenght so that would be possible
// dont rly want to store all hashes mapped back to things :/ make hash path like this [hash-cntx...][self]
// so we store all paths or something?
// this way you have contexts and it becomes possible to find it
// so make a context path generator!
/*
var contextStore = {
  uid: {
    [node]
    uid: {
      [node]
      uid: {
        [node]
      }
    }
  }
  // yep this is it nothing more nothing less
  // dont need to store nodes different
}
*/
// not enough! -- this cache can also be used ofcourse for other purposes
// also clear it again here very importante
