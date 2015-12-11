'use strict'
var Base = require('../base')
var isPlainObj = require('../util/is/plainobj')
var execattach = require('./trigger/attach')
exports.define = {
  // need to reuse removal of listener when attach or base
  once (val, key, unique, event) {
    var emitter = this
    var once
    if (typeof val === 'function') {
      once = function (data, event) {
        emitter.clearContext() // dont know if this is smart! can be unexpected -- once needs lot of love still...
        emitter.off(once)
        val.call(this, data, event)
        return this
      }
    } else if (val instanceof Base) {
      let type = this.key
      once = function (data, event) {
        emitter.off(once)
        val.emit(type, data, event)
        return this
      }
    } else if (val instanceof Array) {
      once = function (data, event) {
        emitter.off(once)
        execattach(val, this, event, emitter, data)
        return this
      }
    } else if (isPlainObj(val)) {
      once = function (data, event) {
        emitter.off(once)
        this.set(val)
        return this
      }
    }
    return this.on(once, key, unique, event)
  }
}
