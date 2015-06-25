"use strict";

var Base = require('../../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var util = require('../../../util')

var Emitter = module.exports = new Base({
  $define: {
    _$executePostponed: true,
    $exec:function( bind, event ) {
      var emitter = this
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
      if(this.__$bind__ ) {
        this.__$bind__ = null
      }
    },
    $addListener:function( val ) {
      //optmize this /w keyinternal
      if( typeof val === 'function' ) {
        add( this, '$onFn', val )
      } else if( val instanceof Base ) {
        add( this, '$onBase', val )
      } else if( typeof val === 'object' ) {
        add( this, '$onObject', val )
      }
    },
    $set:function(val, event) {
      if(util.isPlainObj(val) && val.$define) {
        proto.$set.apply(this, arguments)
      }
      this.$addListener(val)
    },
    $bind:{
      get:function(val, event) {
        return this.__bind__ || this.$parent.$parent
      }
    },
    $postpone: function( event ) {
      if( event.$stamp !== this.$postPonedStamp ) {
        this.__$bind__ = this.$bind
        event.$postpone(this)
        this.$postPonedStamp = event.$stamp
      }
    },
    $emitEvent:function( event, force, meta ) {
      if(meta) {
        this._$meta = meta
      }
      if( this.$lastStamp !== event.$stamp ) {
        if( event.$origin !== this.$bind && !force ) {
          this.$postpone( event )
        } else {
          this.$exec( this.$bind, event )
        }
      }
    }
  }
}).$Constructor

//-------------helpers will go away when array is done--------
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