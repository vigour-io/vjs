var element = require('../')
  , Data = require('../../../../data').inject(require('../../../../data/selection'))
  , util = require('../../../../util')

var r = function() {
  return String(~~(Math.random()*9))+''
}

exports.element = function (data, element, t, update, node, options, hasFilter, resolve) {
  var elem
  if(options && options.newElement) {
    elem = options.newElement.apply(this,arguments)
    if(elem===true) return
  }
  elem = elem || new element.Class()
  
  elem._col = true
  if (data !== void 0) elem._dSet(data)
  if (node) node.appendChild(elem.node)
  elem.setting('parent', [t])
  ;options&&options.element&&options.element(elem, t, hasFilter, resolve)
  if (update && data !== void 0) elem.updateData()
  t.checkRender(elem, true)
  return elem
}

exports.fragment = function (data, element, t, exclude, options, hasFilter) {
  var frag = document.createDocumentFragment()
    , item = function(i) {
        //if you use the passed i it is a different value for selections
        if(this._name) i = this._name
        if(!(options&&options.fragment&&options.fragment(t,this,exclude,i))
          && (!exclude || !exclude[i]) ) {
          var elem = exports.element( this || null, element, t, false, frag, options
              , hasFilter)
          if(elem) frag.appendChild( elem.node )
        }
      }
  frag._p = t

  if(data.each) {
    data.each(item)
  } else {
    //normal data
    for(var i in data) {
      item.call( data[i] ,i )
    }
  }

  element.updateData(true)
  return frag
}

exports.children = function (t, options) {
  if(!t) return
  var ch = []
  for(var i in t.node.childNodes) {
    var child = t.node.childNodes[i].base
    if(child && child._col) {
      ch.push(child)
    }
  }
  ;options&&options.children&&options.children(ch)
  return ch
}

exports.clear = function (t, options) {
  t.colInit = null
  var c = exports.children(t)
  for(var i in c) { c[i].remove() }
  ;options&&options.clear&&options.clear(t)
}

exports.filter = function (val,t) {
  var data = val.val

  if(val.filter && val.filter.val===true) {
    // console.log('sort by name') moet beter
    return true
    //different vibes
  }

  if (data && val.filter && !t.filter) {
    var a = val.filter.raw
    //dit is kapot
    data = t.filter = new Data(data, a)
    a._col = true
    
    data.addListener(function (val, stamp, from, remove) {
      t.collection._update(val, stamp, from, remove)
    })
    
    t.setSetting({
      name: 'collecitonfilter',
      remove: function () {
        t.filter.remove()
        t.filter = null
      }
    })

    return data._uid
    // return t.filter._uid//data is filter
  } else if(data && data._filter) {
    return data._uid
  } 
  // else if(t.filter) {
    // return t.filter._uid
  // }
}

// exports.indexChange = function(el, t, hasFilter, noResolve) {
// var oldIndex = el._d._indexCache[hasFilter][1]
//     , newIndex = el._d._indexCache[hasFilter][0]
//     , ch = !noResolve && collection.children(t,exports)
//     , l


//   exports.xy(el)

//   if(noResolve) return

//   l = ch.length
  
  
//   var clone = el.node.cloneNode(true)
//   t.node.removeChild(el)
//   el._node = clone


   
//   // t.h = t.node.scrollHeight
// }