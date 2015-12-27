'use strict'
var base = require('../base').prototype
// var timestamp = require('monotonic-timestamp')

/**
 * @namespace Event
 * Constructor of Event
 * Events are used to bundle emitters and handle updates correctly
 * @param {base} [origin] origin base of event
 * @param {string} [type] type of event e.g "data"
 */
var cnt = 0
var Event = module.exports = function Event (origin, type, stamp) {
  this.stamp = stamp || (cnt++)
  if (type) {
    this.type = type
  }
}

var event = Event.prototype

// event.uuid = uuid
/**
 * @function define
 * same define as on base
 * @memberOf Event#
 */
Object.defineProperty(event, 'define', {
  value: base.define,
  configurable: true
})

event.define({
  /**
   * @function inject
   * same inject as on base
   * @memberOf Event#
   */
  inject: base.inject,
  on (type, val) {
    return this._on[type](this, val)
  },
  _on: {
    value: {
      close (event, val) {
        var onClose = event._onClose
        if (!onClose) {
          event._onClose = onClose = []
        }
        onClose.push(val)
        return event
      }
    }
  },
  /**
   * @function push
   * push emitters to the event queue
   * @param {emitter} [emitter] push an emitter to the event queue
   * @memberOf Event#
   * @returns {event}
   * @todo define secondary here and not in the loop
   */
  push (emitter, bind, data) {
    // this is where we store context restore paths!
    // and specific targets
    // and data per bind
    let uid = emitter.uid // make this faster emitter allways gets _uid
    if (!this[uid]) {
      this[uid] = {
        val: emitter,
        [bind.uid]: bind
      }
    } else if (!this[uid][bind.uid]) {
      this[uid][bind.uid] = bind
    }
  },
  trigger: require('./trigger.js'),
  /**
   * @function remove
   * clears event, removes props, removes references
   * @memberOf Event#
   */
  remove () { // rename this to close
    var onclose = this._onClose
    if (onclose) {
      let len = onclose.length
      for (let i = 0; i < len; i++) {
        onclose[i](this)
      }
      this._onClose = null
    }
    // this.origin = null
    // this.resolving = null
    // this.inherited = null
    // this.removed = true
  }
})
