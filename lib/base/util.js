"use strict";

var Base = require('./')
var define = Object.defineProperty
var proto = Base.prototype
var evaluate = require('../util/test')
var isPlainObj = require('../util').isPlainObj

// $convert
define(proto, '$convert', {
  value: function(options) {
    var fnToString = options && options.fnToString
    var key
    var obj = {}
    var val = this._$val
    
    for (var key$ in this) {
      if (key$[0] !== '_') {
        key = this[key$]
        obj[key$] = key.$convert
          && key.$convert(options)
          || key
      }
    }
    if (val) {
      if (fnToString && typeof val === 'function') {
        obj.$val = String(val)
      } else {
        if(val instanceof Base) {
          //hier parsen van ref als optie maken ($val)
          obj.$val = { $reference: val.$path }
        } else {
          obj.$val = val
        }

      }
    }
    return obj
  }
})

// $create
define(proto, '$create', {
  value:function( path, set ){
    path = convertToArray( path )
    return createPath( this, path, path.length, set)
  }
})

// $get
define(proto, '$get', {
  value:function( path, set ){
    path = convertToArray( path )
    var result = checkPath( this, path, path.length, void 0, set)
    if(result){
      return result
    }
  }
})

// $keys
define(proto, '$keys', {
  get: function() {
    var keys = []
    var index = 0
    for (var key$ in this) {
      if (key$[0] !== '_') {
        keys[index++] = key$
      }
    }
    return keys
  }
})

// $lookUp
define(proto, '$lookUp', {
  value: function(path, options) {
    var parent = this.$parent
    var conditions

    if (parent) {
      if(options && isPlainObj(options)){
        if(conditions = options.conditions){
          options = function( result ){
            return evaluate( result, conditions )
          }
        }
      }
      path = convertToArray( path )
      return lookUpParent(parent, path, path.length, options)
    }
  }
})

// $lookDown
define(proto, '$lookDown', {
  value: function(path, options) {
    path = convertToArray( path )

    var child
    var children
    var index
    var length
    var result
    var siblings
    var conditions

    if(options && isPlainObj(options)){
      if(conditions = options.conditions){
        options = function( result ){
          return evaluate( result, conditions )
        }
      }
    }

    for (var key$ in this) {
      if (key$[0] !== '_') {
        child = this[key$]
        if(length === void 0){
          if (typeof path === 'string') {
            path = path.split('.')
          }
          length = path.length
        }
        if (result = checkPath(child, path, length, options)) {
          return result
        }
        if (siblings) {
          siblings[++index] = child
        } else {
          index = 0
          siblings = [child]
        }
      }
    }

    while (siblings) {
      for (var i = index; i >= 0; i--) {
        var sibling = siblings[i]
        for (key$ in sibling) {
          if (key$[0] !== '_') {
            child = sibling[key$]
            if (result = checkPath(child, path, length, options)) {
              return result
            }
            if (children) {
              index++
              children[++index] = child
            } else {
              index = 0
              children = [child]
            }
          }
        }
      }
      siblings = children
      children = false
    }
  }
})

// $toString
define(proto, '$toString', {
  value: function() {
    return JSON.stringify(this.$convert({
      fnToString: true
    }), false, 2)
  }
})

// $find
define(proto, '$find', {
  value: function( path, options ) {
    
    path = convertToArray( path )

    var cap
    var conditions
    var index = 0
    var length = path.length
    var results = []

    if( options && isPlainObj(options) ){
      cap = options.cap
      if(conditions = options.conditions){
        options = function( result ){
          return evaluate( result, conditions )
        }
      }
    }
    
    function searchObj( obj ){
      var result = checkPath( obj, path, length, options )
      if( result ){
        results[index++] = result
      }
      if( cap === void 0 || index < cap ){
        for(var key$ in obj){
          if (key$[0] !== '_') {
            searchObj(obj[key$])
          }
        }
      }
      return results
    }

    return searchObj(this)
  }
})

// HELPER FUNCTIONS

// checkPath
function checkPath( obj, path, length, test, set ) {
  var i = 0
  var result = obj[path[0]]
  while (result) {
    if (++i === length) {
      if( test === void 0
        || typeof test === 'function'
          && test(result)
        || result === test 
        || result._$val === test
      ){
        return result
      }
    }
    if(typeof result === 'function'){
      return result.call(obj,path.splice(i), test)
    }
    obj = result
    result = result[path[i]]
  }
  if(set !== void 0){
    return createPath(obj, path.splice(i), length - i, set)
  }
}

// convertToArray
function convertToArray( path ){
  return typeof path === 'string' ? path.split('.') : path
}

// createPath
function createPath( obj, path, length, set ){
  var setObj = {}
  var i = 0
  var field = path[0]
  while(field){
    if (++i === length) {
      if(set !== void 0){
        setObj[field] = set    
      }
      obj.$set(setObj)
      return checkPath( obj, path, length )
    }
    setObj[field] = {}
    field = path[i]
  }
}

// lookUpParent
function lookUpParent( parent, path, length, test ) {
  return checkPath( parent, path, length, test)
    || ( parent = parent.$parent ) 
      && lookUpParent(parent, path, length, test )
}

// 
// function convertOptions( options ){

// }

//path util --- context ect ect all needs to be taken into account must be able to use it in sets etc
//get by path

//notation in path for until found somewhere up , maybe also until found down

//get 
//argument

//merge

//remove

//clear