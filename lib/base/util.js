"use strict";

var Base = require('./index.js')
var proto = Base.prototype
var define = Object.defineProperty

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
        obj.$val = val
      }
    }
    return obj
  }
})

define(proto, '$toString', {
  value: function() {
    return JSON.stringify(this.$convert({
      fnToString: true
    }), false, 2)
  }
})

define(proto, '$keys', {
  get: function() {
    var keys = []
      //this can be extra fast by caching and updating (speed)
    for (var key$ in this) {
      if (key$[0] !== '_') {
        keys.push(key$)
      }
    }
    return keys
  }
})

define(proto, '$lookUp', {
  value: function(path, value) {
    var parent = this.$parent
    if (parent) {
      if (typeof path === 'string') {
        path = path.split('.')
      }
      return lookUpUsingArray(parent, path, value, path.length)
    }
  }
})

function lookUpUsingArray(parent, path, value, length) {
  return checkPath(parent, path, value, length) || (parent = parent.$parent) 
    && lookUpUsingArray(parent, path, value, length)
}

function checkPath(obj, path, value, length) {
  var i = 0
  var result = obj[path[i]]
  while (result) {
    if (++i === (length || (length = path.length))) {
      return (value === void 0 || result === value || result._$val === value)
        && result
    }
    result = result[path[i]]
  }
}

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
        if(!length){
          if (typeof path === 'string') {
            path = path.split('.')
          }
          length = path.length
        }
        if (result = checkPath(child, path, value, length)) {
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
            if (result = checkPath(child, path, value, length)) {
              return result
            }
            if (children) {
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

//path util --- context ect ect all needs to be taken into account must be able to use it in sets etc
//get by path

//notation in path for until found somwhere up , maybe also until found down

//find

//get 
//argument

//merge

//remove

//clear

// bla.pathFinder('findInParent.yuzi.findInChild.jim')
// bla.
