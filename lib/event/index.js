'use strict'

var stamp = 0
var base = require('../base').prototype

/**
 * @namespace Event
 * Constructor of Event
 * Events are used to bundle emitters and handle updates correctly
 * @param {base} [origin] origin base of event
 * @param {string} [type] type of event e.g "data"
 */
var Event = module.exports = function Event (origin, type) {
  this.stamp = ++stamp
  // this has to become unfied and has to use source+timestamp (hubs)
  this.origin = origin
  this.context = origin && origin._context
  if (type) {
    this.type = type
  }
}

var event = Event.prototype

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
  /**
   * @function push
   * push emitters to the event queue
   * @param {emitter} [emitter] push an emitter to the event queue
   * @memberOf Event#
   * @returns {event}
   */
  push: function (emitter) {
    var queue = this.queue || (this.queue = [])
    queue.push(emitter)
    return this
  },
  loop: require('./loop.js'),
  /**
   * @function clear
   * clears event, removes props
   * @memberOf Event#
   */
  clear: function () {
    this.queue = null
    this.origin = null
    this.val = null
    this.resolving = null
    this.inherited = null
    this.executed = true
  }
})

/**
 * @function flavour
 * extended on Event constructor
 * flavour another object with vigour event properties
 * @param {object} val
 * @param {base} [origin] origin base of event
 * @param {string} [type] type of event e.g "data"
 * @memberOf Event#
 * @returns {object} returns the flavoured event
 */
Event.flavour = function (val, origin, type) {
  val.push = event.push
  val.loop = event.loop
  Event.call(val, origin, type)
  return val
}
