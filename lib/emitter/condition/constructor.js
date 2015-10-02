'use strict'
var Base = require('../../base')
var remove = Base.prototype.remove
var Event = require('../../event')

//so condition will become a thing on top of push
//on push
module.exports = new Base({
  key: 'condition',
  properties: {
    inProgress: true,
    cancel: function () {
      console.error('cancel')
      // cancel all
      // cancel one bind
      // this._cancel = val
      // if (this.inProgress) {
      // maak util functie hiervoor
      // }
    }
  },
  define: {
    // bind:function() {
    //   return this.parent.parent.parent
    //   for operators
    // },
    trigger: function (event) {
      if (!this.inProgress) {
        // store bind x trigger -- for now only one inprogress
        // this.inProgress = {}
        var obs = this.parent.parent.parent

        // make a system for this e.g. using a base or something
        var deferEvent
        // if(event.origin === obs && event.type === this.parent.key) {
          // deferEvent = event
        // } else {
        deferEvent = new Event(this.parent)
        // }
        deferEvent.isTriggered = true
        deferEvent.push(this.parent)
        // console.log(this.parent.binds)
        for (var stamp in this.parent.binds) {
          if (stamp==event.stamp) {
            // pure hate
            // what about contet binds...
            this.parent.binds[deferEvent.stamp] = this.parent.binds[event.stamp]
            delete this.parent.binds[event.stamp]
          }
        }
        // deferEvent.context = event.context
        // deferEvent.inherits = event
        deferEvent.condition = this

        this.inProgress = deferEvent
        var _this = this
        // obs.output || obs._input
        // var val = this.parseValue()
          // this.__input
        // current bind is hier belangrijk
        // inpv trigger moet dit ding op emit zitten?

        var val = obs.val
        //here parse value

        this._input.call(obs, val, function done(cancel) {
          //instance of
          if (cancel) {
            _this.cancel(cancel)
          } else {
            // console.error('hey do it!', deferEvent.queue, deferEvent)
            // deferEvent.isTriggered = null
            // deferEvent.isTriggered = null
            // console.log(deferEvent.queue[0].binds)
            deferEvent.trigger()
          }
          _this.inProgress = null
        }, deferEvent)

      } else {
        // option batch -- for now remove inprogress
      }
    },
    remove: function () {
      this.cancel()
      return remove.apply(this, arguments)
    },
    cancel: function (data) {
      if (data instanceof Error) {
        this.parent.parent.parent.emit('error', data)
      }
      this.parent.binds = null
      this.parent.contextsBinds = null
      this.inProgress.clear()
      // this.parent.binds
      // this.contextsBinds
      // get rid of em
    }
  }
}).Constructor
