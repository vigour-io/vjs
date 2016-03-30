/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var element = require('../element')
  , cases = require('../cases')
  , util = require('../../util')
  , FieldStore = function () {}

util.define(FieldStore, '_uid', { value: 0 })

exports._r = {} //list of basic (raw) events e.g. 'mousedown'

//remove events if there are no children that use them anymore

exports.document = new element({ node: document })

exports.document.exec = function( event ) {

  if( this.__e[event] )
  {
    var args = util.arg( arguments, 1 )
    for( var i in this.__e[event] )
    {
      this.__e[event][i].apply( this, args )
    }
  }

}

function _create( i ) {

  if( exports[i] )
  {
    _createComplex( i )
  }
  else
  {
    exports[i] = { _basic: true }
    _createBasic(i)
  }

}

function _createWhile (i, m) {
  return function(e) {
    var parent = e.target
      , base, events
    while (parent) {
      base = parent.base
      if (base) {
        events = base.events
        if (events[i]) {
          if (m) {
            exports[i]._m.call(base, e, events[i])
          } else if (events[i]._val) {
            events[i]._val.call(base, e)
          }
          if (e.prevent) return
        }
        events = base.__e
        if (events && events[i]) {

          for (var j in events[i]) {
            if(j!=='_uid') {
              if (m) {
                exports[i]._m.call(base, e, events[i][j])
              } else {
                events[i][j].call(base, e)
              }
              if (e.prevent) return
            }
          }
        }
      }
      parent = parent.parentNode
    }
  }
}

function _createBasic (i, r) {
  var type = i || r
  exports._r[i] = true
  if(type === 'scroll') {
    document.addEventListener(type, function(e){
      var base = e.srcElement.base
        , events
      if(base) {
        events = base.events
        if(events && events[i]) events[i]._val.call(base, e)
        events = base.__e
        if (events && events[i]) {
          for (var j in events[i]) {
            if(j!=='_uid') events[i][j].call(base, e)
          }
        }
      }
    },true)
  }else document.addEventListener(type, (exports[i].m = _createWhile(i)))
}

function _setComplex (i, m, r) {
  var met = exports[i]._m = function (e, val) {
    if (e.prevent) return
    m.call(this, e, (val._val || val.val || val), val)
  }
  exports[i].m = _createWhile(i, true)
  exports._r[i] = true
  if (exports[r]) {
    if (!exports[r].m) {
      _create(r)
    }
    if (!exports[r]._basic) {
      exports[i].__e = exports[r].__e
      exports[i]._m = function (e, m) {
        exports[r]._m.call(this, e, function(e) {
          met.call(this, e, m)
        })
      }
    } else {
      exports[i].__e = r
    }
  }
  document.addEventListener((exports[r] && exports[r].__e) || r, exports[i].m)
}

function _createComplex (field) {
  if (exports[field].create) exports[field].create()
  var m
    , i
    , j
  for (i in exports[field]) {
    if (cases[i] === true) m = exports[field][i]
  }
  if (m || (m = exports[field].val)) {
    for (j in m) //only one
    ;exports[field].__e = j
    if (m[j] === true) {
      exports[field]._basic = true
      _createBasic(field, j)
    } else {
      _setComplex(field, m[j], j)
    }
  }
}

exports._set = function (val, stamp, from, remove, cval, blacklist) {
  var t = this
  val.each(function (i) {
    if (!blacklist || !blacklist[i]) {
      if (this._val === false) {
        if (exports[i]) {
          if (exports[i].remove) exports[i].remove.call(t)
          t.eachInstance(exports[i].remove, val._prop.name)
          this.remove()
        }
      } else {
        if (!(exports[i] && exports[i].m)) _create(i)
        if (exports[i].add) exports[i].add.call(t)
      }
    }
  })
}

element.base.extend(
{ name: 'events'
, set: exports._set
})

util.define(element
, 'addEvent', function(field, fn, id) {
    if (!(exports[field] && exports[field].m)) _create(field)
    var events = this.__e || (this.__e = {})
      , f = events[field] || (events[field] = new FieldStore())

    if (!id) {
      f._uid++
      id = f._uid
    }
    f[id] = fn

    if (exports[field].add) exports[field].add.call(this, id)
    return this
  }
, 'removeEvent', function (field, id, fn) {
    var events = this.__e
      , remove
    if (events) {
      if (field && events[field]) {
        remove = (exports[field] && exports[field].remove)
        if (id) {
          if (events[field][id] && (!fn || events[field][id] === fn)) {
            if (remove) exports[field].remove.call(this, id)
            delete events[field][id]
          }
        } 
        else {
          for (id in events[field]) {
            if (!fn || events[field][id] === fn) {
              if (remove) exports[field].remove.call(this, id)
              delete events[field][id]
            }
          }
        }
        if (util.empty(events[field])) delete events[field]
      } 
      else if (!field) {
        for (field in events) {
          this.removeEvent(field, id, fn)
        }
      }
    }
    if (util.empty(events)) delete this.__e
    return this
  })

require('./basic')
