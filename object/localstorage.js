/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var util = require('../util')
  , hash = require('../util/hash')
  , vObject = require('./')
  , localStorage = window.localStorage
  , topLevel

function hasLocalstorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null
  } catch (e) {
    return false
  }
}

//moet ook ff gefixed!

function quota() {
  var ret
  try {
    localStorage.setItem('QUOTA_TEST','quota')
    localStorage.removeItem('QUOTA_TEST')
  } catch(e) {
    ret = true
  }
  return ret
}

function privateBrowsing() {
  var ret
  if(quota()) {
    localStorage.clear()
    ret = quota()
  } 
  return ret
}

var setItem = localStorage.setItem

exports.extend = util.extend( function(Class) {

  if(!hasLocalstorage() || privateBrowsing()) {
    //or small quota
    console.log('no localstorage')
    return;
  } else if(quota()) {
    console.log('reached ls quota -- clear it')
    var token = localStorage.getItem('userToken')
    localStorage.clear()
    if(token) localStorage.set('userToken',token)
  }
  //if node or not localstorage return Class

  var _proto = Class.prototype
  , _hook = _proto._hook
  , _remove = _proto._remove
  , _set =  _proto._set
  , set = _proto.set
  , rSet = vObject.set
  , _cVobj = _proto._changevobj
  , lsStamp = 'localStorage'

  if(!topLevel) topLevel = new vObject({})

  _proto._blacklist
    .push('_ls','_lsstruct','_restruct','_topls', '$$t', '$$path', '_lsparsed','_structStamp')

  setT4 = function(lsItem) {
   var a = lsItem.$$path
     , b = lsItem.$$path[0]
    a.shift()
    lsItem = a.length===0 
      ? topLevel[b].from 
      : topLevel[b].from.path(a)

    if(!lsItem) {
      if(a.length===0) {
        lsItem = topLevel[b].from
      } else {
        lsItem = topLevel[b].from.path(a,{},true,null,null,lsStamp)
      }
    }
    return lsItem
  }
 
  util.define(Class,
  '_hook',function(val, settings) {
     var localstorage = settings.localstorage
     delete settings.localstorage
     if(localstorage) {
      this._ls = localstorage
      var lss = JSON.parse(localStorage.getItem('$'+localstorage))
      if(!(lss instanceof Object)) lss = false
      this._lsstruct = lss
      if(lss) { rSet.call(this,lss,lsStamp,false,true) }
     }
     if (_hook) _hook.call(this, val, settings)
  },
 'localstorage', function(name) {
    if(!name&&!this._path.length) return this.ls
    var ret = hash( 
        this.ls
      + (this._path.length ? '.'+this._path.join('.') : '')
      + (name!==void 0 ? '.'+name : '')
    )
    return ret
  },
  'saveStruct', function() {
    //never gets here!
   var struct = this._lsstruct = this.__t === 1 ? [] : {}
    for(var i in this) {
      if(!util.checkArray(this._class.prototype._blacklist,i) && i!=='val') {
        struct[i] = this[i].__t === 1 ? [] : {}
      }
    }
     console.log('saveStruct',this._path, JSON.stringify(struct))
    localStorage.setItem('$'+this.localstorage(), JSON.stringify(struct))
    if(this._parent && !this._parent._lsstruct) this._parent.saveStruct()
  },
  'topls', {
    get:function() {
      if(!this._topls) this._topls = this.checkParent('_ls')
      return this._topls
    }
  },
  'ls',{
    get:function() {
      if(!this._ls && this.topls) {
        this._ls = this.topls._ls
        if(this._ls && !topLevel[this._ls]) topLevel.set(this._ls,this.topls)
      }
      return this._ls
    }
  },
  'set', function(name, val, vobj, stamp, noupdate, from) {

    if(!stamp) stamp = this.stamp() //take care of false
    
    if(!this[name] && stamp !== lsStamp && this.ls && name!=='val') { //false for gets 
      //name === 'val -- would be rly strange...'

      var ls = this.localstorage() //cache it! 
      if(!this._lsstruct) {
        this._lsstruct = this.__t === 1 ? [] : {}
      }

      // if( val instanceof Object 
      //   && !(val instanceof vObject) 
      //   && !util.empty(val)) {
      //    var empty = val instanceof Array ? [] : {}
      //    for(var i in val) {
      //      if(i!=='val') empty[i] = val[i] instanceof Array ? [] : {}
      //    }

      //     // if(this[name])

      //     // if(this.ls==='cloudData') console.log('VAL SET', this._path, name, JSON.stringify(empty))
      //     // if(this.ls==='cloudData') console.log('VAL SET -- higher up', this._path, name, JSON.stringify(empty))

      //    localStorage.setItem(
      //     '$'+this.localstorage(name)
      //     , JSON.stringify(empty)
      //     )
      //    // this._structStamp = stamp
      // } 

      
        
      if(!this._parent || !this._lsstruct[name] ) { //heeft al show --- 

        this._lsstruct[name] = val instanceof Array ? [] : {}
     
        if(this._parent && !this._parent._lsstruct) this._parent.saveStruct()

          // if(name==16 && this.ls==='cloudData') console.log('NORMAL SET',this._path, name, JSON.stringify(this._lsstruct))
          // if(this._name && this._name == 16 && this.ls==='cloudData') console.log('NORMAL SET -- higher up',this._path, name, JSON.stringify(this._lsstruct))

          localStorage.setItem('$'+ls, JSON.stringify(this._lsstruct))
        }
    }
    return set.apply(this,arguments)
  },
  '_remove', function(nested, bl, not, from, stamp) {
    if(!this._parent) {
      localStorage.removeItem(this.ls)
      localStorage.removeItem('$'+this.ls)
      topLevel[this.ls].remove()
    } else if(this._parent._lsstruct) {
      var ls = this.localstorage()
      localStorage.removeItem(ls)
      localStorage.removeItem('$'+ls)
      delete this._parent._lsstruct[this._name]

      console.log(this._parent._lsstruct)

      localStorage.setItem
      ( '$'+this._parent.localstorage()
      , JSON.stringify(this._parent._lsstruct)
      )
    }
    _remove.apply(this,arguments)
  },
  '_changevobj', function(val,stamp) {
      if(stamp !== lsStamp)  {
        localStorage.removeItem(this.localstorage())
      }
     _cVobj.apply(this,arguments)
  },
  '_set', function(val, stamp) {

    var ls = this.localstorage() //cahce dit 
    if(ls && this.ls) {
      var lsItem
        , lsStruct
        , obj
        , setIt

      if(stamp!==lsStamp) {
        if(this.__t===3) {
          localStorage.setItem(ls, this._val);
        } else if(this.__t===4) {
          if(this.from.ls) {
            obj = 
            { $$path:[this.from.ls].concat(this.from._path)
            , $$t:4 
            }
            localStorage.setItem(ls, JSON.stringify(obj))
          }
        } 
      } else if(!this._lsparsed && this._path.length) {
        
        lsItem=localStorage.getItem(ls)
        lsStruct=localStorage.getItem('$'+ls)

        if(lsItem || lsItem === '') {
          setIt = true
          if(lsItem.indexOf('"$$t"')>0 && lsItem.indexOf('"$$path"')>0) {
            lsItem =JSON.parse(lsItem)
            if(!topLevel[lsItem.$$path[0]]) {
              var t = this
              topLevel.addListener(function listener(val, stamp, from) {
                if(from && from._name === lsItem.$$path[0]) {
                  topLevel.removeListener(listener)
                  rSet.call( t, setT4.call(t,lsItem), lsStamp)
                }
              })
            } else {
              lsItem = setT4.call(this,lsItem)
            } 
          } else {
            var number = Number(lsItem)
            if(lsItem==='') {

            } else if(!isNaN(number)) {
              lsItem = number
            } else if(lsItem==='null') {
              lsItem = null
            } else if(lsItem==='false') {
              lsItem = false
            } else if(lsItem==='true') {
              lsItem = true
            } else if(lsItem==='undefined') {
              lsItem = void 0
            }
          }
        }

        if(setIt && !lsStruct) {
          rSet.call(this, lsItem, lsStamp)
        } else if(lsStruct) {
          lsStruct = JSON.parse(lsStruct)
          this._lsstruct = lsStruct
          if(setIt) {
            lsStruct.val = lsItem
          }
          this._lsparsed = true
          rSet.call(this, lsStruct, lsStamp)  
        }

      }
    }
    this._lsparsed = true
    return _set.apply(this,arguments)
  })     

})  