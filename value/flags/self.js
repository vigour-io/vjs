/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var flags = module.exports = require('./');

/**
 * self
 * @flag
 */
flags.self = {
  reset: true,
  useVal:true,
  set: function(val, stamp, reset) {
    var current = this.checkParent('_prop.name')
    if (current._base && current._base[val]) {
      current._base[val].addListener(this)
      this._val = function() {
        return this[val] && this[val].val
      }
      if(!this._flag)  this._flag = {}
      this._flag.self = ['self', this._val, val, this]
    }
  }
};
