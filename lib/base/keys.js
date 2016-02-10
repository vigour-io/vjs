'use strict'
module.exports = function (base) {
  var Base = base.Constructor
  var _addProperty = base.addNewProperty
  var _remove = base.remove
  var _removeUpdateParent = base.removeUpdateParent
  var _contextRemove = base.contextRemove
  var _emitRemove = base.emitRemove
  var isPlain = require('../util/is/plainobj')

  exports.properties = {
    _keylists: { val: [ '_keys' ] }, //will be replaced with the keytypes
    keyTypes (val, event) {
      if (isPlain(val)) {

      } else {
        throw new Error('pass a plain object to keyTypes path: ' + this._path.join('.'))
      }
      // console.log()
    }
  }

  // function isBase (val, key) {
  // }

  exports.define = {
    keysCheck (val, key) {
      return val[key] instanceof Base
    },
    // emitRemove () {},
    // use getter later
    // emitRemove () {
    //   console.log('xxxxx', this.path)
    //   if (this._parent) {
    //     this.parent.clearKeysCache()
    //   }
    //   return _emitRemove.apply(this, arguments)
    // },
    // contextRemove (key) {
    //   console.error('yo context remove! --- MAY NEED TO CLEAR KEYS 100 double check!')
    //   return _contextRemove.apply(this, arguments)
    // },
    removeUpdateParent () {
      if (this._parent) {
        this._parent.clearKeysCache()
      }
      return _removeUpdateParent.apply(this, arguments)
    },
    keys (field = '_keys', check) {
      if (!check) {
        check = this.keysCheck
      }
      var keys = this[field]
      //  || !this.hasOwnProperty(field)
      if (!keys && keys !== false || !this.hasOwnProperty(field)) {
        // fix dit
        // console.log('creation', this.path)
        keys = this[field] = []
        for (let key in this) {
          if (key[0] !== '_' && this[key] !== null && check(this, key)) {
            keys.push(key)
          }
        }
        if (!keys[0]) {
          keys = this[field] = false
        }
      }
      return keys
    },
    remove () {
      if (this.parent) {
        this.parent.clearKeysCache()
      }
      return _remove.apply(this, arguments)
    },
    removeProperty () {
      this.clearKeysCache()
      return
    },
    addNewProperty () {
      var ret = _addProperty.apply(this, arguments)
      this.clearKeysCache()
      return ret
    },
    clearKeysCache () {
      for (var i = 0, len = this._keylists.length; i < len; i++) {
        var keylist = this._keylists[i]
        if (this[keylist] !== void 0) {
          this[keylist] = null
        }
      }
    }
  }
  base.set(exports)
}
