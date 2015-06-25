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
  //really want array stuff for this..
  var val = base[type]
  base[type] = val = val ? (val++) : 0
  return val
}

function add(base, type, val) {
  if(!base[type] || base[type]) {
    base.$setKeyInternal(type,{},false)
  }

  //search if it exists...
  for(var i in base[type]) {
    if(base[type][i]===val) {
      console.error('allready added!', val.$path)
      return
    }
  }

  base[type][count( base, type+'Cnt')] = val
  // base[type].$setKeyInternal(count( base, type+'Cnt'),val,false)
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
    // if(event && !this.$lastStamp) {
    //   this.$lastStamp = event.$stamp
    // }
    this.$addListener(val)
  },
  configurable:true
})

define( emitter , '$emit', {
  value:function( event, force, meta ) {

    if(meta) {
      console.log('???', meta)
      if(!this._$meta || typeof meta !== 'object') {
        this._$meta = meta
      } else {
        merge(this._$meta, meta)
      }
    }

    console.log('???', this.$lastStamp, event.$stamp)

    if( this.$lastStamp === event.$stamp ) {
      return
    }

    var $bind = this.__$bind__ || this.$parent.$parent  

    if(event.$origin !== $bind && !force ) {
      if(this.$postPonedStamp === event.$stamp) {
        return
      }
      this.__$bind__ = $bind
      event.$postpone(this)
      this.$postPonedStamp = event.$stamp
      return
    }

    if(!this.$created) {
      this.$created = event.$stamp
    }

    if(this.$created!==event.$stamp) {
      this.$exec( $bind, event )
    }

    this.__$bind__ = null

  },
  configurable:true
})

var Emitter = module.exports = emitter.$Constructor
