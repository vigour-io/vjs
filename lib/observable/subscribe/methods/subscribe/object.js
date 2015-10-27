'use strict'
var info = require('./info')
var onAny = require('./on/any')
var onParent = require('./on/parent')
var onProperty = require('./on/property')
var onReference = require('./on/reference')
var getReferenced = require('./util/reference')
var incLateral = info.incLateral

module.exports = function subscribeObject (data, event, obj, pattern, info, mapValue, mapObj) {
  var notComplete
  var patternAny = pattern['*']

  if (!mapValue) {
    mapValue = true
  }

  if (!mapObj) {
    mapObj = {}
  }

  if (patternAny) {
    mapObj.parent = mapValue
    obj.each((property, key) => {
      this.subscribeField(data, event, property, patternAny, key, info, mapObj)
    })

    this.attachListener(obj, 'property', [onAny, this, pattern, info, mapValue, mapObj])
    notComplete = true

    // subscribe to parent and or upward
    // let patternParent = pattern.sub_parent
    // if (patternParent) {
    //   let objParent = obj.parent
    //   if (objParent) {

    //   } else {

    //   }
    // }
  } else {
    let addedListener
    pattern.each((patternProperty, key) => {
      var found
      if (key === 'upward') {
        this.subscribeUpward(data, event, obj, patternProperty, info, mapValue, mapObj)
      } else if (key === '&') {
        // subcribeDeep
      } else if (key === 'sub_parent') {
        let objParent = obj.parent
        if (objParent && objParent._input !== null) {
          mapObj[obj.key] = mapValue
            // NOTE removed the .on check => fix in another way
          found = this.subscribeField(this, data, event, objParent, pattern, key, info, mapObj)
        } else {
          this.attachListener(obj, 'parent', [onParent, this, pattern, info, mapValue, mapObj])
        }
      } else {
        let objProperty = obj[key]
        if (objProperty && objProperty._input !== null) {
          mapObj.parent = mapValue
            // NOTE removed the .on check => fix in another way
          found = this.subscribeField(this, data, event, objProperty, pattern, key, info, mapObj)
        } else if (!addedListener) {
          this.addListener(obj, 'property', [onProperty, this, pattern, info, mapValue, mapObj])
          addedListener = true
        }
      }

      if (!found) {
        notComplete = true
      }
    })
  }

  if (notComplete) {
    this.addListener(obj, 'reference', [onReference, this, pattern, info, mapValue, mapObj])
    let referenced = getReferenced(obj)
    if (referenced) {
      // NOTE decided to always add reference listener, for when ref is added after the subscription
      return this.subscribeObject(data, event, referenced, pattern, incLateral(info), mapValue, mapObj)
    }
  } else {
    return pattern
  }
}
