'use strict'
// var stamp = 0
var base = require('../base').prototype
var timestamp = require('monotonic-timestamp')
var uuid = require('../util/uuid').val
var cntid = uuid.length
/**
 * @namespace Event
 * Constructor of Event
 * Events are used to bundle emitters and handle updates correctly
 * @param {base} [origin] origin base of event
 * @param {string} [type] type of event e.g "data"
 */
var cnt = 0
var Event = module.exports = function Event (origin, type) {
  // pack this in fewer bytes!

  // string conversion is teribly slow!
  // better to just use 2 32 int and pack it in the last 8 bits or something
  this.stamp = uuid + (cnt++)
  // if events get evaluated by uuid and cnt ? could be a good idea
  // this addition is just too slow! (25%!!!)

  // this.stamp = (cnt++)

  // this has to become unified and has to use source+timestamp (hubs)
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
   * @todo define secondary here and not in the loop
   */
  push: function (emitter) {
    if (
      emitter.queue(this)
    ) {
      var queue = this.queue || (this.queue = [])
      queue.push(emitter)
    }
    return this
  },
  trigger: require('./trigger.js'),
  /**
   * @function remove
   * clears event, removes props, removes references
   * @memberOf Event#
   */
  remove: function () {
    if (this.queue) {
      for (let i = 0, length = this.queue.length; i < length; i++) {
        this.queue[i].clear(this)
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
