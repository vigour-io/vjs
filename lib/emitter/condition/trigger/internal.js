'use strict'

function multiple (arr, bind, val, conditionEvent, event) {
  var i = 0
  var length = arr.length
  function fn (cancel) {
    i++
    if (cancel) {
      this.cancel(cancel, event)
      this.inProgress = null
    } else {
      if (i === length) {
        conditionEvent.trigger()
        this.inProgress = null
      } else {
        arr[i].call(bind, val, fn, conditionEvent)
      }
    }
  }
  arr[i].call(bind, val, fn, conditionEvent)
}

exports.define = {
  triggerInternal (bind, val, conditionEvent, event) {
    var arr
    // @todo support observables and promises
    // condition : x (obs) has to fire data then it continues
    this.each(function (property, key) {
      if (!arr) {
        arr = []
      }
      arr.push(property._input)
    })
    if (!arr) {
      if (this._input) {
        this._input.call(bind, val, (cancel) => {
          if (cancel) {
            this.cancel(cancel, event)
          } else {
            conditionEvent.trigger()
          }
          this.inProgress = null
        }, conditionEvent)
      }
    } else {
      if (this._input) {
        arr.push(this._input)
      }
      multiple(arr, bind, val, conditionEvent, event)
    }
  }
}
