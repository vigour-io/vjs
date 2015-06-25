"use strict";

var Base = require('../../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var emitter = new Base()
var util = require('../../../util')
var merge = require('lodash/object/merge')

emitter.$executePostponed = true

define( emitter, '$exec', {
  value:function( bind, event ) {
    var emitter = this
    if(emitter._$key === '$property') {
      console.log('EXEC PROPERTY', emitter)
    }
    if(emitter.$onFn) {
      emitter.$onFn.$each(function(property) {
        property.call( bind, event, emitter._$meta )
      })
    }
    if(emitter.$onBase) {
      //this is specific for the $change type so make a seperate change thing perhaps
      emitter.$onBase.$each(function(property) {
        property.$emit('$change', event)
      })
    }
    if(emitter._$meta) {
      emitter._$meta = null
    }
  },
  configurable:true
})

function count(base, type) {
  var val = base[type]
  base[type] = val = val ? (val++) : 0
  return val
}

function add(base, type, val) {
  if(!base[type] || base[type]) {
    base.$setKeyInternal(type,{},false)
  }
  for(var i in base[type]) {
    if(base[type][i]===val) {
      console.error('allready added!', val.$path)
      return
    }
  }
  base[type][count( base, type+'Cnt')] = val
}

define( emitter, '$addListener', {
  value:function( val ) {
    //optmize this /w keyinternal
    if( typeof val === 'function' ) {
      add( this, '$onFn', val )
    } else if( val instanceof Base ) {
      add( this, '$onBase', val )
    } else if( typeof val === 'object' ) {
      add( this, '$onObject', val )
    }
  },
  configurable:true
})

define( emitter , '$set', {
  value:function(val, event) {
    this.$addListener(val)
  },
  configurable:true
})

define( emitter , '$bind', {
  get:function(val, event) {
    return this.__bind__ || this.$parent.$parent
  },
  configurable:true
})

define( emitter, '$postpone', {
  value:function( event ) {
    if( event.$stamp !== this.$postPonedStamp ) {
      this.__$bind__ = this.$bind
      event.$postpone(this)
      this.$postPonedStamp = event.$stamp
    }
  },
  configurable:true
})

define( emitter, '$emitInternal', {
  value:function( event ) {
    if( !this.$created ) {
      this.$created = event.$stamp
    } else if( this.$created!==event.$stamp ) {
      this.$exec( this.$bind, event )
    }
    this.__$bind__ = null
  },
  configurable:true
})

define( emitter , '$emit', {
  value:function( event, force, meta ) {

    if(meta) {
      if(!this._$meta || typeof meta !== 'object') {
        this._$meta = meta
      } else {
        merge(this._$meta, meta)
      }
    }

    if( this.$lastStamp === event.$stamp ) {
      return
    }

    if(event.$origin !== this.$bind && !force ) {
      this.$postpone( event )
      return
    }

    this.$emitInternal( event )

  },
  configurable:true
})

var Emitter = module.exports = emitter.$Constructor
