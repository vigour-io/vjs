/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */

//TODO: flags on the basis of path ( similair to cases )

//TODO: make Value flags more injectable
var flags = module.exports = require( './' )
  , processes = require( '../../util/process' )
  , Value = require( '../' )
  , util = require( '../../util' )
  , ajax = require('../../browser/network/ajax')
  , vObject = require('../../object')

//TODO: maybe add promise

exports.create = function( flag, settings, Constructor, extendflags ) {

  if( !extendflags ) extendflags = flags
  if( !Constructor ) Constructor = Value

  var tempStore = '__temp'+flag+'__'
    , inProgress =  '__inprogress'+flag+'__'
    , origUpdate = Constructor.prototype._update
    , once = settings && settings.once
    , deferMethod = settings && settings.deferMethod
    , origSet
    , origRemove
    , deferflag = 
      { reset: true
      , set: function( val, stamp, reset ) {
          if( !this._flag ) this._flag = {}
          this._flag[flag] = [ flag, false, val, this ]
        }
      , remove: function() {
          var defer = this._flag && this._flag[flag]
            , vobj

          if( defer && defer[1] )
          {

            // if( deferMethod ) 
            // {
              // vobj = deferMethod.call( _this, arr, defer[2], _this[tempStore], origUpdate, Constructor )
            // }
            // if() {
              vobj = typeof defer[2] === 'string'
                   ? processes[defer[2]]
                   : typeof defer[2] !== 'function' && defer[2]
            // }

            if( vobj.removeListener )
            {
              vobj.removeListener( defer[1] )
            }
            else if( vobj && vobj !== true )
            {
              for( var vobj$ in vobj )
              {
                vobj.removeListener( vobj[vobj$] )
              }
            }
          }
        }
      }


  Constructor.prototype._blacklist.push
  ( tempStore
  , inProgress
  , '_history'
  // , '_initialised'
  )

  if( deferMethod ) {
    settings.deferMethod = null
  }

   if( once ) {
    settings.once = null
    Constructor.prototype._blacklist.push( once )
  }

  if( settings ) {
    for( var key in settings )
    {
      if( key === 'set' )
      {
        origSet = deferflag.set
        deferflag.set = function( val, stamp, reset ) {
          // console.log( '!@!@#!@#!@#', origSet )
          settings.set.call( this, origSet, arguments )
        }
      }
      else if( key === 'remove' )
      {
        origRemove = deferflag.remove
        deferflag.remove = function( val, stamp, reset ) {
          settings.remove.call( this, origRemove, arguments )
        }
      }
      else 
      {
        deferflag[key] = settings[key]
      }
    }
  }

  extendflags[flag] = deferflag

  //extend update
  util.define
  ( Constructor
  , '_update'
  , function( val, stamp ) {

      // if( once ) {
      //   console.log( flag, once, 'should do orig update bitches!', arguments, this, this[once], ( !once || !this[once] ) )
      // }

      if( this._flag && this._flag[flag] && ( !once || !this[once] ) ) //&& !this._initialised 
      {
        var _this = this
          , defer = _this._flag && _this._flag[flag]
          , tempdefer = _this[tempStore]
          , add
          , arr
          , vobj
          , recur
          , fn


        if( !tempdefer )
        {
          _this[tempStore] = tempdefer = []
          add = true
        } else {
          //TODO: fix caching stamp, most efficient but may break things /w instances etc
          if( stamp && tempdefer[0][1] !== stamp )
          {
            tempdefer[0][1] = stamp
          }
          return
        }

        arr = util.arg( arguments )
        tempdefer.push( arr )

        if( add )
        {
        
          if( deferMethod ) 
          {
            vobj = deferMethod.call( _this, arr, defer[2], tempStore, origUpdate, Constructor )
          }
          else 
          {
            vobj = typeof defer[2] === 'string'
               ? processes[defer[2]]
               : defer[2]
          }

          if( vobj )
          {
            //tempdefer!

            //TODO: replace with a standard function, lose the extra closure!
            recur = function() {

              if( once ) 
              {
                _this[once] = true
              }
              //dit ook kunnen meegeven

              //TODO: using a closure here may not be nessecary anymore, use another identifier
              for( var i = 0, len = tempdefer.length; i < len; i++ ) {
                // _this._caller = tempdefer[i].splice( tempdefer[i].length-1, 1 )
                // tempdefer[i][1] = this.stamp()

                console.log('!!!!!!!!!!!!!!!!!!', tempdefer[i], i, _this._name || _this._prop && _this._prop.name )

                origUpdate.apply( _this, tempdefer[i] )
              }

              if( this.removeListener ) this.removeListener( recur )
              _this[tempStore] = null
            }

            if( typeof vobj === 'function' )
            {

              if( !_this[inProgress] )
              {

                fn = function( kill ) {
                  if( !kill && _this[inProgress] ) _this[inProgress]()
                  _this[inProgress] = null
                  _this[tempStore] = null
                }

                _this[inProgress] = recur

                if( vobj.call( this, fn , arr, tempdefer ) === true )
                {
                  _this[tempStore] = null
                  _this[inProgress] = null
                }
                // else
                // {
                //   console.log( '?' )
                //   //TODO: check if this is the best way, (updating recur, or mayeb just use the same recur)
                //   _this._deferinprogress = recur
                // }

              }

            }
            else if( vobj === true )
            {
              if( this.val || this.val === 0 )
              {
                origUpdate.apply( _this, arr )
                _this[tempStore] = null
              }  
              else
              {
                console.error( 'no value! from defer type:', flag)
              }
            }
            else if( !vobj.addListener )
            {
              for( var vobj$ in vobj )
              {
                vobj[vobj$].addListener( recur )
              }
            }
            else
            {
              vobj.addListener( recur )
            }

            defer[1] = recur
          }
        }

      }
      else
      {
        // console.log( flag, once, 'should do orig update bitches!', arguments, this )
        origUpdate.apply( this, arguments )
      }

    }
  )

} 

//TODO: injectable
//TODO:_tempdefer hoeft niet altijd maak create -- update type flag
//always update method
exports.create( 'force', 
{ deferMethod: function( args, vobj, tempStore, update ) {
    var _this = this

    //dit zit natuurlijk dieper!
    _this._skip = true //maybe check if it rly gets reset?
    _this._ignoreValue = true
    _this.clearCache()
    _this[tempStore] = null
    update.apply( _this, args )
  }  
})
//deze moet nog wat dieper

exports.create( 'history', 
{ deferMethod: function( args, vobj, tempStore, update, Constructor ) {
    //vobj option voor flag
    if(!this._history) this._history = []

    this._history.unshift( args )
    this[tempStore] = null //total control! (old including arguments)

    //allright that works this.clearCache() //cache dingen adden
    update.apply( this, args )
  }
})

exports.create( '$type', 
{ deferMethod: function( args, vobj, tempStore, update ) {
    var _this = this
      , haveToUpdate

    //arrays etc
    _this.clearCache()

    if( vobj === true )
    {
      if( _this.val ) haveToUpdate = true
    }
    else if( vobj === 'string' )
    {
      if( typeof _this.val === 'string' ) haveToUpdate = true
    }
    else if( vobj === 'number' )
    {
      if( typeof _this.val === 'number' ) haveToUpdate = true
    }
    else if( typeof vobj === 'function' )
    {
      if( vobj.apply( _this, args ) ) haveToUpdate = true
    }

    if( haveToUpdate ) {
      _this[tempStore] = null
      update.apply( _this, args )
    }
  }  
})

exports.create( 'init', 
{ set: function( set, args ) {
    if( !this.initialised )
    {
      set.apply( this, args ) //niet nodig!
    }
  }
, remove: function( remove, args ) {
    remove.apply( this, args )
    this.initialised = null
  }
, once: 'initialised'
})

exports.create( 'defer' )

//TODO: vObj flag ( accessable trough object[flag] )
exports.create( 'ajax', 
{ remove: function( remove, args ) {
    //TODO: ajax call stop
    remove.apply( this, args )
  }
, deferMethod: function( args, vobj, tempStore, update, Constructor ) {
    var _this = this
      
    return vobj && function( update, args ) {

      if( typeof vobj === 'function' ) 
      {
        vobj = vobj.call( _this, update, args )
      }
      
      if( typeof vobj === 'string' ) 
      {
        vobj = { url: vobj }
      }

      if( !vobj || !( vobj.url || vobj.api ) ) 
      {
        return true
      }

      vobj.complete = function( data ) {
        if( vobj.defer ) 
        {
          vobj.defer.call( _this, update, args, null, data )
        }
        else
        {
          _this.set( 'transform' , data )
          update()
        }
      }
      vobj.error = function( err ) {
        if( vobj.defer ) 
        {
          vobj.defer.call( _this, update, args, err )
        }
        else
        {
          if( _this.transform )
          { 
            _this.transform.each( function( key ) {
              if( !Constructor.operators[key] && !Constructor.flags[key] )
              {
                this.remove()
              }
            })
          }

          _this.set( 'transform' , void 0 )
          update()
        }
      }
      ajax( vobj ) //TODO: let it return a promise
    }  
  }
})

