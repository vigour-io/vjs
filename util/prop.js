/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var util = module.exports = exports = require('./')
  , V = require('../')
/**
 * Setstores are used to avoid updates troughout prototype chains for changes of fields on objects
 * It uses two fields
 *   .__ to indicate own values for pieces of an object inherited trough the prototype chain
 *   ._ is the refence back to the objects as ste in the prototype
 * @constructor setstore
 */
exports.setstore = function() {
  if ( !this.__ ) this.__ = {}
}

//TODO: reconstruct value using pieces of objects in __

exports.getStore = function( name ) {
  return this.__ 
          ? ( this.__[name] !== void 0 
            ? this.__[name] 
            : this._[name]
            ) 
          : this._ && this._[name]
}

function extensions( extend, fn, base, args, extended ) {
    
  if( !extend.extensions ) 
  {
    if(base) {
      extend.extensions = []
    } else {
      // console.log(extend)
      if(V.Object && extend instanceof V.Object ) {
        util.define( extend, 'extensions',[])
      } else {
        //gebruik deze extension stylo
        util.define( extend, 'extensions',{val:[], setClass:true} )
      }
    }
  }

  // console.log( 'EXTEND'.red, extend.extensions, base, fn, this, extended )

  if( util.checkArray( extend.extensions, this )===false ) 
  {

    // console.log( 'EXTEND -2'.red, this )

    if( !extended ) extend.extensions = [ this ].concat( extend.extensions ) 

      // console.log( 'EXTEND -3'.red, extend.extensions )
      //somethin weird!

    // console.log( 'EXTEND -3'.red, this, extend, extend.extensions.length )


    var myArgs = util.arg( args )
    if( base && !extended ) {
      myArgs[0] = base
    }
    return fn.apply( this, myArgs )
  }

}

exports.extend = function() {
  
  var extendArray = util.arg( arguments )

  return function(extend) {
    var base
      , proto

    if( typeof extend === 'function' ) 
    {
      if( V.Base && ( extend.prototype instanceof V.Base ) ) {
        base = extend.base
        proto = true
      } else {
        proto = extend.prototype
      }
    } else if( V.Base && ( extend instanceof V.Base ) ) 
    {
      proto = extend
    }

    for
    ( 
      var fn
        , ret
        , args = util.arg( arguments )
        , extendArr
        , xArg
        , i = 0
        , len = extendArray.length
        ; i < len
        ; i ++ 
    ) 
    {    
      if(extendArray[i] instanceof Array) 
      {
        extendArr = extendArray[i][0]
        xArg = util.arg(extendArray[i],1)
        xArg.unshift(extend)
      } else 
      {
        xArg = args
        extendArr = extendArray[i]
      }

      ret = extensions.call 
      ( extendArr.extend ?  extendArr : this 
      , base || proto
      , extendArr.extend ||  extendArr
      , base
      , xArg
      , extendArr.extend ? true : false 
      ) 
      || extend

    }
    return ret
  }

}

/**
 * Add is used as a shortcut method for Object.defineProperty and extends setstore functionality to normal prototypes
 * @method add
 * @param  {Object}          obj  When obj is a constructor it selects obj.prototype, when obj is a normal object this is used instead
 * @param  {String|Array}    name When name is a string it adds the name for the object, when name is a array do the same setting for each name
 * @param  {Object|Function} val  When val is an object , use this object for Object.defineProperty with default for enummerable:false, when object is empty adds {value:{},ennumerable:false}, when val is a function it automatically wraps a property definition object with {value: val , enummerable:false}, when val is not a function and not an object (boolean, string, number) adds special setstore value
 * @param  {Function}        [set]  Adds custom setters to a setstore object, when set is a string the add functions interprets the arguments as name : property definition pairs
 * @param  {Function}        [get]  Adds custom getters to a setstore object
 * @
 */
exports.define = function (obj, name, val, set, get, id) {
  if (typeof set === 'string') {
    var _args = util.arg(arguments)
    for (var i = 1, l = _args.length; i < l; i += 2) {
      exports.define(obj, _args[i], _args[i + 1])
    }
  } else {
    if (name instanceof Array) {
      for (var i = 0, l = name.length; i < l; i++) {
        exports.define(obj, name[i], val)
      }
    } else {
      if (typeof val === 'function' || val instanceof Array) {
        val = {
          enumerable: false,
          value: val,
          configurable: true
        }
      } else if (!val || ( !(val instanceof Object) || val.setClass  )) {

        if( val && val.setClass ) {
          val = val.val
        }

        var proto = obj.prototype || obj


        //

        //TODO: not a good solution -- has to redefine constantly ( too heavy )
        // if( proto !== obj.prototype && proto._ ) {
        //    //TODO: this can go completely wrong when you expect inheritance not to break when making a new class!
        //    if( proto.constructor.prototype._ === proto._ ) {
        //       var old = proto._
        //       proto._ = {}
        //       for(var key in old) {
        //         proto._[key] = old[key]
        //       }
        //    }
        // }
        
        //maybe make into a method
        if( id) {
          // console.log('DEFINE! DO IT'.red.inverse, name, id, proto)
          if (!proto.__) proto.__ = {}
          proto.__[name] = val
        } else {
          if (!proto._) proto._ = {}
          proto._[name] = val
        }



      

        //if proto is not a prototype (how to check?) then use __ perhaps?

        //moet hier niet altijd ze eiguh worden gemaakt?

       //default dit is eigenlijk het enige dat mis gaat

        var setter = function(val) {
              exports.setstore.call(this)
              //TODO: fix closure for val
              if (val || val === 0 || val === false) this.__[name] = val
            }
          , wset = function(val) {
              val = set.call(this, val);
              setter.call(this, val);
            }
          , getter = function() {
              return exports.getStore.call(this, name);
            }
          , wget = function() {
              var prop = getter.call(this);
              return get.call(this, prop);
            }

        val = {
          enumerable: false,
          configurable: true,
          get: get ? wget : getter,
          set: set ? wset : setter
        }

      } else if (!val.enumerable) {
        if (util.empty(val)) val.value = {}
        val.configurable = true
        val.enumerable = false
      }

      Object.defineProperty(obj.prototype || obj, name, val)

      // Object.defineProperty(obj.prototype || obj, name, val)
      //mayeb do both?
    }
  }
}