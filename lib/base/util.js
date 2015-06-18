"use strict";

var Base = require('./index.js')
var proto = Base.prototype
var define = Object.defineProperty

define(proto, '$each', function( fn ) {
  for( var key$ in this ) {
    if( key$[0] !== '_' ) {
      //check what the normal forEach does
      var ret = fn.call( this, this[key$], key$ )
      if( ret ) {
        return ret
      }
    }
  }
})

//this bad boy needs many many options e.g. exclude
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

// $toString
define(proto, '$toString', {
  value: function() {
    return JSON.stringify(this.$convert({
      fnToString: true
    }), false, 2)
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
  value: function(path, value) {
    var parent = this.$parent
    if (parent) {
      path = convertToArray( path )
      return lookUpParent(parent, path, path.length, value)
    }
  }
})

function lookUpParent(parent, path, length, value) {
  return checkPath(parent, path, length, value)
    || ( parent = parent.$parent ) 
      && lookUpParent(parent, path, length, value)
}

// $lookDown
define(proto, '$lookDown', { //2.36 seconds
  value: function(path, value) {
    var child
    var children
    var index
    var key
    var length
    var result
    var siblings

    for (key in this) {
      if (key[0] !== '_') {
        child = this[key]
        if(length === void 0){
          if (typeof path === 'string') {
            path = path.split('.')
          }
          length = path.length
        }
        if (result = checkPath(child, path, length, value)) {
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
        for (key in sibling) {
          if (key[0] !== '_') {
            child = sibling[key]
            if (result = checkPath(child, path, length, value)) {
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

function checkPath( obj, path, length, value, set ) {
  var i = 0
  var result = obj[path[i]]
  while (result) {
    if (++i === length) {
      if( value === void 0
        || typeof value === 'function'
          && value(result)
        || result === value 
        || result._$val === value
      ){
        return result
      }
    }
    if(typeof result === 'function'){
      return result.call(obj,path.splice(i), value)
    }
    obj = result
    result = result[path[i]]
  }
  if(set !== void 0){
    return createPath(obj, path.splice(i), length - i, set)
  }
}

function convertToArray( path ){
  return typeof path === 'string' ? path.split('.') : path
}

//path util --- context ect ect all needs to be taken into account must be able to use it in sets etc
//get by path

//notation in path for until found somewhere up , maybe also until found down

//get 
//argument

//merge

//remove

//clear