"use strict";

var Base = require('../../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var emitter = new Base()
var util = require('../../../util')
// var curry = require('lodash/function/curry')

define( emitter, '$exec', {
  value:function( bind, event ) {
    
    if(this.$onFn) {
      this.$onFn.$each(function(property) {
        property.call( bind, event)
      })
    }

    if(this.$onBase) {
      //onNew parent moet base worden gereset
      this.$onBase.$each(function(property) {
        property.$emit('$change', event)
      })
      //!!! remove this
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

    /*
    //if base
    b, c

    a.$({
      $val:b,
      $add:c
    })
    
    //remove is it still atached..



  */

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

define( emitter , '$emit', {
  value:function( event, force ) {

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

    this.$exec( $bind, event )

    this.__$bind__ = null

  },
  configurable:true
})

var Emitter = module.exports = emitter.$Constructor
