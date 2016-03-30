/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var  data = require('./')
  , debug = require('../util/debug')
  , util = require('../util')

debug.level.data = 4

exports.extend = util.extend(
  require('../object/debug')
  , function(Class) {
    var _proto = Class.prototype
    , _hook = _proto._hook
    , _remove = _proto.remove
    , _set =  _proto._set
    , _debug = _proto.DEBUG$log
    , _structUpdate = _proto.structUpdate
    , _saveStruct = _proto.saveStruct

  util.define(Class, 
  '_hook',function(val, settings) {
     if(debug.level.data>2) {
        console.group()
        debug.log.header('DATA _hook')
         debug.log.object(settings)
        if(debug.level.data>3) {
          this.DEBUG$log()
        }
        console.groupEnd()
     }
    if (_hook) _hook.call(this, val, settings)
  },
'saveStruct', function(name, from, remove) {
   if(debug.level.data>2) {
    console.group()
    console.log(('saveStruct '+this.ls ).green.bold)
    if(remove) console.log('--remove'.red)
    this.lsstruct.DEBUG$log('struct')
    console.groupEnd()
  }
  if(_saveStruct) {_saveStruct.apply(this,arguments)}
},
'remove', function() {
  if(debug.level.data>2) {
    console.group()
    console.log(debug.log.header('remove'.red),this._path)
    console.groupEnd()
  }
  return _remove.apply(this,arguments) 
},
'structUpdate', function() {
  if(this._localstorage && this._path) {
    if(debug.level.data>3) {
      console.group()
      console.log('localstorage structUpdate'.magenta, this._path, name)
    }
  }
  if (_structUpdate) _structUpdate.apply(this,arguments)
  if(debug.level.data>3) {
     if(this._restruct) {
      console.log('restruct it!'.green)
      this.lsstruct.DEBUG$log('structObj')
     }
     console.groupEnd()
  }
},
 '_set', function() {
    if(debug.level.data>3) {
      console.group()
      debug.log.header('_set Data '+this._path)
      if(debug.level.data>4) {
        this.DEBUG$_set(arguments)
      // if(this._localstorage) {
      //   console.log(('localstorage' +': '+this._localstorage).magenta.bold)
      // }
      if(debug.level.data>5) {
        console.log(this.DEBUG$log())
      }
      }
      console.groupEnd()
    }
    if (_set) return _set.apply(this,arguments)
  },  
  'DEBUG$log',function() {
    console.group()
     if (_debug) _debug.apply(this,arguments)
    if(this._localstorage) {
      console.log(('localstorage' +': '+this._localstorage).bold)
    }
    console.groupEnd()
  })

})  