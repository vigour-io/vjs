"use strict";

var uid = 0

exports.$define = {
  $uid: {
    get: function() {
      if(!this.hasOwnProperty('_$uid')) {
        uid++
        this._$uid = uid
      }
      return this._$uid
    }
  }
}