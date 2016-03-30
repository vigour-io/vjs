/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var Value = require('../../value')
  , frame = new Value(1)
  , util = require('../../util')
  , _on = function() {
    // console.group()
    // console.log('\n\n----RAF----'.magenta.bold)
    exports.rafId = window.requestAnimationFrame(_on)
    frame.val++
    // console.groupEnd()
  }

frame.done = new Value(true)

util.define(frame,
  'addListener', function(val, mark, remove) {
    if (!this._listeners){
      this.done.val = false
      _on()
    }
    Value.prototype.addListener.call(this, val, mark, remove)
  }
, 'removeListener', function(val, mark, remove) {
    var t = this
    Value.prototype.removeListener.call(t, val, mark, remove)
    if (!this._listeners) {
      window.cancelAnimationFrame(exports.rafId)
      this.val = 1
      this.done.val = true
    }
  }
)

module.exports = frame