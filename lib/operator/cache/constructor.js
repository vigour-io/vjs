'use strict'
// lets make this into an array like object
// fix key moving! (make it special -- think about context)
var Observable = require('../../observable')
var Base = require('../../base')

var cache = new Observable({
  key: '_cache',
  define: {
    set (val, event) {
      var name = 'cache create: ' + this.path.join('.')
      console.time(name)
      let parent = this._parent
      let subscription = parent && parent._childSub

      if (val instanceof Base) {
        val.each((property, key) => {
          if (property._input !== null) {
            this.setKey(key, property, false)
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
      console.timeEnd(name)
    },
    filter (val, event) {
      var name = 'cache filter: ' + this.path.join('.')
      console.time(name)
      this.each(function remove (property, key) {
        var field = val[key]
        if (!field || field._input === null) {
          property.remove(event)
        }
      })
      console.timeEnd(name)
    }
  }
})

module.exports = cache.Constructor

function findit (pattern, obs, map, context, event) {
  if (typeof pattern === 'object') {
    for (var i in pattern) {
      let property = obs[i]
      if (property) {
        findit(i === 'val' ? pattern : pattern[i], property, map, context, event)
      }
    }
  } else {
    bindit(map, obs, context, event)
  }
}

function bindit (map, obs, context, event) {
  if (map === true && obs) {
    context.$origin.set(obs, event)
  } else {
    for (let i in map) {
      bindit(map[i], obs, i === 'val' ? context : context[i], event)
    }
  }
}
