/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var flags = module.exports = require('./')
  , value = require('../')
  , util = require('../../util')
  , vObject = require('../../object')


//todo add element signature in from so it can travel trough updates --- if parent (need less funky things)

/**
 * parent
 * parent makes it possible to add listeners to parent properties
 * using multiple parent properties in one property is still very wrong
 * @flag
 */
value.prototype._blacklist.push('_parentStore')

function baseReset(base,name) {
  if(base && base.node) {
    if(name==='x' || name ==='y') base.cleanCoordinates(name)
    if(base[name]) {
      base[name]._prop._vset.call(base[name])
    }
  }
}

//base,vset,t,type,mparent,fbase, v, val, stamp, from, remove, added, oldval, true, firstSkip
function checker(vset, t, type, mparent, fbase, v, val, stamp, from, remove, added, oldval, first, firstSkip, p) {
  if(p&&(this.parent instanceof mparent) ||  (!p && this.parent===mparent) || firstSkip ) {

    var s
      , base = this._from.base.node && this._from.base
      , name = t._prop.name

    t._caller = this

    //gaurd voor changes -- if no change -- do nothing
    vset.call(t, stamp, from, remove, val)

    if(base&&base[name]&&base[name+'__p']!==stamp) {
      t._caller = base
      t._caller[name+'__p'] = stamp
      vset.call(t, stamp, from, remove, val)
      t._caller = this
      s=true
    }

    // console.log(this.node)
    for(var i in t._listeners) {
      if(t._listeners[i].pop && t._listeners[i][2]==='parent') {
        if(t._listeners[i][1]._lstamp===stamp) {
          t._listeners[i][1]._lstamp=null
        }
        t._listeners[i][0].call(t._listeners[i][1], type, this, base, v, val, stamp, from, remove, added, oldval, true)
      }
    }

    //reset this._from.base[t._prop.name]===t
    if(s) baseReset(base, name)

  }
}

function updateHandler(type,mparent,fbase,v, val, stamp, from, remove, added, oldval,firstSkip,inherit) {

  var t = this

  this._parentStore[0] = mparent

  this._update(val, from ? this.stamp() : stamp, from, remove, added, oldval, false, false, function() {
    var vset =  this.checkParent('_prop._vset', true)
      , base = this.checkParent('_base', true)
      , complexParent = true
      , p

    if( (mparent===base.parent && from)  ) {
      p = true
    }

    checker.call(base,vset,t,type,mparent,fbase, v, val, stamp, false, remove, added, oldval, true, firstSkip)

    base.eachInstance(function() {
     checker.call(this, vset, t,type, mparent,fbase, v, val, stamp, false, remove, added, oldval, false, p)
    }, t._prop.name)

    vObject.prototype._update.call(this, val, stamp, false, remove, added, oldval, function(l) {
      return l[2]==='parent'
    })

    if(!inherit && v._caller && mparent!==v._caller) {
      updateHandler.call(this,type,v._caller,fbase, v, val, stamp, false, remove, added, oldval,firstSkip,true)
    }

  })
}

function _parent(parent, noupdate, prop, flag, reset) {

  // console.log('_parent call'.cyan.inverse, flag)

  var _lparent = prop._parentStore[0]
    , pname = flag[2]   //flags.parent.val
    , pprop = parent[pname]
    , fbase = this._from.base
    , newP
    , baseSet

  if (!pprop) return

  // console.log('ADD LISTENER TO PARENT')

  pprop.addListener(
    [ updateHandler
    , prop
    , 'parent'
    , parent
    , this //fbase
  ], function(l,listeners,index) {

    if(l[3]!==parent &&  _lparent!==parent && l[4]!==fbase) {
      prop._parentStore[0] = parent
      l[4] = fbase
      newP = true //hoe deze smart afvangen?
    }
  }, false, true)

  // if(reset) {
  //   for(var i in pprop._listeners) {
  //     if(pprop._listeners[i].pop && pprop._listeners[i][1]===fbase[prop._prop.name]) {
  //       if(pprop!==parent._from.base[pname]) {
  //         pprop._listeners.splice(i,1)
  //         break;
  //       }
  //     }
  //   }
  // }

  if (newP || (!_lparent || (_lparent !== parent && _lparent[pname] !== pprop) ) ) {
    prop._parentStore[0] = parent
    if (!noupdate) {
      prop._caller = (baseSet = fbase.node && fbase || prop._base)
      prop._prop._vset.call(prop, prop)
      prop._caller = this
      updateHandler.call(prop,'parent',parent,fbase,pprop,false,vObject.stamp(),false,false,false,false,true,true)
      baseReset(baseSet,prop._prop.name)
    }
  }
}

function _init(val, flag, reset) {
  var parent = this.parent
  // console.log('try parent', flag, parent)
  if (parent) _parent.call(this, parent, true, val, flag, reset)
}

function _val(val) {
  var parent = this.parent || val.checkParent('_parentStore.0', true)
  //flags.parent.val
  if(parent && !val._flag.parent) {
    console.error('NO PARENT FLAG!')
    return
  }
  // console.log('---->',val._flag.parent[2])
  if (parent ) return parent[val._flag.parent[2]].val
}

flags.parent =
{ reset: true
, useVal: true
, set: function(val, stamp, reset) {
    var current = this.checkParent('_prop.name'),
      name = current._prop.name
    //flags.parent.val
    if(!this._flag) this._flag = {}

      //overwriting previous parent
      //
    // console.log('SET PARENT---->')
    this._flag.parent = ['parent', _val, val, this]
    if (!current._parentStore) current._parentStore = [false]

    // console.log('GOTS PARENTSTORE!', reset, current._parentStore, this._flag.parent)

    current._parentStore.push(this)
    //setParent settings
    // console.log('---> CREATE SETTING'.yellow.inverse)
    current._caller.setSetting({
      name: name,
      parent: function(parent) {

        // console.log('---> SET SETTING'.yellow.inverse)

        for (var store = this[name]._parentStore, i = store ? store.length - 1 : 0; i > 0; i--) {
          if(store[i]._flag.parent) {
            _parent.call(this, parent, false, this[name], store[i]._flag.parent)
          } else {
            console.error('2 NO PARENT FLAG!')
          }
        }
      }
    });
    //try to minimize val calulations
    this._val = _val
    this._skip = true
    //onInit (if it already has some parents)
    _init.call(current._base, current, this._flag.parent, reset)
    //reAttach listeners for instances
    current._base.eachInstance(_init, name, current, this._flag.parent)
  }
, remove: function(flag) {

    // console.log('REMOVE PARENT'.cyan.inverse)

    var current = this.checkParent('_prop.name'),
      base = current._base,
      listens = current._listens,
      name = current._prop.name,
      val = flag[2],  //flags.parent.val
      parentStore = current._parentStore,
      removelistener = function() {
        var parent = this.parent
        if (parent && parent[val]) {
          if (listens.length > 0) {
            if (util.checkArray(listens, parent[val])) {
              // console.log('REMOVE LISTENER!', parent[val], listens.length, parent[val]._listeners.length, parent[val]._listeners , current)


              //more specific only remove if val matches --- store function
              parent[val].removeListener( false, current )

              //mark = false


              // console.log('REMOVE LISTENER! -- result -- no update?', listens.length)

            }
          } else {
            return true
          }
        }
      }

    this._val = 0

    if (listens && !removelistener.call(base)) {
      base.eachInstance(removelistener, name)
    }

    // console.log('PARENTSTORE', parentStore, current)
    parentStore.splice(util.checkArray(parentStore, this, true), 1)

    if (parentStore.length === 1) {
      // console.log('---> REMOVE SETTING'.yellow.inverse, parentStore)
      base.removeSetting(name, 'parent') //ff corigeren voor andere parent settings!!! op andere fields
      //dit maakt het helemaal kapot!
      // console.warn('REMOVE PARENTSTORE!')
      current._parentStore = null
    }
  }
}