/**
 * Creates an object that keeps track of changes, build to perform up to 125000 changes.
 * Can become more generic by having it add layers depending on setup (now its 3 with 50)
*/
var util = require('./')
  , diff = module.exports = function () {
      this.store = [[[]]]
      this.store[0]._state = {}
      this.store[0][0]._state = {}
      this._state = {}
    }
  , smartMerge = function (a, b) {
      var r = false
      for (var i in b) {
        if (util.isObj(b[i]) && util.isObj(a[i])) {
          if (!r) r = smartMerge(a[i], b[i], r)
        } else {
          if (a[i] !== b[i]) {
            a[i] = b[i]
            r = true
          }
        }
      }
      return r
    }

diff.prototype.change = function (change, path, nostore) {
  // console.log('----- change:')
  // console.log(path, change)
  
  if (path) {
    var a = {}
    util.path(a, path, change)
    change = a
  }

  if (!smartMerge(this._state, change)) nostore = true
  clean(this._state)
  if (nostore) return

  var store = this.store
    , index = store.length - 1
    , bindex = store[index].length - 1
    , cindex = store[index][bindex].length - 1
    , stamp = index + '.' + bindex + '.' + (cindex + 1)

  store[index][bindex].push(change)

  util.merge(store[index][bindex]._state, change)

  if (cindex === 48) {
    if (bindex === 49) {
      util.merge(store[index]._state, store[index][bindex]._state)
      store.push([[]])
      store[index + 1]._state = {}
      store[index + 1][0]._state = {}
    } else {
      store[index].push([])
      store[index][bindex + 1]._state = {}
    }
  }
  // console.log('----- stamp:', stamp)
  return this._cstamp = stamp
}

diff.prototype.get = function (stamp) {
  if (stamp === void 0) return this._state
  if (stamp === this._cstamp) return
  
  stamp = stamp.split('.')
  
  var a = Number(stamp[0])
    , b = Number(stamp[1])
    , c = Number(stamp[2])
    , store = this.store

  if (store[a] && store[a][b] && store[a][b][c]) {
    for (var ret = {}, j = c + 1, v = store[a][b].length; j < v; j++) {
      util.merge(ret, store[a][b][j])
    }
    for (var n = b + 1, k = store[a].length; n < k; n++) {
      util.merge(ret, store[a][n]._state)
    }
    for (var i = a + 1, l = store.length; i < l; i++) {
      util.merge(ret, store[i]._state)
    }
    return ret
  } else {
    return this._state
  }
}

function clean(obj){


  // console.log('clean it')

  var val
    , fields = 0
  for(var f in obj){
    fields++
    val = obj[f]
    if(typeof val == 'object'){
      if(clean(val)) {
        delete obj[f]
        fields--
      }
    } else if(val === null) {

      console.log('CLEAN!!!',val,obj[f])

      delete obj[f]
      fields--
    }
  }
  return !fields
}
