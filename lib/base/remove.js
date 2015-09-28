'use strict'
var Base = require('./')

/**
 * @function removeUpdateParent
 * remove base from parent
 * @memberOf Base#
 * @param {base} parent if not defined returns true
 * @param {event} event passedon event
 * @param {base} context checks if context has to be resolved
 * @return {boolean|undefined} if true nothing happened
 */
exports.removeUpdateParent = function (parent, event, context) {
  if (this.key === null) {
    console.warn('key is null in removeUpdateParent')
    return
  }
  if (parent[this.key] === null) {
    console.warn('allready removed from parent', this.key)
    return true
  }
  var key = this.key
  if (context) {
    if (this._context) {
      // remove key whatever on resolved context?
      this.resolveContext(null, event, context)
      // parent[key] = null
    }
  } else {
    // this._parent = null
    parent[key] = null
  }
}

/**
 * @function removeProperty
 * removeProperty from a base
 * @memberOf Base#
 * @param {property} base property to be removed
 * @param {key} key of the property
 * @param {event} event passedon event
 * @param {base} context checks if context has to be resolved
 * @param {nocontext} [boolean] dont resolveContext when true
 * @return {boolean|undefined} if true nothing happened
 * @todo how to get rid of the non-enum stuff?
 * @todo cleanup and make faster
 * @todo system for excludes (e.g. noremovable or something)
 */
exports.removeProperty = function (property, key, event, nocontext) {
  if (key !== 'key') {
    if (this.hasOwnProperty(key)) {
      if (key !== '_parent' && key !== '_context') {
        if (property instanceof Base) {
          if (key !== '_input') {
            // block if everything is allreayd removed?
            if (property._parent === this) {
              // TODO: 10 double check this....
              property.clearContext()
              property.remove(event, nocontext)
            }
          }
        }
      }

      this[key] = null
    } else {
      if (this._context) {
        console.warn('maybe some stuff going wrong with context here in removeprop')
      }

      this[key] = null
    }
  }
}

/**
 * @function removeProperties
 * remove properties from base
 * @memberOf Base#
 * @param {event} event passedon event
 * @param {nocontext} [boolean] dont resolveContext when true
 */
exports.removeProperties = function (event, nocontext) {
  for (var key in this) {
    if (key === '_parent') {
      continue
    } else {
      this.removeProperty(this[key], key, event, nocontext)
    }
  }
  // this.parent = null
  this._input = null
}

/**
 * @function removeInternal
 * remove properties from base
 * @memberOf Base#
 * @param {event} event passedon event
 * @param {nocontext} [boolean] dont resolveContext when true
 * @param {noparent} [boolean] dont remove from parent when true
 * @return {true|undefined} if true no updates happened on parent
 * @todo return a base when a change happened (consistency)
 */
exports.removeInternal = function (event, nocontext, noparent) {
  var parent = this._parent
  if (!noparent && !nocontext && this._context) {
    return this.removeUpdateParent(this.parent, event, this._context)
  } else {
    if (!noparent && parent) {
      this.removeUpdateParent(parent, event)
    }
    this.removeProperties(event, nocontext, noparent)
  }
}

/**
 * @function remove
 * remove a base
 * @memberOf Base#
 * @param {event} event passedon event
 * @param {nocontext} [boolean] dont resolveContext when true
 * @param {noparent} [boolean] dont remove from parent when true
 * @return {true|undefined} if true no updates happened
 * @todo return a base when a change happened (consistency)
 */
exports.remove = function (event, nocontext, noparent) {
  return this.removeInternal(event, nocontext, noparent)
}
