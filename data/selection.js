/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Marcus Besjes, marcus@vigour.io
 */

var conditions = require('./conditions')
  , utilHash = require('../util/hash')
  , VObject = require('../object')
  , util = require('../util')

/**
 * Selection
 * Class extention for selection / filtering functionality
 * @Class
 */

exports.SubsObj = VObject.new()
exports.SubsObj.prototype._blacklist.push( '_root'
                                         , '_check'
                                         , '_sort'
                                         , '_uid'
                                         )

exports.extend = util.extend(function(base){

  base.prototype._blacklist.push( '_filter'
                              , '_uid'
                              , '_hash'
                              , '_indexCache'
                              , '_subscnt'
                              )

  var _update = base.prototype._update
    , _hook = base.prototype._hook
    , _remove = base.prototype.remove

  util.define( base
    , 'remove', function() {
        var l
        if(this._filter && (l = this.length)){
          for(var i = 0; i < l; i++)
            delete this[i]
        }
        return _remove.apply(this, arguments)
      }
    , 'filter', {
        get: function() {
          return this._filter
        },
        set: function(val) {
          // console.log('new filter \n from --->', this._filter, '\n to ---->'
          //            , val
          //            )
          this._filter = val //moet ook werken als data nog geen selection is
          this._build(undefined, true)
          _update.call( this, void 0, this.stamp(), void 0, false
                      , false, void 0
                      )
        }
      }
    , '_hook', function(val, filter) {
        if (_hook) {
          _hook.call(this, val, filter)
        }
        if (!util.empty(filter) && val) {
          var selection = this
          selection._subscnt = 0
          selection._filter = filter

          selection._hash = utilHash(val._path + JSON.stringify(
            [ filter.condition
            , filter.range
            , filter.sort
            ])
          )
          //!only nessecary serverside!
          if (!selection._uid) selection._uid = selection._hash
        };
      }
    , '_build', function(val, noupdate) {
        var selection = this
        
        if (!val) val = selection._val
        if(!val) return
        if (selection.length) selection._clear() 

        var list = []
          , itemsHandler = this._itemsHandler
          , filter = selection._filter
          , subsObj = filter.subsObj || new exports.SubsObj({}, selection)
          , stamp = this.stamp()
          , sort, item

        if (val.__t === 4 && !val._filter) {
          val = val.from;
        }

        if (filter.sort) {
          if (typeof filter.sort === 'string') {
            filter.sort = {
              field: filter.sort
            }
          }
          sort = filter.sort
          if (!sort.fn) {
            if (!sort.type) sort.type = 'string'
            sort.fn = sortMakers[sort.type](sort)
          }
          subsObj.path(sort.field.split('.'), {}).set('_sort', true)
        }
        // console.log('building?!')
        if (filter.condition) {
          // console.log('found condition', filter.condition)
          var pcnt = 0
            , rcnt = 0
          var check = filter.check 
                 || ( filter.check = conditions( filter.condition
                                               , subsObj
                                               )
                    )
          filter.subsObj = subsObj
          val.each(function(f) {
            item = this
            if (itemsHandler) itemsHandler(item, subsObj, selection)
            if (check(item)) {
              pcnt++
              list.push(item)
            } else if (selection._has(item) !== void 0) {
              // console.log('-------- > removed from selection by condition:'
              //             , item.raw
              //             )
              unstoreIndex(item, selection)
              if(!noupdate){
                _update.call(selection, item, stamp, selection, item, false, null)
              }
              rcnt++
            } else { 
              rcnt++
            }
          })
          // console.log('ran condition: passed:', pcnt, 'rejects:', rcnt)
        } else {
          val.each(function() {
            if (itemsHandler) itemsHandler(this, subsObj, selection)
            list.push(this)
          })
        }

        filter.subsObj = subsObj

        if (sort && list.length > 1) {
          list.sort(filter.sort.fn)
        }

        var i, item

        var range = filter.range
        if (range) {
          if (!(range instanceof Array)) {
            range = filter.range = [0, filter.range]
          }
          if (list.length) {
            var newlist = list.splice(range[0], range[1])
            for (i = list.length; item = list[--i];) {
              if(selection._has(item) !== void 0){
                unstoreIndex(item, selection)
                // if(!noupdate){
                //   _update.call(selection, item, stamp, selection, item, false
                //               , null
                //               )
                // }
                
              }
            }
            list = newlist
          }
        }

        for (var i = list.length, item; item = list[--i];) {
          selection[i] = item
          var isnew = selection._has(item) === void 0
          storeIndex(item, selection, i)
          // if (isnew) {
          //   if(!noupdate){
          //     console.log('doing update wickeds')
          //     _update.call(selection, item, stamp, selection, false, item, null)  
          //   }
          // }
        }
        selection.length = list.length
      }
    , '_update', function(val, stamp, from, remove, added, oldval) {




        if (this._filter) {
           // if(window.here) console.log('hups _update on selection!')


          var selection = this
            , upath = selection.updatePath

          if (upath[0] !== void 0) {
            var shortpath = upath.length === 1
              , itemremove = shortpath && remove
              , item = itemremove ? selection._lfrom : selection.val[upath[0]]
              , relevant

            if (selection._val._filter) {
              if (selection._val._has(item) === void 0) {
                if (selection._has(item) !== void 0) {
                  selection._checkItem(item, false, val, stamp)
                }
                return
              }
            }
            var hint = itemremove ? false : (shortpath && added) ? void 0 : upath

            if (selection._checkItem(item, hint, val, stamp) === true) {
              _update.apply(selection, arguments)
            }
          } else {
            // console.log('hit on selection itself?!')
            if (!from) {
              // console.log('\n>>>>>> hit on selection itself (V.Data)')
              if (remove) {
                if (selection.length) selection._clear()              
              }else{
                selection._build()
              }
            }
            _update.apply(this, arguments)
          }
        } else {
                     // if(window.here) console.log('hups _update on selection!',this)

           // console.log('SELECT', this, arguments, this._path)

          _update.apply(this, arguments)
        }
      }
    , '_has', function(item) {
        var indexCache = item._indexCache
          , uid = this._uid
          , ic

        if (indexCache && uid && (ic = indexCache[uid])) {
          return ic[0]
        }
      }
    , '_clear', function() {
        var self = this
        self.each(function(f) {
          self[f] = void 0
          delete self[f]
        })
        self.length = 0
      }
    , '_checkItem', function(item, hint, val, stamp) {
        if(!item) { return }
        // console.log('_checkItem!', item.raw, hint)
        var selection = this
          , from = item
          , filter = selection._filter
          , sort = filter.sort
          , range = filter.range
          , ranged = range && !(  range[0] === 0 
                               && range[1] >= selection._val.length 
                               || selection.length < range[1] - range[0]
                               )
          , removed = hint === false || item._removed
          , added, index, isin
          , result = isin = (index = selection._has(item)) !== void 0

        var check = filter.check
          , pass = removed 
                   ? false 
                   : (!ranged && hint === 1) 
                     ? isin 
                     : !check || check(item)

        // console.log('================ checkitem in', selection._path)             
        // console.log('isin', isin, 'pass', pass, 'result', result)
        // console.log('---------- checked item', pass)
        // console.log('removed?', removed)
        // console.log('ranged? (pass == already in)', (!ranged && hint === 1), isin)
        // console.log('ok time for checking', check)
        // console.log('conditions', filter.condition)
        // console.log('check?', check && check(item))
        // console.log('----------')
        
        if (isin !== pass) {
          if (isin) {
            result = 1
            unstoreIndex(item, selection)
            removed = item
            var mark
            while (mark = selection[++index]) {
              selection[index - 1] = mark
              storeIndex(mark, selection, index - 1)
            }

            var end = index - 1
            selection[end] = null
            delete selection[end]

            var replacement
            if (ranged) {
              if (sort) {
                selection._val.each(function() {
                  if (  selection._has(this) === void 0 
                     && (!selection[end] || sort.fn(this, selection[end]) < 0) 
                     && (!check || check(this))
                     ) {
                    replacement = selection[end] = this
                  }
                })
              } else {
                selection._val.each(function() {
                  if ( selection._has(this) === void 0 
                     && (!check || check(this))
                     ) {
                    return replacement = selection[end] = this
                  }
                })
              }
            }
            if (!replacement) {
              selection.length--
            } else {
              storeIndex(replacement, selection, index - 1)
              added = replacement
            }
          } else {
            var newindex
            if (sort) {
              var sortfn = sort.fn
              if (selection.length) {
                selection.each(function(f) {
                  if (sortfn(item, this) < 0) {
                    return newindex = f
                  }
                })
              }
              if (newindex !== void 0) {
                result = 1
                newindex = Number(newindex)
                storeIndex(item, selection, newindex)
                added = item
                if (ranged) {
                  removed = selection[selection.length - 1]
                  unstoreIndex(removed, selection)
                } else {
                  this.length++
                }
                var index = selection.length - 2
                while (index >= newindex) {
                  storeIndex(selection[index], selection, index + 1)
                  selection[index + 1] = selection[index--]
                }
                selection[newindex] = item
              } else if (!ranged) {
                result = 1
                newindex = selection.length++
                selection[newindex] = item
                storeIndex(item, selection, newindex)
                added = item
              }
            } else if (!ranged) {
              result = 1
              newindex = selection.length++
              selection[newindex] = item
              storeIndex(item, selection, newindex)
              added = item
            }
          }
        } else if (isin && sort) {
          // console.log('isin + sort! resort?')
          if (hint.length && sort.field) {
            if (~sort.field.indexOf('.')) {
              var sortpath = sort.field.split('.')
              if (!util.compareArrays(hint.slice(1), sortpath)) {
                return result
              }
            } else {
              if (hint[1] !== sort.field) return result
            }
          }

          var newindex
          selection.each(function(f) {
            if (f != index) {
              var s = sort.fn(item, this)
              if (s === -1) {
                if (f == index + 1) return true
                newindex = f < index ? f : f - 1
                return true
              } else if (f >= index + 1 && s === 0) {
                return true
              } else if (f > index) {
                newindex = f
              }
            }
          });
          // console.log('newindex', newindex)
          if (newindex !== void 0) {
            result = 1
            var tmp
            if (index > newindex) {
              while (index > newindex) {
                tmp = selection[index] = selection[--index]
                if (tmp) storeIndex(tmp, selection, index + 1)
              }
            } else {
              while (index < newindex) {
                tmp = selection[index] = selection[++index]
                if (tmp) storeIndex(tmp, selection, index - 1)
              }
            }
            selection[newindex] = item
          }

          var end = selection.length - 1

          if (  ranged 
             && (newindex == end || newindex === void 0 
             && index == end)
             ) {
            var replaced
            selection._val.each(function() {
              if (  selection._has(this) === void 0 
                 && sort.fn(this, item) === -1 
                 && (!check || check(this))
                 ) {
                if (!replaced) replaced = item
                selection[end] = item = this
              }
            })
            storeIndex(item, selection, end)
            if (replaced) {
              unstoreIndex(replaced, selection)
              removed = replaced
              added = item
              result = 1
            }
          } else if (newindex !== void 0) {
            storeIndex(item, selection, Number(newindex))
          }

        }
        if (result === 1) {
          // console.log('update from _checkItem!')
          selection.__update(val, stamp, from, removed, added)
        }
        return result
      }
    )

})

var storeIndex = exports.storeIndex = function(item, selection, index) {
  // console.log('storeIndex! item', item._name, '@', index)
  var indexCache = item._indexCache
    , ic
  if (indexCache) {
    ic = indexCache[selection._uid]
    if (ic) {
      ic[1] = ic[0]
      ic[0] = index
    } else {
      indexCache[selection._uid] = [index]
    }
  } else {
    item._indexCache = {}
    item._indexCache[selection._uid] = [index]
  }
}

var unstoreIndex = exports.unstoreIndex = function(item, selection) {
  var indexCache = item._indexCache
  if (indexCache) {
    var ic = indexCache[selection._uid]
    ic[1] = ic[0]
    ic[0] = void 0
  }
}

var sortMakers = {
  number: function(sort) {
    var field = sort.field
    return function(a, b) {
      var va = a[field] && a[field].val
        , vb = b[field] && b[field].val
      if (va === void 0 || vb === void 0) {
        return va === vb 
               ? 0 
               : va === void 0 
                 ? 1 
                 : -1
      }
      return sort.order 
             ? (va - vb) * -1 
             : va - vb
    }
  },
  string: function(sort) {
    var field = sort.field
    if (~field.indexOf('.')) {
      var path = field.split('.')
      return function(a, b) {
        a = getDotFieldVal(a, path)
        b = getDotFieldVal(b, path)
        if (a === void 0 || b === void 0) {
          return a === b 
                 ? 0 
                 : a === void 0 
                   ? 1 
                   : -1
        }
        var re = a > b 
                 ? 1 
                 : a === b 
                   ? 0 
                   : -1
        return sort.order ? re * -1 : re
      }
    } else {
      return function(a, b) {
        a = getFieldVal(a, field)
        b = getFieldVal(b, field)
        var weakA = a === void 0 || a === null
          , weakB = b === void 0 || b === null
        if (weakA || weakB) {
          return a === b ? 0 : weakA ? 1 : -1
        }
        var re = a > b 
                 ? 1 
                 : a === b 
                   ? 0 
                   : -1
        return sort.order ? re * -1 : re
      }
    }
  }
}

function getFieldVal(obj, field) {
  var v = obj.val
  return v && v[field] && v[field].val
}

function getDotFieldVal(obj, field) {
  var v = obj.path(field)
  return v && v.val
}

function putSort(path) {
  var obj = part = {}
  for (var i = 0, l = path.length; i < l; i++) {
    part = part[path[i]] = {
      _up: part
    }
  }
  part._sort = true
  return obj
}
