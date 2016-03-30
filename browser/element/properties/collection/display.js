var collection = require('./util')

exports.prepare = function(el) {
  if(!el.display) el.display = 'block'
}

exports.newElement = function(data, element, t) {
  var c = collection.children(t)
  for(var i in c) {
    if(c[i]._d && c[i]._d===data) {
      c[i].display = element.display.val
      return true
    }
  }
}
 
exports.rem = function (el, t, hasFilter, noResolve) {
 el.display = 'none'
 return true
}

exports.fragment = function(a,b,exclude,i) {
  //since it never removes excludes should never be applied
  //exclude is normally used to not add things again if they already exist
  if(exclude) exclude[i]=null
}
