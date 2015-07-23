"use strict";

var List = require('../../list')

module.exports = function $move(obj, moved, shift) {
	var itemCache = {}
  var newmoved = shift && (newdelta.moved = {})
  var isList = obj instanceof List
  for(var to in moved) {
    var from = moved[to] 
    to = Number(to)

    if(shift) {
    	from += shift
    	to += shift
    	newmoved[to] = from
    }
    
    // setobj[i] = { $useVal: true, $val: obj[] }
    // console.log('from', from, 'to', to)

    var item = itemCache[from] || obj[from]
    itemCache[to] = obj[to]
    obj[to] = item
    if(isList && obj[to]._$contextKey != to) {
      obj.$handleShifted(to)
    }
    
  }
  // console.log('have moved', newmoved)	
}