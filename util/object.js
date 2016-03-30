/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var util = module.exports = exports = require('./')
  , vigour = require('../') //only here to be able to use util without vigour.Object maybe refactor this away?
  , DOT = '.'

/**
 * lookup
 * polyfill if __lookupSetter__ does not exist;
 */
exports.lookup = Object.__lookupSetter__ || function (i) {
  var t = this
    , a
  while (t) {
    a = Object.getOwnPropertyDescriptor(t, i)
    if (a && a.set) return true
    t = Object.getPrototypeOf(t)
  }
  return false
}

/**
 * Used to set a val to an field on a object, whether it is a vigour.Object or a regular object
 * @method set
 * @param {Object} obj   Defines target Object
 * @param {String} field Target field
 * @param {*}      val   Value to set
 * @todo                 Move this function to a different module (e.g. 'convenience' module)
 */
exports.set = function (obj, field, val, vobj, stamp, noupdate) {
  return (vigour.Object && (obj instanceof vigour.Object))
    ? obj.set(field, val, vobj, stamp, noupdate)
    : (obj[field] = val)
}


/**
 * Returns object on the end of a defined path
 * @method path
 * @example
 * // returns obj.a.b.c
 * var obj = { a: { b: { c: 1 }}}
 * V.util.object.path(obj,['a','b','c'])
 * @param  {Object}    obj            Object to search
 * @param  {Array}     path           Array of fields in path
 * @param  {*}         [val]          When defined, val will be set on endpoint of path if not already defined
 * @param  {Boolean}   [overwrite]    If true, val WILL overwrite existing value on endpoint of path when already defined
 * @param  {Function}  [writeHandler] Callback on write
 * @param  {Boolean}   [noupdate]     When true, updates will be skipped on write
 * @param  {Number}    [i = 0]        Starting point for searching through path
 * @return {*}                        Object on the end of a defined path
 */
exports.path = function (obj, path, val, overwrite, writeHandler, vobj, stamp, noupdate, self, uid, i) {
  if (!i) i = 0

  // if(path.length === 0) return obj

  var field = path[i]
    , result
    , c
    , target = (!self && obj && obj.__t === 4) ? obj.from[field] : obj && obj[field]
    , l = i < path.length - 1

    //deze target

  if (l && !(target instanceof Object)) target = void 0

  if ((val !== void 0) && (target === void 0 || (!l && overwrite))) {
    c = true
    exports.set(obj, field, l ? {} : val, l ? false : vobj, stamp, noupdate)
    target = obj[field]
  }

  if (l) {
    result = target
      ? this.path(target, path, val, overwrite, writeHandler, vobj, stamp, noupdate, self, uid, ++i)
      : target
  } else {
    result = (!self && target && target.__t === 4) ? target.from : target;
    if (c && writeHandler) writeHandler(result)
  }
  return result
}

/**
 * Adds path using 'dot-notation'
 * @method dotField
 * @example
 * // returns blur:{d:{a:{s:{}}}}
 * var blur = {};
 * V.util.object.dotField(blur,'d.a.s');
 * @param  {Object} obj   Object where field will be added
 * @param  {String} field String using 'dot-notation'
 * @return {Object}       Returns field
 */
exports.dotField = function (obj, field) {
  if (~field.indexOf(DOT)) {
    var path = field.split(DOT)
      , first = path.shift()
      , val = {}
    this.path(val, path, obj[field])
    delete obj[field]
    obj[first] = val
    field = first
  }
  return field
}

/**
 * Checks if two lists contain identical content
 * @method compareArrays
 * @param  {Array|Object} a Takes any object with .length
 * @param  {Array|Object} b Takes any object with .length
 * @return {Boolean}        True/false
 * @todo                    Maybe change title => compareLists
 */
exports.compareArrays = function(a, b) {
  // console.log('compare',a,b)
  if (a.length !== b.length) return false
  for (var i = b.length - 1; i >= 0; i--) {
    if (a[i] != b[i]) return false
  }
  return true
}

/**
 * Gets object from specified path. When path is a string checks for 'dotnotation'.
 * @method get
 * @example
 * // returns 'foo'
 * var a = {b:{c:'foo'}}
 * V.util.object.get(a,'b.c')
 * @param  {Object}       obj  Defines object or V.Value
 * @param  {String|Array} path Defines field {string} or path {array|'dot-notation'}
 * @return {*}                 obj[path]|nested object/value
 */
exports.get = function (obj, path, self) {
  if (!obj || !path) return
  if (!self && obj.__t === 4 && !obj._filter) obj = obj.from
  if (!(path instanceof Array)) {
    if (~path.indexOf(DOT)) {
      path = path.split(DOT)
    } else {
      return (!self && obj[path] && obj[path].from) || obj[path]
    }
  }
  //self is too far away in the arguments
  return this.path(obj, path, void 0, false, false, false, false, false, self)
}

/**
 * Returns true if an object is an instance of an object and not a function , V.Object or V.Base
 * @method isObj
 * @param  {Object}  obj Object to inspect
 * @return {Boolean}     True/False
 */
exports.isObj = function (obj) {
  return (obj instanceof Object
    && typeof obj !== 'function'
    && (!vigour.Object || !(obj instanceof vigour.Object))
    && (!vigour.Base || !(obj instanceof vigour.Base)))
}

/**
 * Creates new object with the same value , takes custom objects into account (new obj.constructor())
 * @method clone
 * @param  {Object} obj Object to clone
 * @return {Object}     Returns clone
 */
exports.clone = function (obj, exclude, shallow) {
  if (this.isObj(obj)) {
    var copy = new obj.constructor()
    for (var i in obj) {
      if(!exclude || !exclude[i])
        copy[i] = !shallow
          ? this.clone(obj[i], exclude)
          : obj[i]
    }
    return copy
  }
  return obj
};

/**
 * Merges object b into object a and returns object a
 * @method merge
 * @param  {Object} a Object a
 * @param  {Object} b Object b
 * @return {Object}   Object a
 */
exports.merge = function (a, b, norefs, overwrite) {
  for (var i in b) {
    var aisobj = util.isObj(a[i])
      , bisobj = util.isObj(b[i])

    if (aisobj && bisobj) {
      util.merge(a[i], b[i], norefs)
    } else if(!norefs || !bisobj){
      if( overwrite === void 0
       || !(i in a)
       || typeof overwrite === 'function' && overwrite(a[i], b[i])
        ){
        a[i] = b[i]
      }

    }else{
      a[i] = b[i] instanceof Array ? [] : {}
      util.merge(a[i], b[i], norefs, overwrite)
    }
  }
  return a
}

// exports.resolve = function(a, b, bFrom, j) {
//   var same = true;
//   if(b instanceof Object) {
//     for(var i in b) {
//       if(a[i]!==void 0) {
//         if(exports.resolve(a[i],b[i],bFrom ? bFrom[i] : b[i],i)) {
//           if(bFrom) {
//             delete bFrom[i]
//           }
//         } else {
//           same = false
//         }
//       } else {
//         same = false
//       }
//     }
//     if(same) {
//       if(!(bFrom&&j!==void 0)) return true
//       delete bFrom[j]
//     }
//     return same;
//   } else {
//     if(a==b) {
//       if(bFrom&&j!==void 0) {
//         delete bFrom[j]
//       }
//       return true
//     }
//   }
// }

exports.resolve = function(a, b, bFrom, j) {
  // console.log('lolresolve\n',bFrom)
  var same = true;
  if(b instanceof Object) {
    for(var i in b) {
      if(a[i]!==void 0) {
        if(exports.resolve(a[i],b[i],(bFrom!==void 0 && bFrom!==null) ? bFrom[i] : b[i],i)) {
          if(bFrom!==void 0 && bFrom!==null) {
            if(bFrom[i]===null) {
              same = false
            } else {
              delete bFrom[i]
            }
          }
        } else {
          same = false
        }
      } else {
        same = false
      }
    }
    if(same) {
      if(!(bFrom&&j!==void 0)) return true
      delete bFrom[j]
    }
    return same;
  } else {
    if(a==b) {
      if(bFrom&&j!==void 0) {
        delete bFrom[j]
      }
      return true
    }
  }
}

/**
 * Adds value to array if it is not contained in array, executes handler on encountering val in array
 * @method include
 * @param  {Object|Array}   obj       Takes any object with .length
 * @param  {*}              val       Value to add
 * @param  {Function}       [handler] Function to execute on encountering val in array
 * @param  {Boolean}        arr       Include elements of val separately rather than including val itself
 * @return {Boolean}                  True/false
 */
exports.include = function (obj, val, handler, arr) {

  if(arr && val instanceof Array) {
    var ret = false
    for(var i = 0 , len = val.length; i < len; i++) {
      ret = exports.include(obj, val[i], handler)
    }
    return ret
  }

  var i = 0
    , l = obj.length
    , field
    , check

  if (obj.__t === 1) {
    for (;i < l; i++) {
      field = check = obj[i]
      if (check.__t === 4) check = check.from
      if (check === val || check.val === val) {
        if (handler) handler(field)
        return false
      }
    }
    obj.push(val)
    return true
  } else if (obj instanceof Array) {
    for (;i < l; i++) {
      if (obj[i] === val) {
        return false
      }
    }
    obj.push(val)
    return true
  }
}

exports.changeType = function( obj ) {
  var result
  if(obj instanceof Array) {
    result = {}
    for(var i=0,len=obj.length;i<len;i++) {
      result[i]=obj[i]
    }
  } else {
    result = []
    for(var i in obj) {
      result.push(obj[i])
    }
  }
  return result
}

/**
 * Ensures a value is not or contains no V.Objects, only their "raw" versions
 * This needs to be unified with convert, or at least get a better name.
 * @method raw
 * @param  {*}   val   the value to be processed
 * @return {*}         the processed value
 */
exports.raw = function( val, rparams ) {
  if (val instanceof Object) {
    if (val instanceof vigour.Object) {
      return val.raw
    } else {
      var result
      if (val instanceof Array) {
        result = []
        for (var i = 0, l = val.length; i < l; i++) {
          result[i] = this.raw(val[i], rparams)
        }
      } else {
        result = {}
        for (var f in val) {
          result[f] = this.raw(val[f], rparams)
        }
      }
      return result
    }
  } else {
    return val
  }
}

//add level and stops for certain branches
exports.walk = function(obj, fn ) {
  for(var i in obj) {
    if(obj[i] instanceof Object) {
      if(!fn(i, obj[i], obj, true)) {
        if(exports.walk(obj[i], fn)) return true
      } else {
        return true
      }
    } else {
      if(fn(i, obj[i], obj)) {
        return true
      }
    }
  }
}

exports.checkParentFactory = function( parentField ) {
  return function(field, get, links, match) {
    if(get&&get!==true) {
      match = get
      get = false
    }
    var fields = field instanceof vigour.Object ? false : field,
      curr = this,
      found;
    while (curr) {
      found = fields === false ? curr === field : exports.get(curr, fields, !links);
      if (found) {
        if(match) {
          if(match === found || (found instanceof vigour.Object) && found.val === match) {
            return !get && fields ? curr : found;
          }
        } else {
          return !get && fields ? curr : found;
        }
      }
      curr = curr[parentField];
    }
  }
}


