'use strict'
var Base = require('./')
var util = require('../util')

/**
 * @namespace Properties
 * Constructor for property definitions
 */
var Properties = function () {}
var propertiesProto = Properties.prototype

/**
 * @function Properties.default
 * helper for normal sets (property is set immediately on key)
 * @memberOf Properties#
 * @return {Base|undefined} when undefined no change happened
 */
Properties.default = function (val, event, nocontext, key) {
  if (this[key] !== val) {
    this[key] = val
    return this
  }
}

/**
 * @function Properties.createStringProperty
 * helper for sets, property is set on different key
 * @param {string} field set property on field
 * @memberOf Properties#
 */
Properties.createStringProperty = function (field) {
  return function (val, event, nocontext) {
    return Properties.default(val, event, nocontext, field)
  }
}

/**
 * @function Properties.createPropertyConstructor
 * helper for Constructors as properties
 * @memberOf Properties#
 * @param {function} Constructor the constructor to be wrapped
 * @param {string} key key of the property
 * @todo share the propertyConstructor function
 */
Properties.createPropertyConstructor = function (Constructor, key) {
  var proto = Constructor.prototype
  proto._useVal = true
  if (!proto.key) {
    proto.key = key
  }

  function propertyConstructor (val, event, nocontext, key) {
    var property = this[key]
    if (!property) {
      this.addNewProperty(
        key,
        new Constructor(void 0, event, this, key),
        void 0,
        false
      )
      return this[key].set(val, event)
    } else {
      return this.setKeyInternal(key, val, property, event, nocontext)
    }
  }
  propertyConstructor.base = proto
  return propertyConstructor
}

/**
 * @property properties
 * @memberOf Properties#
 * @param {*} val property val to be set
 * @param {event} event event passed on from current set
 */
propertiesProto.properties = function (val, event) {
  if (!util.isPlainObj(val)) {
    throw new Error('properties need to be set with a plain object')
  }
  var properties = this._properties
  if (properties.binds !== this) {
    var DerivedProperties = function () {}
    DerivedProperties.prototype = properties
    this._properties = properties = new DerivedProperties()
    properties.binds = this
  }
  for (var key in val) {
    var property = val[key]
    if (property instanceof Base) {
      property = property.Constructor
    }
    this.propertyTypes(properties, property, key, val, event)
  }
}

/**
 * @property binds
 * binds means the current vObj flags are bound to
 * @memberOf Properties#
 */
propertiesProto.binds = Base

/**
 * @property propertyTypes
 * defines different types of possible property definitions
 * @memberOf Base#
 */
exports.propertyTypes = function (properties, property, key, val, event, nocontext) {
  var type
  if (property.prototype && property.prototype instanceof Base) {
    properties[key] = properties.createPropertyConstructor(property, key)
  } else if ((type = typeof property) === 'function') {
    properties[key] = property
  } else if (type === 'string') {
    properties[key] = Properties.createStringProperty(property)
  } else if (property === true) {
    properties[key] = Properties.default
  } else {
    console.warn('properties - custom objects are not supported yet', property)
  }
}

/**
 * @property _properties
 * Location of Properties objects on base
 * @memberOf Base#
 */
exports._properties = {
  value: new Properties(),
  writable: true
}

/**
 * @property properties
 * getter and setter to modify _properties
 * @memberOf Base#
 */
exports.properties = {
  get: function () {
    return this._properties
  },
  set: function (val) {
    this._properties.properties.call(this, val)
  }
}
