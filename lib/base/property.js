'use strict'
var Base = require('./')
var isPlainObj = require('../util/is/plainobj')
var isNumber = require('../util/is/number')

/**
 * @namespace Properties
 * @class
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
 * @function Properties.createPrimitiveProperty
 * helper for sets, property is set on different key
 * @param {string} field set property on field
 * @memberOf Properties#
 */
Properties.createPrimitiveProperty = function (field) {
  return function (val, event, nocontext, key) {
    return Properties.default.call(this, val, event, nocontext, field)
  }
}

/**
 * @function Properties.createPropertyConstructor
 * helper for Constructors as properties
 * @memberOf Properties#
 * @param {function} Constructor the constructor to be wrapped
 * @param {string} key - key of the property
 * @param {string} [override] - override the normal key
 * @todo share the propertyConstructor function
 */

Properties.createPropertyConstructor = function (Constructor, key) {
  var proto = Constructor.prototype

  proto._useVal = true
  if (!proto.key) {
    proto.key = key
  }

  function propertyConstructor (val, event, nocontext) {
    var property = this[key]
    // way more efficient then set key internal apparantly?
    if (!property) {
      // is this the magic trick?
      let instance = new Constructor(void 0, event, this, key)
      this.addNewProperty(
        key,
        instance,
        void 0,
        event
      )
      this[key].set(val, event)
      return this[key]
    }
    return this.setKeyInternal(key, val, property, event, nocontext)
  }
  // same as getPrototypeOf
  propertyConstructor.base = proto
  return propertyConstructor
}

/**
 * @property properties
 * @memberOf Properties#
 * @param {*} val property val to be set
 * @param {event} event event passed on from current set
 */
propertiesProto.properties = function (val, event, nocontext) {
  if (!isPlainObj(val)) {
    throw new Error('properties need to be set with a plain object')
  }
  let properties = this._properties
  if (properties.binds !== this) {
    let DerivedProperties = function () {}
    // maybe use object.create here
    DerivedProperties.prototype = properties
    this._properties = properties = new DerivedProperties()
    properties.binds = this
  }
  for (let key in val) {
    let property = parseProperty(val[key])
    this.propertyTypes(properties, property, key, val, event, nocontext)
  }
}

/**
 * @property binds
 * binds means the current vObj properties are bound to
 * @memberOf Properties#
 */
propertiesProto.binds = Base

/**
 * @property propertyTypes
 * defines different types of possible property definitions
 * @memberOf Base#
 */
exports.propertyTypes = function (properties, property, key, val, event, nocontext) {
  var prototype = property && property.prototype
  if (prototype && prototype instanceof Base || prototype === Base.prototype) {
    properties[key] = Properties.createPropertyConstructor(property, key)
  } else {
    let type = typeof property
    if (type === 'function' || property === null) {
      properties[key] = property
    } else if (type === 'string' || isNumber(property)) {
      properties[key] = Properties.createPrimitiveProperty(property)
    } else if (property === true) {
      properties[key] = Properties.default
    } else if (isPlainObj(property)) {
      custom.call(this, properties, property, key, event)
    } else {
      propertyTypeError(property)
    }
  }
}

function parseProperty (property) {
  if (property instanceof Base) {
    if (property.hasOwnProperty('_Constructor') || property === Base.prototype) {
      property = new property.Constructor().Constructor
    } else {
      property = property.Constructor
    }
  } else if (typeof property === 'function' && property.prototype) {
    if (property.prototype.hasOwnProperty('_Constructor') || property === Base) {
      property = new property().Constructor //eslint-disable-line
    }
  }
  return property
}

// make an easy option to use childconstrucor for val
function custom (properties, property, key, event) {
  if (property.val) {
    property.val = parseProperty(property.val)
    var prototype = property.val.prototype
    if (prototype && prototype instanceof Base) {
      if (property.override) {
        properties._overrides = properties._overrides || {}
        properties._overrides[key] = property.override
        properties[key] = Properties
          .createPropertyConstructor(property.val, property.override)
        properties[key].override = property.override
        properties[property.override] = properties[key]
      } else {
        this[key] = properties[key] = prototype
        prototype._parent = this
      }
    } else {
      if (property.override) {
        properties[key] = Properties.createPrimitiveProperty(property.override)
      } else {
        properties[key] = Properties.default
      }
      properties[key].call(this, property.val, void 0, void 0, key)
    }
  } else if (key !== '_overrides') {
    propertyTypeError(property, key)
  }
}

function propertyTypeError (property, key) {
  throw new Error('base.properties - uncaught property type ' + key + ': "' + property + '"')
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
 * calls _properties.properties when set
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
