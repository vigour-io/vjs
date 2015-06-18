"use strict";
var helpers = require('./helpers')
var isPlainObj = helpers.isPlainObj
var returnPath = helpers.returnPath
var getPath = helpers.getPath
var returnOptions = helpers.returnOptions

module.exports = function(path, options) {
  path = returnPath( path )

  var child
  var children
  var index
  var length
  var result
  var siblings
  var conditions

  if(options && isPlainObj(options)){
    options = returnOptions( options )
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
      if (result = getPath(child, path, length, options)) {
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
          if (result = getPath(child, path, length, options)) {
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