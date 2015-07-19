module.exports = function(delta, shift, event) {
  console.log('apply delta:', delta, shift)
  if(!shift) shift = 0

  var removed = delta.removed
  if(removed) {
    for(var i = 0, l = removed.length ; i < l ; i++) {
      var r = removed[i] + shift
      console.warn('remove!', this[r])
      // this[r].remove(event)
    }
  }

  var moved = delta.moved
  if(moved) {
    console.log('things have moved! handle it')
    var itemCache = {}
    for(var to in moved) {
      var from = moved[to] + shift
      to = Number(to) + shift
      

      console.log('from', from, 'to', to)

      var item = itemCache[from] || this[from]
      itemCache[to] = this[to]
      this[to] = item
      if(this[to]._$contextKey != to) {
        this.$handleShifted(to)
      }
    }
  }
  
  var added = delta.added
  if(delta.added) {
    console.log('things where added! handle it')

  }



}
