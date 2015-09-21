'use strict'
var Base = require('./')
var util = require('../util')
var isPlainObj = util.isPlainObj

/**
 * @function setValueInternal
 * @memberOf Base#
 * @param  {*} val The value that will be set on _input
 * @param {Event} [event] Current event
 * @return {Base} this
 */
exports.setValueInternal = function (val, event) {
  this._input = val
  return this
}

/**
 * @function setValue
 * @memberOf Base#
 * @param {*} val The value that will be set on _input
 * @param {Event} [event] Current event
 * @param {resolveContext} [boolean] tells if context has to be resolved
 * @return {Base|undefined} if undefined no change happened
 */
exports.setValue = function (val, event, resolveContext) {
  if (val === this._input) {
    // no change dont do anything
    return
  }
  if (val === null) {
    this.remove(event)
    return this
  }
  if (resolveContext) {
    return this.resolveContext(val, event)
  } else {
    return this.setValueInternal(val, event)
  }
}

/**
 * @function set
 * @memberOf Base#
 * @param  {*} val The value that will be set on Base
 * @param  {Event} [event]
 *   when false events are not executed
 * @param  {nocontext} [boolean] dont resolveContext when true
 * @return {Base|undefined} if undefined no change happened
 */
exports.set = function (val, event, nocontext) {
  var base = this
  var resolveContext = !nocontext && base._context
  if (isPlainObj(val)) {
    if (resolveContext) {
      base = base.resolveContext(val, event)
    } else {
      var changed
      for (var key in val) {
        if (base._input === null) {
          break
        }
        if (key === 'val') {
          if (base.setValue(val[key], event, resolveContext)) {
            changed = true
          }
        } else {
          if (base.setKey(key, val[key], event, nocontext)) {
            changed = true
          }
        }
      }
      if (!changed) {
        return
      }
    }
  } else {
    base = base.setValue(val, event, resolveContext)
  }
  return base
}

/**
 * @function setKeyInternal
 * @memberOf Base#
 * @todo find a better name
 * @param  {String} key Key to be set on base
 * @param  {*} [val]
 *   The value that will be set on base[key]
 *   uses .set internaly
 *   checks for ._useVal|.useVal on val to overwrite default behaviour
 * @param  {Base} [property]
 *   property if base[key] is already defined
 * @param  {Event} [event]
 *   adds emiters to event if event is defined
 *   when false event emiters are not added
 * @param {nocontext} [boolean] dont resolveContext when true
 * @todo double check if a property set returning undefined is ok
 * @return {Base|undefined} this, if undefined no relevant change happened
 */
exports.setKeyInternal = function (key, val, property, event, nocontext) {
  if (property) {
    if (property._parent !== this) {
      if (val === null) {
        this[key] = null
        return this
      } else {
        var Constructor = property.Constructor
        if (!Constructor) {
          throw new Error('cannot set property "' + key + '", it\'s reserved')
        } else {
          this[key] = new Constructor(void 0, false, this, key)
          this[key].set(val, event)
          return this[key]
        }
      }
    } else {
      property.set(val, event, nocontext)
      return
    // double check if not returning anything is the best choice
    }
  } else {
    if (val !== null) {
      this.addNewProperty(key, val, property, event)
      return this
    } else {
      return
    }
  }
}

/**
 * @function addNewProperty
 * @memberOf Base#
 * @param {String} key Key to be set on new property
 * @param {*} val The value that will be set on _input
 * @param {Event} [event] Current event
 * @param {property} [base] Property to be set
 * @todo requires perf optmizations
 * @return {Base} this
 */
exports.addNewProperty = function (key, val, property, event) {
  this[key] = this.getPropertyValue(val, event, this, key)
  if (this.hasOwnProperty('_Constructor')) {
    this.createContextGetter(key)
  }
}

/**
 * @function checkUseVal
 * checks the useVal of a property
 * useVal will override default behaviour and use the value directly as property
 * @memberOf Base#
 * @return {*} returns useval property
 */
function checkUseVal (useVal, val, event, parent, key) {
  val = useVal === true ? val : useVal
  if (!parent.strictType || parent.strictType(val)) {
    if (val instanceof Base) {
      if (!val._parent || val._parent === parent) {
        val.key = key
        val._parent = parent
        return val
      }
    } else {
      return val
    }
  }
}

/**
 * @function getPropertyValue
 * checks if property thats being set has a useVal or UseConstructor
 * else creates a new instance of ChildConstructor
 * useVal will override default behaviour and use the value directly as property
 * @memberOf Base#
 * @return {Base} returns new instance of property Constructor
 */
exports.getPropertyValue = function (val, event, parent, key) {
  if (val) {
    var useVal
    if ((useVal = val._useVal) || val.useVal) {
      return checkUseVal(useVal, val, event, parent, key)
    } else if (val.UseConstructor) {
      return new val.UseConstructor(val, event, parent, key)
    }
  }
  return new parent.ChildConstructor(val, event, parent, key)
}

/**
 * @function setKey
 * @memberOf Base#
 * Uses setKeyInternal or flag[key]
 * @param  {String} key
 *   Key set on base using setKeyInternal
 *   Checks if a match is found on Base.flags
 * @param  {*} [val]
 *   The value that will be set on base[key]
 * @param  {Event} [event] Current event
 * @param  {nocontext} [boolean] dont resolveContext when true
 * @return {Base|undefined} if undefined no change happened
 */
exports.setKey = function (key, val, event, nocontext) {
  if (this.properties[key]) {
    return this.properties[key].call(this, val, event, nocontext, key)
  } else {
    return this.setKeyInternal(key, val, this[key], event, nocontext)
  }
}
