/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var base = require('../base')
  , value = require('./')
  , objectSet = require('../object').set
  , util = require('../util')
  // , raf = require('../browser/animation/raf')

exports.clonelist = [
  [ '_base', false ], '_caller', '_prop', '_name', '_skip'
]

function resolveListener( listener, val, prop, instance ) {
  if (listener) {
    if ( listener._bind === instance && listener.__t === 4 ) {
      // console.log('bind resolve'.red.bold, val )
      listener.val = val
    }
    else if (!listener._bind ) { 

      if( listener.__t === 4 && listener._val === prop )
      {
        // listener.val = 
        listener.val = val
        console.log('----------', listener.__t )
      }
      else
      {
        // console.log('ultimate ugly!')
        val.addListener(listener) //dit fixed  
      }

      //TODO: implement this later
      // if( listener instanceof Array ) {
      //   var mark = listener[1]
      //   if( mark ) {
      //     if( mark === prop._base || mark === instance || instance instanceof mark._class ) {
      //       //TODO: propably need to check for inheritance ( mark instance of prop._base)
      //       // console.log('mark resolve'.green.inverse, listener)
      //       // val.addListener([ listener[0] , instance ], true)
      //     }
      //   }
      // }

      
      // val.addListener(_listeners[i])
    }
  }
}

// function resolveListener( ) {

// }

/**
 * V.value.base.type
 * Defines the base type used in V.Value
 * @type
 */
exports.type = {
  type: value,
  /**
   * Defines what this type will do on creation.
   * @method create
   * @param  {*} val              Value
   * @param  {[type]}  [prop]     [description] //WORDT NIET GEBRUIKT
   * @param  {Object}  [settings] Settingobject
   * @param  {Boolean} [noupdate] When true, doesn't update the V.Value
   * @return {Object}             Returns the V.Value
   */
  create: function(val, prop, settings, noupdate) {
    var v = new value()
    v._base = this
    v._caller = v._base
    v._prop = settings
    // console.log('set')
    objectSet.call(v, val, false, false, true)
    // console.log('done setting')
    if (this._class) this._class.prototype._[settings.name] = v
    if (settings.set) {
      if (!settings._vset) {
        settings._vset = function(stamp, from, remove, cval) {
          // var t = this
          // t.__s = true
          // if(!t._s) {
            // raf(function() {
              // console.log('IM HERE?')
              // t.__s = null
              settings.set.call(
                   this._caller
                || this._base
                || this, this, stamp, from, remove, cval
              )
            // })
          // }

        }
      }
      if (!noupdate) {
        // console.log('UPDATE creation')
        v._update(val)
      }
    }
    return v
  },
  /**
   * Defines what this type will do on set.
   * @method set
   * @param  {*}      val      Value
   * @param  {Object} prop     Properties
   * @param  {Object} settings Settingsobject
   * @return {*}               Returns value
   */
  set: function(val, prop, settings) {

    if(!prop) return
    // console.log('SET FUN!')
    prop._caller = this
    //deze bind zou alleen moeten werken voor als je iets op het exact goede momment changed!

    prop._bind = false
    if (this !== prop._base) {
      var _listeners = prop._listeners
        , _b = prop._base
        , i
        , _this = this

      util.setstore.call(this)
      exports.clonelist[0][1] = this //beetje dirty...

      //clone is always used to get rid of flags
      if (val !== void 0 && !val.clear) {
        val = prop.clone(val, false, exports.clonelist)
      } else {
        // if(prop._flag) {
        //   value.flags[prop._flag[0]].remove && value.flags[prop._flag[0]].remove.call(this,prop._flag)
        // }
        //listener on nested child on parent

         //--->  new width for this one
         // --->  hey a listener on me /w a bind on my instance!
         //  ----> add listener to me (listener on class prop)
         //   -----> hey lets reset this little guys width
         //    ------>  lets add Listener
         //     -------->  double listeners on this one
        var v = new value()
        v._base = this
        v._prop = settings
        v._caller = this

        // clean FLAGS from node!
        if(val) delete val.clear
        v.val = val
        val = v
      }

      this.__[settings.name] = val

      if( this._class ) this._class.prototype._[settings.name] = val

      // for each field (only 1 level deep for now)
      prop.each
      ( 
        function(key) {
          // console.log('resolve', prop._prop.name, key)
           if( this._listeners ) {
            for (i =  this._listeners.length - 1; i >= 0; i--) {
              resolveListener( this._listeners[i], val[key], prop, _this )
            }
            //TODO: check if this is nessecary
            if(val[key].val !== this.val)
            {
              // console.log(val[key]) 
              // val[key]._update()
            }
          }
        }
      )

      if( _listeners ) {

        for (i = _listeners.length - 1; i >= 0; i--) {
          resolveListener( _listeners[i], val, prop, _this )
        }

      }

      val = null
      // console.log('UPDACE ----'.yellow)
      this[settings.name]._update(val)
    }

    return val
  },
  /**
   Defines what this type will do on get.
   * @method get
   * @param  {Object} prop     Properties
   * @param  {Object} settings Settingobject
   * @return {Object}          [description]
  */
  get: function(prop, settings) {
    // console.log('GETTING!', prop, settings.name)
    if (prop) prop._caller = this
    if (settings.get) return settings.get.call(this, prop)
    return prop
  }
}