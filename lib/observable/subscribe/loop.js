'use strict'
var Base = require('../../base')
var encoded = require('./shared').encoded
var onParent = require('./on/parent')
var onProperty = require('./on/property')
var onReference = require('./on/reference')

exports.$define = {
  $loopSubsObject: function (obj, val, event, refLevel, level, meta, prevMap) {
    var addedPropertyListener
    var addedParentListener
    var addedUpwardListener
    var reference
    var property
    var value
    var self
    var map = {}

    for (var key in val) {
      value = val[key]
      if (key === '&') { // deep
      } else { // property
        property = obj[key]
        if (property && property._$input !== null) {
          if (key === '$parent') {
            map[obj.$key] = prevMap
          } else {
            map['$parent'] = prevMap
          }
          this.$subscribeToProperty(property, val, key, event, refLevel, level, meta, map)
        } else {
          if (key === '$parent') { // parent
            obj.on('$addToParent', [onParent, this, refLevel, level, val, prevMap, {}])
            addedParentListener = true
          } else if (key === '$upward') { // up the chain
            addedUpwardListener = this.$subscribeUpward(obj, value, event, refLevel, level, meta, prevMap, {})
          } else if (!addedPropertyListener) {
            if (key === '*') {
              self = this
              obj.each(function (prop, key) {
                val[key] = encoded(refLevel)
                self.$subscribeToProperty(prop, val, key, event, refLevel, level, map)
              })
              obj.on('$property', [onProperty, this, refLevel, level, val, true, map])
            } else {
              map['$parent'] = prevMap
              obj.on('$property', [onProperty, this, refLevel, level, val, void 0, map])
            }
            addedPropertyListener = true
          }
        }
      }
    }
    // if subscriptions have been fulfilled
    if (!addedPropertyListener && !addedParentListener && !addedUpwardListener) {
      return true
    }
    // else check references
    if ((reference = obj._$input) && reference instanceof Base) {
      obj.on('$reference', [onReference, this, ++refLevel, level, val, prevMap])
      this.$loopSubsObject(reference, val, event, refLevel, level, void 0, prevMap)
    }
  }
}
