'use strict'
var getDepth = require('../current/get/depth')
var getLevel = require('../current/get/level')
var resolvePattern = require('../resolve')

var keepPropertyListener = require('../keep')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    if (data) {
      let added = data.added
      if (added) {
        let found
        pattern = resolvePattern(this, mapvalue, emitter.key)
        if (pattern) {
          for (let i = added.length - 1; i >= 0; i--) {
            let key = added[i]
            let field = pattern[key]
            if (field) {
              map.parent = mapvalue
              // remove this fix when properties have correct context
              found = true

              emitter.subField(data, event, this[key], field, current, map)
            }
          }
          if (found && this.hasOwnProperty('_on')) {
            let keepListener = pattern.each((property, key) => {
              if (!this[key]) {
                return true
              }
            })
            if (!keepListener) {
              let attach = this._on.property.attach
              attach.each(function (prop, key) {
                if (prop[1] === emitter) {
                  attach.removeProperty(prop, key)
                }
              })
            }
          }
        }
      }
    }
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    if (data) {
      let added = data.added
      if (added) {
        let found
        for (let i = added.length - 1; i >= 0; i--) {
          let key = added[i]
          let field = pattern[key]
          if (field) {
            found = true
            emitter.subFieldRef(data, event, this[key], field, current, mapvalue, map, context)
          }
        }

        if (found && this.hasOwnProperty('_on')) {
          let keepListener = pattern.each((property, key) => {
            if (!this[key]) {
              let value = property._input
              if (!value) {
                return keepPropertyListener(property, current)
              }
              if (value === true) {
                return true
              }
              // unify this with id check in  subField
              let prevDepth = getDepth(value)
              if (prevDepth) {
                let refDepth = getDepth(current)
                if (prevDepth > refDepth) {
                  return true
                } else if (prevDepth === refDepth) {
                  if (getLevel(value) > getLevel(current)) {
                    return true
                  }
                }
              } else if (getLevel(value) > getLevel(current)) {
                return true
              }
            }
          })

          if (!keepListener) {
            let attach = this._on.property.attach
            attach.each(function (prop, key) {
              if (prop[1] === emitter) {
                attach.removeProperty(prop, key)
              }
            })
          }
        }
      }
    }
  }
}
