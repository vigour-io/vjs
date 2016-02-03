'use strict'

/*
Performance wise the old solution was better, as the array doesn't need any reindexing
Unfortunately I ran into an Maximum Callstack error (even with a small array for path)
After changing it to the slice function, all problems were solved.
*/

module.exports = function setWithPath (obj, path, val) {
  var ret = obj
  var key = path.shift()
  if (path.length === 0) {
    ret = obj[key] = val
  } else {
    obj[key] = {}
    ret = setWithPath(obj[key], path, val)
  }
  return ret
}
