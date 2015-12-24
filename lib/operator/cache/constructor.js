'use strict'
// lets make this into an array like object
// fix key moving! (make it special -- think about context)
var Observable = require('../../observable')
var Event = require('../../event')
var Base = require('../../base')

var cache = new Observable({
  key: '_cache',
  define: {
    set (val) {
      var event = new Event(this)
      event.isTriggered = true
      this.each(function remove (property, key) {
        var field = val[key]
        if (!field || field._input === null) {
          property.remove(event)
        }
      })

      let parent = this._parent
      let subscription = parent && parent._childSub

      if (val instanceof Base) {
        val.each((property, key) => {
          if (property._input !== null) {
            this.setKey(key, void 0, event)
            let addedProp = this[key]
            if (subscription) {
              for (let i in subscription) {
                let sub = subscription[i]
                let pattern = sub.pattern
                let map = sub.map
                findit(pattern, property, map, addedProp, event)
              }
            }
          }
        })
        val.clearContextUp()
      } else {
        for (let i in val) {
          this.setKey(i, val[i], event)
          // this.parent.clearContextUp()
        }
      }
      event.trigger()
    }
  }
})

module.exports = cache.Constructor

function findit (pattern, obs, map, context, event) {
  if (typeof pattern === 'object') {
    for (var i in pattern) {
      let property = obs[i]
      if (property) {
        let field = i === 'val' ? pattern : pattern[i]
        findit(field, property, map, context, event)
      }
    }
  } else {
    bindit(map, obs, context)
  }
}

function bindit (map, obs, context, event) {
  if (map === true) {
    // context.set(obs, event)
    context.$origin.set(obs, event)
  } else {
    for (let i in map) {
      let value = map[i]
      let property = i === 'val' ? context : context[i]
      if (property) {
        bindit(value, obs, property, event)
      }
    }
  }
}
