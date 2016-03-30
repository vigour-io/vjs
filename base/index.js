/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var V = require('../')
  , util = require('../util')
  , inject = require('../util/inject')
// , raf = require('../browser/animation/raf')


/*
  util.define( extend, 'extensions',{val:[], setClass:true} )
*/

/**
 * Base is used as a class constructor.
 * @constructor V.Base
 * @param  {*} [val] Startvalue for new V.Base
 */
var base = V.Base = module.exports = exports = function(val) {
  this._from = this.constructor
  if (val) this.set(val)
}

exports.settings = require('./settings')

/**
 * Sets properties defined in an object.
 * Define a _set method on a base instance to get custom method per set.
 * @function _set
 * @param  {*} val         Any value
 * @param  {*} [params]    Added parameters
 * @param {Boolean} noset  When true returns a parsed val object but set nothing
 * @return {Object}        return self for chaining
 */
var _set = exports.set = function(val, params, noset) {
  for (var i in val) {
    if (~i.indexOf(',')) {
      for (var arr = i.split(','), multiobj = {}, m = 0, ml = arr.length; m < ml; m++) {
        multiobj[arr[m]] = util.clone(val[i])
      }
      if (!noset) {
        _set.call(this, multiobj, params, noset)
      } else {
        delete val[i]
        for (var n in multiobj) {
          val[n] = multiobj[n]
        }
      }
    } else {
      i = util.dotField(val, i)
      if (this._set && !noset) {
        this._set.call(this, val, i, params)
      } else {
        //TODO: check for property move from element set to here
        // if( V.Object && this.isProperty( i, val ) && this[i] instanceof V.Object )
        // {
        //   console.log('??', i, val, this.isProperty( i, val ) )
        //   this[i].val = val[i]
        // }
        // else
        // {
          this[i] = val[i]
        // }
      }
    }
  }
  return noset ? val : this
};

util.define(base,
  /**
   * When a Base is extended without defining the type this is the default type.
   * @property defaultType
   */
  'isProperty', function( i, val) {
    var t = this
      , result = 
          !( val[i] instanceof Object 
           //TODO: check if this is really nesseracy ( void 0 )
           && t._[i] === void 0 //--- danger resolve when define _ is fixed
           && !util.lookup.call(t, i) 
           && typeof t[i]!=='function' 
          )

    // console.log( val[i] instanceof Object, t._[i] === void 0, 'val:',t._[i], !util.lookup.call(t, i), typeof t[i]!=='function'  )

    // console.log( 'IS PROPERTY', i, result )

    return result
  },
  'defaultType', false,
  'extensions', false,
  'define', function(val) {
    for(var i in val) {
      util.define( this, i, val[i] )
      util.define( this.Class, i, val[i] )
    }
  },
  /**
   * Extend is used to add properties to base.
   * Settings are similar to standard defineProperty.
   * @method extend
   * @param   {Object}   settings        Define the following fields: name, type, set, new, remove.
   * @param   {String}   settings.name   Define the name of the property
   * @param   {Object}   [settings.type] Define the type of object e.g. V.Value, set type to false if you want to use standard defineProperty
   * @param   {Function} settings.set    Define a function on set
   * @param   {Function} settings.new    Define a function on construct
   * @param   {Function} settings.remove Define a function on remove
   * @return  {[type]}                   [description]
   */
  'extend', function(settings) {

    //TODO: add to instance as well , have a dictionary of extenstions -- get to orginal easyly
    var args = util.arg(arguments)
      , l = args.length
      , i

    if (l > 1) {
      for (i = 0; i < l; this.extend( args[i++] ));
    } else if (!settings.name) {
      for (i in settings) {

        if( typeof settings[i] === 'function' ) 
        {
          this.extend( { name: i, set: settings[i] } )
        }
        else
        {
          settings[i].name = i
          this.extend( settings[i] )
        }

      }
    } else {
      if (!settings.def && settings.def !== 0) settings.def = false;
  
      if (this.Class.prototype._settings) {
        exports.settings.parse.call(this, settings)
        if (settings._settings) exports.settings.create.call(this, settings)
      }
      //1. normal extensions
      if (settings.type === false || ( !settings.type && !this.defaultType ) ) {

        //TODO: test if double define is actually ok!
        // util.define(this, settings.name, settings)

        util.define(this.Class, settings.name, settings)

      } else {
        //2. V.Values
        if (!settings.type) settings.type = this.defaultType
          //a type has fields type, set ,get, create
        var get =  function(prop) {
            //custom get
            return settings.type.get 
              ? settings.type.get.call(this, prop, settings)
              : prop
          }
          , set =  function(val) {

            var prop = this[settings.name]
            if(prop===null) return
            if (prop===settings.def) { //(prop instanceof V.Object)
              //return is hier mischien niet nodig;
              return settings.type.create.call(this, val, prop, settings)
            } else {
              // console.log('????????????', this, val, prop, settings)
              
              val = settings.type.set.call(this, val, prop, settings)
              if (val!== null) prop.val = val
            }
          }

        //TODO: test if double define is actually ok!
        util.define(
          this,
          settings.name,
          settings.def,
          set,
          get,
          true
        )
        //dit breaked wat shit

        //or on value ? value.prop

        //make extended prototype object perhaps
        // this.Class.prototype['__'+settings.name+'__'] = settings

        util.define(
          this.Class,
          settings.name,
          settings.def,
          set,
          get
        )
      }
    }
  },
  /**
   * Removes this Base. Also removes all listeners added to extensions.
   * Instances true will remove all instances as well.
   * @method remove
   * @param  {[type]} instances  [description]
   * @param  {[type]} fromremove [description]
   * @param  {[type]} params     [description]
   */
  'remove', function(instances, fromremove, params) {

    // this._removing = true

    if(!this._from) return

    this.setting('remove', [params]);

    if (!fromremove) {
      var ins = this._from.base.instances
      if(ins) {
        for (var n = 0, l = ins.length; ins[n] !== this || !ins.splice(n, 1); n++);
      }
    }

    for (var i in this.__) {
      if (this.__[i] instanceof V.Object) {
        //nested, blacklist, not (fields in object), from, stamp, noupdate
        this.__[i].remove(false, false, false, false, false, true);
        this.__[i] = null
      } else {
        this.__[i] = null
      }
    }
    this.__ = null

    if (instances && this.instances) {
      for (j = this.instances.length - 1; j >= 0; this.instances[j--].remove(true, true));
    }

    for (var j in this) {
      // if(this[j] instanceof V.Base) {
      //   this[j].remove()
      // } 
      this[j] = null;
    }

    this._settings = null
    this._ = null
    delete this._settings
    delete this._
    delete this.__
    // delete this._class; may not be nessecary
  },
  /*set on prototype*/
  'set', _set,
  'inject', inject,
  /**
   * Passes field parameter only for instances matching a field
   * @method
   * @param  {Function} fn    [description]
   * @param  {String}   field [description]
   * @param  {*}        val   [description]
   * @param  {*}        p     [description]
   * @return {Boolean}        [description]
   */
  'eachInstance', function(fn, field, val, p) {
    var instances = this.instances;
    if (instances) {
      for (var i = 0, l = instances.length, instance; i < l; i++) {
        instance = instances[i];
        if (!field || !instance.__ || !instance.__[field]) {
          if (fn.call(instance, val, p)) {
            return true;
          }
          if (instance.eachInstance(fn, field, val)) {
            return true;
          }
        }
      }
    }
  },
  /**
   * Creates a class from the current Base instance
   * @constructor Class
   * @return {Object}
   */
  'Class', {
    get: function() {
      if (!this._class) {
        this.instances = [];
        this._class = function(val, proto, setting) {
          if (!proto) {
            var from = this._from.base;
            from.instances.push(this);
            if (this.setting) {
              this.setting('new', [from, setting]);
            }
            if (val) {
              this.set(val);
            }
          }
        };
        this._class.base = this;
        this._class.prototype = new this._from(false, true);
        this._class.prototype.__ = null;
        util.setstore.call(this);
        var i, _proto = this._class.prototype._ = {};
        for (i in this.__) {
          _proto[i] = this.__[i];
        }
        for (i in this._) {
          if (_proto[i] === void 0) {
            _proto[i] = this._[i];
          }
        }
        this._class.prototype._from = this._class;
        this._class.inject = inject
      }
      return this._class;
    }
  });