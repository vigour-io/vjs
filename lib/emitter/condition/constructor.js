'use strict'
var Base = require('../../base')
var remove = Base.prototype.remove
var Event = require('../../event')

// something like this for the util -- double check
// contexts and instances -- take input into account
// var isIncluded = function (arr, bind, event) {
//   for (var i in arr) {
//     var item = arr[i]
//     var stamp = item.event.$stamp
//     var inherits
//     if (item.bind === bind &&
//       stamp === event.stamp ||
//       (inherits = event.inherits) &&
//       inherits.stamp === stamp
//     ) {
//       return true
//     }
//   }
// }

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
      console.warn('trigger trigger trigger')
      if(!this.inProgress) {
        // store bind x trigger -- for now only one inprogress
        this.inProgress = {}
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
        for(var stamp in this.parent.binds) {
          if(stamp==event.stamp) {
            this.parent.binds[deferEvent.stamp] = this.parent.binds[event.stamp]
            delete this.parent.binds[event.stamp]
          }
        }
        // deferEvent.context = event.context
        // deferEvent.inherits = event
        deferEvent.condition = this

        this.inProgress = deferEvent
        var _this = this
        //obs.output || obs._input
        // var val = this.parseValue()
          // this.__input
        // current bind is hier belangrijk
        // inpv trigger moet dit ding op emit zitten?

        var val = obs.val
        console.log('???', val)
        //here parse value
        console.warn('2 - trigger trigger trigger', this._input)

        this._input.call(obs, val, function done(cancel) {
          console.log('???')

          //instance of
          if (cancel) {
            _this.cancel()
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
    cancel: function ( data ) {
      if (data instanceof Error) {
        //fix this!
        this.parent.parent.parent.emit('error', data)
      }
      console.error('cancel')
    }
  }
}).Constructor
