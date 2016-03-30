var collection = require('./util')

//clear
//index voor sort
//merge en sort ????

exports.xy = function (el) {
  if (el.x && el.x._lval === false) el.x.update(el)
  if (el.y && el.y._lval === false) el.y.update(el)
}

exports.prepare = function(el) {
  el.position = 'absolute'
}

exports.element = function (el, t, hasFilter, resolve) {
  var l
    , c

  if(hasFilter) {
    var start =  el._d._indexCache[hasFilter][0]
    el.i = start
    if(resolve) {
      var i = start
        , e = 0

      c = collection.children(t,exports)
      l = c.length

      for(;i < l; i++) {
        if(c[i]!==el) {
          c[i].i = i+1-e
          exports.xy(c[i])
        } else {
          e = 1
        }
      }
    }
  } else {
    if(t._colIndex===void 0) { t._colIndex = 0 }
    else { t._colIndex++ }
    el.i = t._colIndex  
  }
  exports.xy(el)
  // console.log('x',t.node,t.node.scrollHeight)
}

exports.rem = function (el, t, hasFilter, noResolve) {
  var c = collection.children(t,exports)
  if(!noResolve) {
    for(var i = el.i+1, l = c.length; i<l; i++) {
      c[i].i = i-1
      exports.xy(c[i])
    }
    if(!hasFilter) t._colIndex-- 
  // t.h = t.node.scrollHeight
  }
}

exports.children = function(ch) {
  ch.sort(function(a, b) {
    return a.i - b.i
  })
}

exports.indexChange = function(el, t, hasFilter, noResolve) {
  var oldIndex = el._d._indexCache[hasFilter][1]
    , newIndex = el._d._indexCache[hasFilter][0]
    , ch = !noResolve && collection.children(t,exports)
    , l

  el.i = newIndex
  exports.xy(el)

  if(noResolve) return

  l = ch.length

  if(oldIndex<newIndex) {
    for(var i = oldIndex+1 ; i < newIndex+1; i++ ) {
      if(ch[i]!==el) {
        ch[i].i = i-1
        exports.xy(ch[i])
      }
    }
  } else {
    for(var i = newIndex; i<oldIndex; i++) {
      ch[i].i = i+1
      exports.xy(ch[i])
    }
  }
  // t.h = t.node.scrollHeight
}

// exports.updateHandle = function() {
//   var c = collection.children(this,exports)
//   this.h = c[c.length-1].y.val
// }


