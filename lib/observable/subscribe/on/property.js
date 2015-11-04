'use strict'
var getPattern = require('../util/pattern')
var info = require('../info')

var getLateral = info.getLateral
var getDepth = info.getDepth

module.exports = function onProperty (data, event, emitter, pattern, info, mapValue, mapObj, refData) {
  console.error('property!',data)
  if (data) {
    let added = data.added
    if (added) {
      let firstFound
      let i = added.length - 1
      for (; i >= 0; i--) {
        let key = added[i]
        if (pattern[key]) {
          if (!firstFound) {
            pattern = getPattern(this, pattern, info, mapValue)
          }
          mapObj.parent = mapValue
          emitter.subscribeField(refData || data, event, this[key], pattern, key, info, mapObj)
          firstFound = true
        }
      }

      if (firstFound) {
        let context = pattern._context
        if (context && context !== emitter._parent._parent) {
          return
        }
        let cancel = pattern.each((property, key) => {
          if (key !== 'sub_parent' && key !== 'upward') {
            return !isFulfilled(property.val, info)
          }
        })
        if (!cancel) {
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

function isFulfilled (value, info) {
  var typeofValue = typeof value
  if (typeofValue === 'object') {
    return true
  }
  if (typeofValue === 'number') {
    let depth = getDepth(info) + 1
    let lateral = getLateral(info)
    let founddepth = getDepth(value)
    if (founddepth < depth) {
      return true
    }
    if (founddepth === depth) {
      if (getLateral(value) <= lateral) {
        return true
      }
    }
  }
}
