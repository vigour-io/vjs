'use strict'
var Base = require('./')
var isPlainObj = require('../util/is/plainobj')

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
 * @param  {escape} [boolean] escape reserved fields
 * @return {Base|undefined} if undefined no change happened
 */
exports.set = function (val, event, nocontext, escape) {
  var base = this
  var resolveContext = !nocontext && base._context
  if (isPlainObj(val)) {
    if (resolveContext) {
      base = base.resolveContext(val, event)
    } else {
      let changed
      for (let key in val) {
        if (base._input === null) {
          break
        }
        if (key === 'val') {
          if (base.setValue(val[key], event, resolveContext)) {
            changed = true
          }
        } else {
          if (base.setKey(key, val[key], event, nocontext, escape)) {
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
 * removes context -- for base this just means nulling one property,
 * however observables need to fire remove events for context
 * @param  {[type]} key   [description]
 * @param  {[type]} event
 * @return {[type]}
 */
exports.contextRemove = function (key, event) {
  this[key] = null
  return this
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
exports.setKeyInternal = function (key, val, property, event, nocontext, escape) {

  if (property) {
    if (property._parent !== this) {
      // if (!nocontext && !checkForDifference(property, val)) {
      //   return -- do this later
      // }

      if (val === null) {
        // use this for remove as well?
        return this.contextRemove(key, event)
      } else {
        let Constructor = property.Constructor
        if (escape && !Constructor) {
          if (typeof escape === 'string') {
            key = escape + key
          } else {
            key = 'escaped_' + key
          }
          this.setKeyInternal(key, val, this[key], event, nocontext, escape)
        } else if (Constructor === false) {
          property.set(val, event, void 0, escape)
        } else if (!Constructor) {
          throw new Error('cannot set property "' + key + '", it\'s reserved')
        } else {
          this[key] = new Constructor(void 0, false, this, key, escape)
          this[key].set(val, event, void 0, escape)
          return this[key]
        }
      }
    } else {
      // console.log('meh')
      property.set(val, event, nocontext, escape)
      return
    }
  } else {
    if (val !== null) {
      this.addNewProperty(key, val, property, event, escape)
      return this
    } else {
      return
    }
  }
}

// function checkForDifference (property, val) { this has to happend later
//   if (isPlainObj(val)) {
//     for (let i in val) {
//       // wrong check
//       if ((!property[i] && val[i] !== null) || checkForDifference(property[i], val[i])) {
//         return true
//       }
//     }
//   } else {
//     if (property._input !== val) {
//       return true
//     }
//   }
// }

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
exports.addNewProperty = function (key, val, property, event, escape) {
  // going away
  val = this.getPropertyValue(val, event, this, key, escape)
  this[key] = val
  var parent = this
  while (parent) {
    if (parent.hasOwnProperty('_Constructor')) {
      this.createContextGetter(key)
      parent = null
    } else {
      parent = parent._parent
    }
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
  if (val instanceof Base) {
    if (!val.hasOwnProperty('_parent') || val._parent === parent) {
      val.key = key
      val._parent = parent
      return val
    }
  } else {
    return val
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
exports.getPropertyValue = function (val, event, parent, key, escape) {
  if (val) {
    let useVal = (!val.hasOwnProperty('_parent') || val._parent === parent) && (val._useVal || val.useVal)
    if (useVal) {
      let prop = checkUseVal(useVal, val, event, parent, key)
      if (prop) {
        return prop
      }
    }
  }
  return parent.ChildConstructor
    ? new parent.ChildConstructor(val, event, parent, key, escape)
    : val
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
exports.setKey = function (key, val, event, nocontext, escape) {
  if (escape) {
    if (key === 'parent' || key === 'path' || key === 'properties') {
      if (typeof escape === 'string') {
        key = escape + key
      } else {
        key = 'escaped_' + key
      }
    }
  } else if (this.properties[key]) {
    return this.properties[key].call(this, val, event, nocontext, key, escape)
  }

  return this.setKeyInternal(key, val, this[key], event, nocontext, escape)
}
