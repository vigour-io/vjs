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
  this.origin = origin
  this.context = origin && origin._context
  if (type) {
    this.type = type
  }
}

var event = Event.prototype

event._on = {
  close (event, val, arg) {
    var onClose = event._onClose
    if (!onClose) {
      event._onClose = onClose = []
    }
    onClose.push(val)
    return event
  }
}
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
  on (type, val, arg) {
    return this._on[type](this, val, arg)
  },
  /**
   * @function push
   * push emitters to the event queue
   * @param {emitter} [emitter] push an emitter to the event queue
   * @memberOf Event#
   * @returns {event}
   * @todo define secondary here and not in the loop
   */
  push (emitter) {
    // if (
    //   emitter.queue(this)
    // ) {
    var queue = this.queue || (this.queue = [])
    queue.push(emitter)
    // }
    return this
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
    if (this.queue) {
      let stamp = this.stamp
      let length = this.queue.length
      for (let i = 0; i < length; i++) {
        if (this.queue[i].binds) {
          delete this.queue[i].binds[stamp]
        }
      }
    }
    this.queue = null
    this.origin = null
    this.resolving = null
    this.inherited = null
    this.removed = true
  }
})

/**
 * @function flavour
 * extended on Event constructor
 * flavour another object with vigour event properties
 * @param {object} [val]
 * @param {base} [origin] origin base of event
 * @param {string} [type] type of event e.g "data"
 * @memberOf Event#
 * @returns {object} returns the flavoured event
 * @todo check if this is faster then making new
 * @todo (we are adding 2 refs new should only be one ref)
 */
Event.flavour = function (val, origin, type) {
  val.push = event.push
  val.trigger = event.trigger
  val.remove = event.remove
  Event.call(val, origin, type)
  return val
}
