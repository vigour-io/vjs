'use strict'

var include = module.exports = function include (arr, thing) {
  if (thing instanceof Array) {
    include.list(arr, thing)
  } else {
    include.item(arr, thing)
  }
}

include.list = function includeList (arr, list) {
  var result
  for (let i = 0, l = list.length; i < l; i++) {
    var included = include.item(arr, list[i])
    if (!result) {
      result = included
    }
  }
  return result
}

include.item = function includeItem (arr, item) {
  return !isIncluded(arr, item) && arr.push(item)
}

var isIncluded = include.isIncluded = function isIncluded (arr, item) {
  for (let j = arr.length - 1; j >= 0; j--) {
    if (arr[j] === item) {
      return true
    }
  }
}
