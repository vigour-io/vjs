module.exports = function $applyDelta (delta, shift, from, event) {
  console.log('apply delta:', delta)

  var setobj = {}
  var newdelta = shift && {}

  // make setobj to handle mutation
  // 1. added
  // 2. moved
  // 3. changed
  // 4. removed

  // do set(setobj) with block
  // emit $property event
  // emit $change event without block

  // TODO: make sure listcontextGetters are created by set.

  var moved = delta.moved
  if(moved) {
    // console.log('things have moved! handle it')
    var itemCache = {}
    var newmoved = shift && (newdelta.moved = {})
    for(var to in moved) {
      var from = moved[to] 
      to = Number(to)

      if(shift) {
      	from += shift
      	to += shift
      	newmoved[to] = from
      }
      
      // setobj[i] = { $useVal: true, $val: this[] }
      // console.log('from', from, 'to', to)

      var item = itemCache[from] || this[from]
      itemCache[to] = this[to]
      this[to] = item
      if(this[to]._$contextKey != to) {
        this.$handleShifted(to)
      }

    }
    // console.log('have moved', newmoved)
    
  }
  
  // changed
  setKeys( setobj, delta.changed, from, shift, 
  	newdelta && ( newdelta.changed = [] )
  )
  
  // added
  setKeys( setobj, delta.added, from, shift, 
  	newdelta && ( newdelta.added = [] )
  )

  // removed
	setKeys( setobj, delta.removed, null, shift, 
  	newdelta && ( newdelta.changed = [] )
  )
  
  // var removed = delta.removed
  // if(removed) {
  // 	var newremoved = shift && ( newdelta.removed = [] )
  //   for(var i = 0, l = removed.length ; i < l ; i++) {
  //     var r = removed[i]
  //     if(shift) {
  //     	r += shift
  //     	newremoved.push(r)
  //     }
  //     setobj[r] = null
  //   }
  // }
  
  // var added = delta.added
  // if(added) {
  //   console.log('things where added! handle it')
  //   if(added instanceof Array) {
  //   	for(var i = added.length-1 ; i >= 0 ; i--) {

  //   	}
  //   }
    
  // }
  console.log('applyDelta SETOBJECT:!', setobj, 'to', this)
  // this.set(setobj, event)

}

function setKeys(target, keys, from, shift) {
	if(!keys) {
		return
	}

	for(var i = 0, l = keys.length ; i < l ; i++) {
		var key = keys[i]
		target[key] = from ? from[key] : from
	}
}
