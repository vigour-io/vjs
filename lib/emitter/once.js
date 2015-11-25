'use strict'
var Base = require('../base')
var isPlainObj = require('../util/is/plainobj')
var execattach = require('./trigger/attach')
exports.define = {
  once (val, key, unique, event) {
    var _this = this
    var once
    if (typeof val === 'function') {
      once = function (data, event) {
        _this.off(once)
        val.call(this, data, event)
        return this
      }
    } else if (val instanceof Base) {
      let type = this.key
      once = function (data, event) {
        _this.off(once)
        val.emit(type, data, event)
        return this
      }
    } else if (val instanceof Array) {
      once = function (data, event) {
        _this.off(once)
        // isPlainObj
        // execattach
        console.warn('once attach')
        return this
      }
    } else if (isPlainObj(val)) {
      once = function (data, event) {
        _this.off(once)
        this.set(val)
        return this
      }
    }
    return this.on(once, key, unique, event)
  }
}
