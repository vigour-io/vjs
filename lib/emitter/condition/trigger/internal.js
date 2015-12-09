'use strict'

function multiple (arr, bind, val, conditionEvent, event, data) {
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
        arr[i].call(bind, val, fn, conditionEvent, data)
      }
    }
  }
  arr[i].call(bind, val, fn, conditionEvent, data)
}

exports.define = {
  triggerInternal (bind, val, conditionEvent, event, data) {
    var arr
    this.each(function (property, key) {
      if (!arr) {
        arr = []
      }
      arr.push(property._input)
    })
    if (!arr) {
      if (this._input) {
        this._input.call(bind, val, (cancel, data) => {
          if (cancel) {
            // cancel needs to be better! imrpove it!
            this.cancel(cancel, event)
          } else {
            conditionEvent.trigger()
          }
          this.inProgress = null
        }, conditionEvent, data)
      }
    } else {
      if (this._input) {
        arr.push(this._input)
      }
      multiple(arr, bind, val, conditionEvent, event, data)
    }
  }
}
