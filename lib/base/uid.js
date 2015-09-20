"use strict";

var uid = 0

exports.define = {
  uid: {
    get: function() {
      if(!this.hasOwnProperty('_uid')) {
        uid++
        this._uid = uid
      }
      return this._uid
    }
  }
}