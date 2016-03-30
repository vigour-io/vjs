/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var util = require('../util')
  , vigour = require('../')
  , inject = require('../util/inject')
/**
 * V.Objects are used instead of normal objects in vigour listeners are automatically added and removed
 * type: __t : 1 = array , 2 = object , 3 = has field (can never be an array) , 4 = field ref to other V.Object
 * note you can make an object out of a field or field ref the type will be 3 or 4 though!
 * @constructor
 * @param  {*}      [val]    Value
 * @param  {Object} [parent] Parentobject
 */
var object = module.exports = exports = vigour.Object = function(val, hook, parent) {
  if (parent) this._parent = parent
  if (hook && this._hook) this._hook(val, hook)
  if (val !== void 0) this.val = val
}
object.inject = inject
/**
 * Used to set .val
 * @method _set
 * @param  {*}              val                  [description]
 * @param  {Number}         [stamp = new stamp]  [description]
 * @param  {Object|Boolean} [from]               [description]
 * @param  {Boolean}        [noupdate]           When true, no updates
 * @param  {Boolean}        [add]                When true, this is an add
 */
var _set = function(val, stamp, from, noupdate, add) {

  if(val===null) {
    if (!stamp) stamp = this.stamp()
    this.remove(false, false, false, from, stamp, noupdate)
  }

  if (!this.__t || this.__t < 3 || ( val !== this._val || this._ignoreValue ) ) {

    // console.error(this)

    if (!stamp) stamp = this.stamp()

    var oldval = this._val
      , nestedval
      , noset
      , isSet
      , isArray
      , valIsSet

    if (this._changevobj 
      && ((this.__t < 4 && val instanceof object) 
      || this.__t === 4 && ((!this._mixed||this._mixed===4) || val instanceof Array 
        || (val instanceof Object 
          && (val instanceof object || val.val))))) { //try to make this shorter
         this._changevobj(val, stamp)
         if(this._mixed===4) this._val = null
    }

    if (vigour.Base && (val instanceof vigour.Base)) {
      this.remove(true, true, false, false, stamp)
      this.__t = 5
      this._val = val
    } else if (val instanceof object) {
      if ((this.__t < 3 && !this._mixed) || this.__t === 1) {
        this.remove(true, true, false, void 0, stamp) //check if 2nd param true is absolutely nessecary (else it will be removed)
      }
      this._val = val
      this.__t = 4
      if (this._setvobj) this._setvobj(val)
    } else {

      if (val instanceof Object && typeof val !== 'function') {
        if (val instanceof Array) {
          this._val = void 0
          this.__t = 1
          this.length = val.length
          noset = this.remove(true, true, val, false, stamp)
          for (var i = 0, l = this.length; i < l; i++) {
            if (!this.set(i, val[i], false, stamp, noupdate, true) && noset !== false) {
              noset = true
            } else {
              noset = false
            }
          }
        } else {

          //normal object

          if (val.clear) {
            noset = this.remove(true, true, false, false, stamp)
            delete val.clear
          } else {

            if (this.__t === 1) {
              if (this._mixed !== 1 && this._mixed!==4) {
                this.remove(true, true, false, false, stamp) //ommiting stamp can be a problem
              } else {
                isArray = true
              }
            } else if (!this._merge && (!this._mixed || this.__t === 2)) {
              noset = this.remove(true, true, val, false, stamp)
            }
          }
          if (val.val && util.isObj(val.val)) {
            valIsSet = true
            _set.call(this, new this._class(val.val, false, this), stamp, from, true)
            this._val._contained = true
          } else if (!this._mixed) {
            this._val = void 0 //this messes up property updates!! (youri)
          }

          if (!isArray) this.__t = 2

          for (var j in val) {
            if (!util.checkArray(this._blacklist, j)) {
              if (j === 'val') {
                if(!valIsSet) isSet = _set.call(this, val.val, stamp, from, true)
                nestedval = true;
              } else {
                //do not always ignore updates at this point
                if (!this.set(j, val[j], false, stamp, noupdate, true) && noset !== false) {
                  noset = true
                } else {
                  noset = false //this is the place where set is passed
                }
              }
            }
          }
        }

      } else {
        if ((this.__t < 3 && !this._mixed) || this.__t === 1) {
          this.remove(true, true, false, false, stamp)
          if (this.__t === 1) delete this.length
        }
        if (val === this._val && !this._ignoreValue ) {
          //maybe use stamp for ignoreValue as well?
          if (noset !== false) {
            this.__t = 3
            return false
          }
        } else {
          this._val = val
          this.__t = 3
        }
      }
    }
    if (nestedval) {

      if (this._set && (isSet !== false || noset === false)) {
        this._set(val, stamp, from, false, noupdate, add, oldval)
      }
    } else if (this._set) {
      if (!noset) {
        this._set(val, stamp, from, false, noupdate, add, oldval)
      } else {
        return false;
      }
    }
  } else {
    return false;
  }

},
/**
 * stamp
 * paint the set origin
 * @method
 */
_stamp = 0,
_params = function(params, list) {
  for (var i = list.length - 1, p; i >= 0; i--) {
    if (params && params[list[i]]!==void 0) {
      p = '_' + list[i]
      util.define(this, p, params[list[i]])
    }
  }
}
/**
* Generates unique stamp
* @method stamp
* @return {Number} Returns stamp
*/
exports.stamp = function() {
//if stamp > x reset ?
return _stamp++
}

exports.set = _set

// objectUtils.extend(exports);  
/**
 * Creates a new constructor based on a V.Object
 * Params can be passed
 * Mixed creates mixed types for the new class i.e having a string and properties
 * @method new
 * @param  {Object} params Parametersobject
 * @return {Object}        Returns V.Object
 */


object.new = function(params, constructor) {
  var vObj = function(val, hook, parent) {
      if (parent) this._parent = parent
      if (constructor) constructor.apply(this,arguments)  
      if (hook && this._hook) this._hook(val, hook)
      if (this._onConstruct) this._onConstruct(val, hook)
      if (val !== void 0) this.val = val
      // console.log(constructor)
    },
    proto = vObj.prototype = new this()
  vObj.new = object.new
  vObj.inject = inject //not handeled well yet
  util.define(vObj, '_blacklist', proto._blacklist.concat())
  _params.call(vObj, params, ['mixed', 'merge'])
  util.define(vObj, '_class', vObj)
  return vObj
}

util.define(object,
/**
 * Items in the blacklist skipped in each function
 * @method _blacklist
 */
'_blacklist', ['_', '__', '__t', '_val', 'length', '_name', '_parent', '_contained', '_removed','extensions', '__cachedPath', '_ignoreValue'],
/**
 * Replaces default constructor property ,necessary for classes made with V.Object.new
 * @constructor _class
 */
'_class', object,
/**
 * Stamp is a method of VObject so that it can be extended in subclasses
 * @return {*} a unique identifier for a mutation
 */
'stamp', object.stamp,
/**
 * Used to get .val which returns field values i.e. a string
 * @method _get
 * @return {*} Returns value
 */
'_get', function() {
  var self = this
    , type = self.__t
    , val

  if (type < 3) {
    return self
  } else {
    val = self._val
    return (type !== 4) ? val : val && val._get()
  }
},
/**
 * Used to get .val which returns field values i.e. a string
 * Set creates instances of the _class for nested properties
 * @property
 */
'val', {
  set: _set,
  get: function() {
    return this._get()
  }
},
/**
 * Add a property to a object
 * @method set
 * @param  {String}  name                [description]
 * @param  {*}       val                 [description]
 * @param  {Boolean} [vobj]              [description]
 * @param  {Number}  [stamp = new stamp] [description]
 * @param  {Boolean} [noupdate]          [description]
 * @return {Boolean}                     [description]
 */
'set', function( name, val, vobj, stamp, noupdate, from ) {

  //function( name, val, vobj, stamp, noupdate, from ) 

  // console.log(name, stamp)

  from = from && this
  if (!vobj && (this[name] instanceof object)) {
    if (_set.call(this[name], val, stamp, from, noupdate) === false && stamp) {
      return false
    }
  } else {
    if (vobj) {
      if(this[name]) this[name].remove()
      this[name] = val
      this[name]._name = name
      this[name]._parent = this
      if(!noupdate) val._update(val, stamp || this.stamp(), from, void 0, true)
    } else {
      this[name] = new this._class(void 0, false, this)
      this[name]._name = name
      _set.call(this[name], val, stamp, from, noupdate, true)
    }
    if (this.__t === 1 && this._setArrayItem) {
      this._setArrayItem( this[name], val )
    }
  }
  return true
},
/**
 * Removes a V.Object including all nested fields and values
 * @method remove
 * @param  {Boolean}        [nested]             When true remove nested objects
 * @param  {Boolean}        [bl]                 When true doesn't remove blacklisted items
 * @param  {Boolean}        [not]                [description]
 * @param  {Boolean|Object} [from]               [description]
 * @param  {Number}         [stamp = new stamp]  [description]
 * @param  {Boolean}        [noupdate]           [description]
 * @return {Boolean}                             [description]
 */
 //    this.remove(false, false, false, from, stamp, noupdate)

'remove', function(nested, bl, not, from, stamp, noupdate) { //no update first > (extended in selection.js)
  if (!nested) this._removed = true
  var r, i, oldval
  if (!stamp) stamp = this.stamp()
  // console.log('START',stamp,this._name);
  if (!nested) {
    if (this._parent) {
      this._parent[this._name] = null
      delete this._parent[this._name]
    }
    if (this._val !== void 0) {
      if (this._val instanceof object && this._val._contained) {
        this._val.remove(false, false, false, from || this, stamp, noupdate)
      }
      oldval = this._val
      this._val = null
    }
  }
  for (i in this) {
    if ((!not || !not[i]) && !util.checkArray(this._blacklist, i)) {
      if (this[i] instanceof object) {
        r = false
        // console.log('DELETE',stamp,i,this[i]);
        this[i].remove(false, false, false, from || this, stamp, noupdate)
      }
      this[i] = null
      delete this[i] //delete is pretty nasty for performance
    }
  }
  if (!nested) {
    if (this._remove) {
      //r
      this._remove(from, noupdate ? false : from /*||r*/ , stamp, oldval);
      if (!bl) {
        for (var j in this) {
          if (this[j] !== void 0) {
            if (j !== '_parent' && this[j] instanceof object && this[j]._contained) {
              this[j].remove()
            }
            this[j] = null
            delete this[j]
          }
        }
      }
    }
    this._removed = true
  }
  return r
})


//----this has to be initialized after defining the blacklist property;
exports.listen = require('./listen')
require('./array')
require('./util')