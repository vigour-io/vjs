'use strict'
exports.$define = {
  _execEmit: function (property, map, refLevel, event, noinstances) {
    console.log('HAHAHA', refLevel)
    if (refLevel > 1) {
      this._$parent._$parent.emit(this.$key, event)
    } else {
      this._findAndEmit(property, map, event, false, noinstances)
    }
  },
  _findAndEmit: function (property, map, event, key, noinstances) {
    var next = property
    var value
    for (var i in map) {
      console.log('>????', map)
      value = map[i]
      if (value) {
        next = property[i]
        console.log('VALUE', value, next)
        if (next) {
          console.log('?', value, next)
          if (value === true) {
            next.emit(key || (key = this.$key), event)
            map[i] = 1
          } else if (value === 1) {
            if (!noinstances) {
              next.emit(key || (key = this.$key), event)
            }
          } else {
            this._findAndEmit(next, value, event, key, noinstances)
          }
        } else {
          map[i] = null
        }
      }
    }
  }
}
