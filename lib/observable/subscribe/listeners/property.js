'use strict'
var resolvePattern = require('../resolve')

var getDepth = require('../current/get/depth')
var getLevel = require('../current/get/level')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    if (data) {
      let added = data.added
      if (added) {
        let found
        for (let i = added.length - 1; i >= 0; i--) {
          let key = added[i]
          let field = pattern[key]
          if (field) {
            if (!found) {
              // resolvePattern(this, mapvalue)
              found = true
            }
            map.parent = mapvalue
            emitter.subField(data, event, this[key], field, current, map)
          }
        }
        if (found && this.hasOwnProperty('_on')) {
          let keepListener = pattern.each((property, key) => {
            if (!this[key]) return true
          })
          if (!keepListener) {
            let attach = this._on.property.attach
            attach.each(function (prop, key) {
              if (prop[1] === emitter) attach.removeProperty(prop, key)
            })
          }
        }
      }
    }
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    if (data) {
      console.log('fire!')
      let added = data.added
      if (added) {
        let found
        for (let i = added.length - 1; i >= 0; i--) {
          let key = added[i]
          let field = pattern[key]
          if (field) {
            console.log('go time', key)
            emitter.subFieldRef(data, event, this[key], field, current, mapvalue, map, context)
            found = true
          }
        }

        if (found && this.hasOwnProperty('_on')) {
          let keepListener = pattern.each((property, key) => {
            if (!this[key]) {
              let value = property.val
              if (typeof value === 'object') {
                return keepPropertyListener(value, current)
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
              if (prop[1] === emitter) attach.removeProperty(prop, key)
            })
          }
        }
      }
    }
  }
}

// TODO unify this with keepRefListener
function keepPropertyListener (pattern, refinfo) {
  return pattern.each(function (property, key) {
    let value = property.val
    if (typeof value === 'object') {
      return keepPropertyListener(value, refinfo)
    }
    if (value === true) {
      return true
    }

    // TODO unify this with id check in  subField
    let prevDepth = getDepth(value)
    if (prevDepth) {
      let refDepth = getDepth(refinfo)
      if (prevDepth > refDepth) {
        return true
      } else if (prevDepth === refDepth) {
        if (getLevel(value) > getLevel(refinfo)) {
          return true
        }
      }
    } else if (getLevel(value) > getLevel(refinfo)) {
      return true
    }
  })
}
