'use strict'
var subscribe = require('../shared').subscribe
var getDepth = require('../info').getDepth
var getLateral = require('../info').getLateral


var findPattern = require('../find')

module.exports = function property(data, event, emitter, pattern, info, mapvalue, map) {
  var added = data && data.added
  var found
  var i

  console.log('hur',mapvalue)

  if (added) {
    for (i = added.length - 1; i >= 0; i--) {
      let key = added[i]
      if (pattern[key]) {
        map.parent = mapvalue

        // TODO this resolves the context
        if(!getLateral(info) && !pattern._context){
          findPattern(this, mapvalue, [])
        }

        subscribe(emitter, data, event, this[key], pattern, key, info, map)
        found = true
      }
    }

    if (found) {
      let context = pattern._context
      if(context && context !== emitter._parent._parent){
        return
      }
      let notFulfilled = pattern.each((property, key) => {
        if (key === 'sub_parent' || key === 'upward') {
          return
        }
        if (!isFulfilled(property.val, info)) {
          console.error('wehooo')
          return true
        }
      })
      if (notFulfilled) {
        return
      }
      let attach = this._on.property.attach
      attach.each(function (prop, key) {
        if (prop[1] === emitter) {
          attach.removeProperty(prop, key)
        }
      })
    }
  }
}

function isFulfilled(value, info) {
  var typeofValue = typeof value
  if (typeofValue === 'object') {
    console.error('object!')
    return true
  }
  if (typeofValue === 'number') {
    let depth = getDepth(info) + 1
    let lateral = getLateral(info)
    let founddepth = getDepth(value)
    console.error('number!',founddepth, depth)
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
