/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var util = require('../util'),
  VObject = require('./'),
  V = require('../')
  _c = util.checkArray

/**
 * Gets/sets VObject origin
 * In a chain of V.Objects e.g. x.val = y, y.val = z ---> x.from returns z;
 * @method from
 * @param  {Object} obj [description]
 * @return {Object}     [description]
 */
var _coreSet = VObject.set,
  _from = this.from = function(obj) {
    var val = obj,
      last;
    while (val instanceof VObject) {
      last = val;
      val = val._val;
    }
    return last !== obj ? last : false;
  },
  _lastLFrom = function(obj) {
    while (obj && obj.__t === 4) {
      if (obj._lfrom) {
        return obj._lfrom;
      } else {
        obj = obj._val;
      }
    }
  },
  /**
   * Returns path
   * @method _updatePath
   * @param  {Object}    till [description]
   * @return {Object}         Returns path
   */
  _updatePath = function(till, start) {
    var parent = this,
      lfrom,
      path = []; //reduce amount of new arrays
    while (parent && (parent._name !== void 0 || start)) {
      lfrom = parent._lfrom || _lastLFrom(parent)
      if (lfrom) {
        var a = _updatePath.call(lfrom),
          c = parent.from._name;
        util.add(a, path);
        path = a;
        if (c) {
          c = a.indexOf(c);
          a.splice(c, a.length - c);
        }
      }
      if (parent !== till) {
        path.push(parent._name);
        parent = parent._parent;
      } else {
        parent = false;
      }
    }

    // console.log('----->',path)

    return till ? path.reverse() : path;
  }

util.define(VObject,
  /**
   * Removes all linked containers, uses slice on arrays
   * Removes all _listeners
   * @method destroy
   */
  'destroy', function(nested, bl, not, from, stamp, noupdate) {
    if(!stamp)
      stamp = this.stamp()

    this._removed = true
    this.destroyReferences(nested, bl, not, from, stamp, noupdate)
    this.remove(nested, bl, not, from, stamp, noupdate)
  },
  'destroyReferences', function(nested, bl, not, from, stamp, noupdate) {
    if(!stamp)
      stamp = this.stamp()

    var _l = this._listeners
      , parent
      // , item
    if (_l) {
      for (var i = _l.length, ref; ref = _l[--i];) {
        // if(listener instanceof Array){
        //   if(listener)
        // }
        // ref =  instanceof Array ? _l[i][1] : _l[i];
        if (ref instanceof VObject) {
          parent = ref._parent;
          if (parent && parent.__t === 1) {
            parent.splice(ref._name, 1);
          } else {
            ref.remove(nested, bl, not, from, stamp, noupdate);
          }
        }
      }
    }
  },
  /**
   * Performs passed function on each item.
   * Skips items in the blacklist.
   * @method
   * @param  {Function}  fn   function to perform on each
   * @param  {Boolean}   deep If true, repeats eachmethod on nested fields
   * @param  {Arguments} arg  Arguments to pass to the function
   * @return {Boolean}        [description]
   */
  'each', function(fn, deep, arg) {
    //try to make this a lot shorter
    var i, item;
    if (arg !== void 0) {
      arg = util.arg(arguments, 2);
      for (i in this) {
        if (!_c(this._blacklist, i)) {
          item = this[i];
          if (fn.apply(item, arg)) {
            return true;
          }
          if (deep && (item.__t !== 4 || item._contained)) {
            if (item.each.apply(item, arg)) {
              return true;
            }
          }
        }
      }
    } else {
      for (i in this) {
        if (!_c(this._blacklist, i)) {
          item = this[i];
          if (fn.call(item, i)) {
            return true;
          }
          if (deep && (item.__t !== 4 || item._contained)) {
            if (item.each(fn, deep, arg)) {
              return true;
            }
          }
        }
      }
    }
  },
  /**
   * Returns the real path
   * @attribute _path
   */
    '_path', {
      get: function() {
        var parent = this
          , path = []

        while (parent && parent._name !== void 0) {
          path.push(parent._name);
          parent = parent._parent;
        }

        return path.reverse();
      }
    },
    '_cachedPath', {
      get: function() {
        return this.__cachedPath || (this.__cachedPath = this._path.join('.'))
      }
    },
  /**
   * Returns the update path
   * @attribute updatePath
   */
  'updatePath', {
    get: function() {
      var a = _updatePath.call(this, this, true),
        name = this._name;
      name !== void 0 && a.unshift(name);
      return a;
    }
  },
  /**
   * Returns the keys of an object
   * @attribute keys
   */
  'keys', {
    get: function() {
      var i, arr = [];
      for (i in this) {
        if (!_c(this._blacklist, i)) {
          arr.push(i);
        }
      }
      return arr;
    }
  },
  /**
   * Returns true if object is Ancestor
   * also return true when object is object to be compared to
   * @attribute keys
   */
  //t._d === from._parent || t._d === from
  '_ancestor', function(obj) {
    // console.log('ANCESTOR'.red.inverse, obj, this)
    var p = this
    while (p) {
      if (obj === p) return true
      p = p._parent
    }
  },
  /**
   * Get a field at first occurence in the parent chain
   * @method checkParent
   * @param  {String}  field [description]
   * @param  {Boolean} get   When true returns found instead of current
   * @return {Object}        [description]
   */
  'checkParent', util.checkParentFactory('_parent'),
  /**
   * Returns a normal object, and keeps links to V.Objects
   * @method
   * @param  {*}      [val] [description]
   * @return {Object}       [description]
   */
  'convert', function(val) {
    var obj = {}, l = 0
    if (!val || val.val) obj.val = this._val
    if (this.__t === 1) {
      obj = []
      for (var i = 0; i < this.length; i++) {
        l++
        obj[i] = this[i].convert()
      }
    } else {
      this.each(function(i) {
        if (!val || val[i]!==void 0) {
          l++
          obj[i] = this.convert()
        }
      })
    }
    if (val) {
      for (var i in val) {
        if (obj[i] === void 0) obj[i] = void 0
        l++
      }
    }
    if (!l && (!val || val.val)) obj = obj.val
    return obj
  },
  /**
   * Returns a normal object
   * @attribute raw
   */
  'raw', {
    get: function() {
      var self = this,
        type = self._filter ? 2 : self.__t,
        obj, i, l;
      if (type === 4) {
        return self._val && self._val.raw;
      } else if (type === 3) {
        return self.val; //when the type is mixed always uses val
      } else {
        if (type === 1) {
          obj = [];
          for (i = -1, l = self.length - 1; i < l; self[++i] && obj.push(self[i].raw));
        } else {
          obj = {};
          for (i in self) {
            if (!_c(self._blacklist, i) && self[i]) {
              obj[i] = self[i].raw;
            }
          }
        }
        return obj;
      }
    }
  },
  /**
   * Gets/sets object origin
   * In a chain of V.Objects e.g. x.val = y, y.val = z ---> x.from returns z;
   * @attribute from
   */
  'from', {
    set: function(val) {
      var found = _from(this)
      _coreSet.call(found || this, val)
    },
    get: function() {
      return _from(this) || this
    }
  },
  /**
   * Merge any object into another object
   * Shallow for a shallow merge
   * @method merge
   * @param  {Object}  obj      [description]
   * @param  {Boolean} shallow  [description]
   * @param  {Number}  stamp    [description]
   * @param  {Boolean} noupdate [description]
   * @return {Object}           [description]
   */
  'merge', function merge( obj, shallow, stamp, noupdate, block, sorted, deferUpdates ) {

    // console.log('MERGE---->', obj )

    var mergeArray = this._mergeArray
      , r
      , i
      , stop
      , rt
      , cobj
      , tobj
      , topLevel

    if(!deferUpdates) {
      // console.log('NO deferUpdates'.yellow.inverse)
      topLevel = true
      deferUpdates = []
    }
    //FIXME: make it better long names etc, code formatting

    if ( !stamp ) stamp = this.stamp()

    if ( this.__t === 1 ) {
      if (mergeArray) {
        mergeArray( obj, stamp, noupdate ) //hier moet ook ff deferUpdates
      } else {
        for (var j in obj) {
          cobj = obj[j]
          tobj = this[j]
          if ((j = Number(j)) > -1) {
            r = true
            if (tobj) {
              tobj.merge(cobj, false, stamp, true, block, sorted, deferUpdates )
            } else {
              if (j > this.length - 1) this.length = j + 1
              this.set(j, cobj, false, stamp, true, true)
            }
          }
        }
      }
    } else {
      for (i in obj) {
        stop = true
        cobj = obj[i]
        tobj = this[i]
        if (i !== 'val' && !_c(this._blacklist, i)) {
          if (!shallow && tobj && util.isObj(cobj)) { //cobj instanceof Object && (typeof cobj !== 'function') && cobj.__t !== 3)
            if (cobj.clear) {
              _coreSet.call(tobj, cobj, stamp, false, true)
              r = true
            } else {

              // console.error('---- merge /w update thats mos def wrong!', i, deferUpdates)
              //deferUpdates

              rt = tobj.merge(cobj, false, stamp, true, block, sorted, deferUpdates )
              if (r !== true) r = rt

              if (!rt) 
              {
                // console.log('0000')
                obj[i] = void 0
              }
            }
          } else {

            if (tobj && tobj._val === cobj) { //changed to differentiate between 0 and false, now also differentiates between 1 and '1'
                // console.log('---- 2 update thats mos def wrong!', i)

              if (r !== true) r = false
              // console.log('???????')
              obj[i] = void 0
            } else {
              // console.log('---- 3 update thats mos def wrong!', i)
              if(cobj===null && this[i]) {
                this[i].remove( false, false, false, void 0, stamp )
              } else {
                // console.log('!?'.bold, i, this[i])
                //name, val, vobj, stamp, noupdate, from
                this.set( i, cobj, false, stamp, true )
                // console.log('!xxxx?', i)
                if(this[i] && this[i]._listeners) {
                  // console.log('push push'.green,  JSON.stringify(obj) )
                  deferUpdates.push( [this[i], cobj] )
                }
                //add dit naar list
              }
              if (!r) r = rt;

              // console.warn(r, rt)

              if (!rt) 
              {
                //TODO: TEMP FIX DONT KNOW IF THIS WORKS!
                // console.log('???????22222')
                // obj[i] = void 0
                // console.warn('cant be right!')
                //SUPER CAREFULL WITH THIS R THING!!!!!
                r = true
              }
            }
          }
        }
      }
      if (obj.val) {
        rt = _coreSet.call(this, obj.val, stamp, false, true)
        if (!r) {
          r = rt
        }
        if (!rt) {
          obj.val = void 0
        }
      } else if (!stop) {
        if (!r) {
          r = false;
        }
      }
      r = (r !== false) || r
    }

    if (r) {
      if (!block) {
        // alert(noupdate)
        if (noupdate) {

          // console.log('!!??????????? NOUPDATE'.blue, JSON.stringify(obj))

          if(topLevel) {
            // console.log('UPDATE>?'.magenta.inverse, obj, JSON.stringify( obj ), noupdate, stamp)
            this._update(obj, stamp)
          }
          else {
            this.__update(obj, stamp)
            deferUpdates.push([ this, obj ])
          }
        } else {
          
          // console.log('2UPDATE>?'.cyan.inverse, topLevel, deferUpdates, obj, noupdate, stamp)

          this._update( obj, stamp )
        }
      }
    }
   

    if(topLevel && deferUpdates) {
      // console.log( 'defered updace', topLevel, deferUpdates)
      for(var df in deferUpdates) {
        if( deferUpdates[df][0] && deferUpdates[df][0].__update ) {
          // console.log('DEFERED!!!!'.cyan.inverse, df, deferUpdates[df][1], stamp )
          deferUpdates[df][0].__update( deferUpdates[df][1], stamp )
        }
      }
    }
    return r
  },
  /**
   * Copies an object and returns a new one, can also pass a merge object
   * @method
   * @param  {Object}        obj       Object to copy
   * @param  {Boolean}       [shallow] [description]
   * @param  {Array|Object}  [list]    Takes any object with .length
   * @param  {Object}        [parent]  [description]
   * @return {Object}                  [description]
   */
  'clone', function(obj, shallow, list, parent) { //support shallow!; check obj copy only what is nessecary added makeshort , made parent shorter
    var copy = new this._class(),
      _val = this._val,
      i;
    if (parent) {
      copy._parent = parent;
    }
    copy.__t = this.__t;
    if (this.__t === 1) {
      copy.length = this.length;
    }
    if (list) {
      //list
      for (var j = list.length - 1, item; j >= 0; j--) {
        item = list[j];

        if (item instanceof Array && this[item[0]]) {
          if(item[1] === true) {
            copy[item[0]] = util.clone(this[item[0]], false, true)
          } else {
            copy[item[0]] = item[1];
          }
        } else if (this[item]) {
          // console.log(item)
          copy[item] = this[item];
        }
      }
    }
    if (_val && (_val instanceof VObject && _val._contained)) {
      copy.val = _val.clone(copy, false, list, copy);
      copy._val._contained = true;
    } else {
      VObject.set.call(copy, _val, false, false, true);
    }
    for (i in this) {
      if (!_c(this._blacklist, i)) {
        // console.log(i)
        if (!shallow) {
          if (this[i] instanceof VObject) {
            //function( name, val, vobj, stamp, noupdate, from )

            // console.log('----->1', i, this[i].clone(void 0, false, list, copy))
            //stamp void 0
            copy.set(i, this[i].clone(void 0, false, list, copy), true, false, true)
          } else {

            // console.log('----->2', i, util.clone(this[i]))

            copy[i] = util.clone(this[i]);
          }
        } else {
          //function( name, val, vobj, stamp, noupdate, from )
          copy.set(i, this[i], false, false, true);
        }
      }
    }
    if (obj !== void 0) {
      if (util.isObj(obj)) {
        // console.log('MERGE----->', obj, shallow)
        copy.merge(obj, shallow);
      } else {
        VObject.set.call(copy, obj, false, false, true)
      }
    }
    copy.__t = this.__t;
    return copy;
  },
  /**
   * Returns object on the end of a defined path
   * @method path
   * @param  {Array}     path           Array of fields in path
   * @param  {*}         [val]          When defined, val will be set on endpoint of path if not already defined
   * @param  {Boolean}   [overwrite]    If true, val WILL overwrite existing value on endpoint of path when already defined
   * @param  {Function}  [writeHandler] Callback on write
   * @return {*}                        Object on the end of a defined path
   */
  'path', function(path, val, overwrite, writeHandler, vobj, stamp, noupdate, self) {
    if(!(path instanceof Array)) path = path.split('.');
    return util.path(this, path, val, overwrite, writeHandler, vobj, stamp, noupdate, self);
  },
  /**
   * Gets object from specified path. When path is a string checks for 'dotnotation'.
   * @method get
   * @param  {String|Array} path Defines field {string} or path {array|'dot-notation'}
   * @return {*}                 obj[path]|nested object/value
   */
  'get', function(path, self) { //get does not need an array as path
    return util.get(this, path, self);
  },
  /**
   * Check if obj is empty exclude field names passed to list
   * @method empty
   * @return {Boolean} True/false
   */
  'empty', {
    get: function() {
      return util.empty(this, this._blacklist);
    }
  },
  /**
   * Returns the V.Object from which the current update originated.
   * @method _updateOrigin
   * @return {V.Object} origin of the update
   */
  '_updateOrigin', {
    get: function() {
      var mark = this;
      while (mark._lfrom) {
        mark = mark._lfrom;
      }
      return mark;
    }
  },
  '_origin', {
    get: function() {
      var mark = this;
      while (mark && mark.__t === 4) {
        mark = mark._val;
      }
      return mark;
    }
  },
   'on', function( val, method, mark ) {
        /**
          * val can be a condition or a comparison or a method
        **/
        if( method instanceof V.Base ) 
        {
          mark = method //make exception for values!
          method = null
        }

        if( !method ) 
        {
          _addListener( this, val, mark )
        }
        else 
        {
          if( util.isObj( val ) )
          {
            console.warn('this will become a condition later on for now its not supported!, conditions will be used eveyrwhere')
            //Has to become a condition
          }
          else if( typeof val === 'function' )
          {
            _addListener( this, function( nval ) {
              if( val.apply( this, arguments ) ) //more checks
              {
                method.apply( this, arguments )
              }
            }, mark)
          }
          else 
          {

            if( util.isObj( method ) )
            {

              mark = val

              console.warn('untested -- add as mark')
              _addListener( this, function( nval, stamp, from, remove, added, oldval ) {
                if( remove ) //more checks
                {
                  method.apply( this, arguments )
                }
              }, mark)


            }
            else if( val === 'remove' )
            {
              //val, stamp, false, remove, added, oldval
              _addListener( this, function( nval, stamp, from, remove, added, oldval ) {
                if( remove ) //more checks
                {
                  method.apply( this, arguments )
                }
              })
            }
            else if( val === 'added' )
            {
              _addListener( this, function( nval, stamp, from, remove, added, oldval ) {
                // console.log( added ) //werkt niet!;
                if( added ) //more checks
                {
                  method.apply( this, arguments )
                }
              }, mark)
            }
            else if( val === 'self' )
            {
              _addListener( this, function( nval, stamp, from, remove, added, oldval ) {
                // console.log( added ) //werkt niet!;

                //TODO: put on in a different file
                // console.log('SHOULD DO SELF!', arguments, from ) //zo wrong!

                if( this._val === nval ) //more checks
                {
                  method.apply( this, arguments )
                }
              }, mark)
            }
            else
            {
              _addListener( this, function( nval ) {
                if( nval === val || this.val === val || this._val === val ) //more checks
                {
                  method.apply( this, arguments )
                }
              }, mark)
            }
          }
        }
        return this
      }
  );

function _addListener( obj, fn, mark ) {
  if( mark ) 
  {
    obj.addListener([ fn, mark ], true )
  } 
  else 
  {
    obj.addListener( fn )
  }
}

//add find

