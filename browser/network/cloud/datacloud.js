module.exports = DataCloud

var timestamp = require('monotonic-timestamp')
  , util = require('../../../util/object')
  , CloudData = require('./data')
  , VObject = require('../../../object')
  , Batch = VObject.new({merge:true})
  , CloudState = VObject.new({merge:true})
    // .inject(
    //    !util.isNode && require('../../../object/localstorage')
    // )
  , makeHash = require('../../../util/hash')
  , batchtime = 20
  , SUBS = 'subs'
  , SETS = 'sets'
  , UNSUBS = 'unsubs'

function DataCloud(){
  var cloud = this
  cloud._joins = {}
  cloud._status = 1

  cloud.on('connect', function(){
    cloud._status++
    cloud._reconnect()
  })

  // console.log('start making state')
  cloud.state = new CloudState
    ( { subs: {map:{}, tree:{}}
      , sets: {map:{}/*, list:[]*/}
      }
    // , { localstorage: 'VC$' }
    )
    // console.log('done making state', JSON.stringify(cloud.state.raw,false,2))


  if(!cloud.state.sets.list) cloud.state.sets.set('list', [])
  // ^^ set met lege array merged niet

  cloud.batch = {maps:{ sets:{}, subs:{}, unsubs:{}}}

  // console.log('------SET C DATA')

  cloud.data = new CloudData({}
    , false //{localstorage:'cloudData'}
    , false, this)

  // console.log('------LOG')


  // console.log(JSON.stringify( cloud.data.raw,false,2))
  // ^^ dit kan door weirde shit in localStorage de constructor laten kappen!

  // cloud.on('incoming::pong', this._clearCache)
  // cloud.on('data', this._clearCache)

  cloud._qTimer = setInterval(function _qTimer(){
   cloud._doBatch()
  }, batchtime)


  // cloud.on('welcome', function onWelcome(){

  // })

  cloud.on('subscribed', function(msg){
    // console.error('>>> Hey Cloud says im subscribed to', msg)
  })

}

DataCloud.prototype.timeSync = function timeSync(){
  // console.log('timeSync!')
  var cloud = this
    , outstamp = Date.now()
  cloud.emit('time', function(cloudstamp){

    var traveltime = Date.now() - outstamp
      , arrival = outstamp + traveltime/2
      , offset = cloudstamp - arrival
    // console.log('timestamp in', traveltime, 'offset', offset)
    if(traveltime < cloud._timeTravel){
      cloud._timeTravel = traveltime
      cloud._timeOffset = offset
    }
    var tries = cloud._timeTries++
    if( traveltime > 75 && tries < 10
     || traveltime > 50 && tries < 5
     || traveltime > 20 && tries < 2
      ){
      cloud.timeSync()
    }
  })
}

DataCloud.prototype.outList = function(label){
  var batch = this.batch
  if(!batch.lists){
    batch.lists = {}
    return batch.lists[label] = []
  } else if(!batch.lists[label]){
    return batch.lists[label] = []
  } else {
    return batch.lists[label]
  }
}

DataCloud.prototype._doBatch = function _doBatch(){
  var cloud = this
    , out = cloud.batch.lists

  if(out) {
    // console.log('EMITTING!',out)
    // if(typeof window !== 'undefined'){
    //   console.log('writing out', JSON.stringify(out).slice(0,50))
    //   console.groupCollapsed()
    //   console.log(JSON.stringify(out,false,2))
    //   console.groupEnd()
    // }
    cloud.emit('batch', out)
    // cloud.write(out)
    // cache sets untill next heartbeat
    // var setslist = out.sets
    // if(setslist) {
    //   var cache = cloud.state.sets
    //     , setsmap = cloud.batch.maps.sets

    //   for(var hash in setsmap) {
    //     var update = setsmap[hash].update
    //     if(update[1] === null)
    //       update[1] = '$$null'
    //     storeSet(hash, update, cache.list, cache.map)
    //   }
    // }
    cloud.batch.lists = null
    cloud.batch.maps = {subs:{}, sets:{}, unsubs:{}}
  }
}

DataCloud.prototype._clearCache = function _clearCache() {
  // if(this.state.sets.list.length){
  //   this.state.sets.remove()
  //   this.state.set('sets', {map:{},list:[]})
  // }
  // could be nicer if we have a good way of clearing arrays
}

DataCloud.prototype.subscribe = function subscribe(subsobj, str) {
  // console.log('subscribe!', str)
  var cloud = this
    , state = cloud.state
    , hash
    , cached

  if(subsobj.hash && subsobj.subsobj) {
    // console.log('das cached!')
    hash = subsobj.hash
    cached = subsobj
  }else{
    if (!str)
      str = JSON.stringify(subsobj)
    hash = makeHash(str)
    cached = state.subs.map[hash]
  }
  // console.log('hash', hash)


  if(!cached) { // place in tree

    // console.log('set active!')

    state.subs.map.set(hash,
      { hash: hash
      , subsobj: subsobj
      , active: cloud._status
      , cleared: false
      }
    )
    cached = state.subs.map[hash]
    var tree = state.subs.tree
    insertLeaf(tree, cached.subsobj, cached)
  } else if(!cached.active || cached.active._val){
    // console.warn('subscription already active!', cached, cached.active)
    return
  } else {
    cached.active.val = cloud._status
  }

  var unsubsmap = cloud.batch.maps.unsubs
    , unsubindex = unsubsmap[hash]

  if(unsubindex !== void 0){
    cloud.cancel(hash, unsubindex, UNSUBS)
    return
  }

  var subslist = cloud.outList(SUBS)
    , subsmap = cloud.batch.maps.subs
    , out

  if(!cached.cleared._val) {
    cached.cleared.val = cloud._status
    var depends = cloud.getDeps(state.subs.tree, cached.subsobj, cached, {})
    if(!util.empty(depends))
      out =
        { $subsobj: cached.subsobj.raw
        , $depends: depends
        }
    else
      out = cached.subsobj.raw
  } else {
    out = cached.subsobj.raw
    cached.cleared.val = cloud._status
  }

  subsmap[hash] = subslist.length
  subslist.push(out)
}

DataCloud.prototype.getDeps = function getDeps(tree, walker, cached, list) {
  walker.each(function(f){
    var branch = tree[f]
    if(branch){
      if(branch._subs){
        branch._subs.each(function(i){
          var found = this._val
          if( found.subsobj._v
           && found.hash._val !== cached.hash._val
           && !found.cleared._val
           && !list[found.hash._val]
            ){
            found.cleared.val = cached.cleared._val
            list[found.hash._val] = found.subsobj.raw
          }
        })
      }
      getDeps(branch, walker[f], cached, list)
    }
  })
  return list
}

DataCloud.prototype.unsubscribe = function unsubscribe(subsobj, str) {
  // still do
  var cloud = this

  if(subsobj instanceof Array){
    // console.log('unsub with array', subsobj)
    var tree = cloud.state.subs.tree
      , spot = tree.get(subsobj)

    if(spot){
      // console.log('OK UNSUBSCRIBE TO THIS CRAP', spot)
      recurUnsub(cloud, spot, str)
    }
  }else{


    var batchmap = cloud.batch.maps.subs
      , hash, cached


    if(subsobj.hash) {
      hash = subsobj.hash.val
      cached = subsobj
    } else {
      if (!str)
        str = JSON.stringify(subsobj)
      hash = makeHash(str)

      var statemap = cloud.state.subs.map
        , cached = statemap[hash]
    }

    var index = batchmap[hash]

    if(index !== void 0) {
      cloud.cancel(hash, index, SUBS)

    } else {
      var list = cloud.outList('unsubs')
      cloud.batch.maps.unsubs[hash] = list.length
      list.push(hash)
    }

    cached.active.val = false
  }



}

function recurUnsub(cloud, spot, clear){
  // console.log('recurUnsub!', spot._path)
  spot.each(function(f){
    if(this._subs){
      this._subs.each(function(){
        // console.log('unsub on this!', this.raw, 'clear?', clear)
        if(clear && this.from.subsobj._v)
          this.from.subsobj._v.remove()
        cloud.unsubscribe(this.from)
      })
    }
    if(f !== '_subs')
      recurUnsub(cloud, this, clear)
  })
}

DataCloud.prototype.cancel = function cancel(hash, index, label) {
  var batch = this.batch
    , list = batch.lists[label]
  removeIndex(list, index)
  if(!list.length){
    delete batch.lists[label]
    if(util.empty(batch.lists))
      delete batch.lists
  }
  var map = batch.maps[label]
  delete map[hash]
  for(hash in map)
    if(map[hash] > index)
      map[hash]--
}

DataCloud.prototype.set = function set(hash, update) {
  var cloud = this
    , list = cloud.outList(SETS)
    , map = cloud.batch.maps.sets

  storeSet(hash, update, list, map)
}

function storeSet(hash, update, list, map){
  // console.log('storeset?!')
  var V = list.__t
    , stored = map[hash]

  if(stored){
    var val = update[1]
      , ts = update[2]
      , oldval = stored.update[1]

    if(V) oldval = oldval.raw

    if( val instanceof Object && oldval instanceof Object
     && !(val.$t && val.$path) && !(oldval.$t && oldval.$path)
      ){
      if(!V) oldval = util.clone(oldval)
      val = util.merge(oldval, val)
    }

    if(V) {
      stored.update.set(1, val)
      stored.update.set(2, ts)
    }else{
      stored.update[1] = val
      stored.update[2] = ts
    }

    if(!V){
      var i = stored.i
        , end = list.length-1
      if(i !== end){
        moveToEnd(list, i)
        for(var hash in map){
          if(map[hash].i >= i) map[hash].i--
        }
        stored.i = end
      }
    }
  }else{
    var setobj =
      { update: update
      , i: list.length
      }
    if(V)
      map.set(hash, setobj)
    else
      map[hash] = setobj

    stored = map[hash]
    list.push(stored.update)
  }
}

DataCloud.prototype._reconnect = function _reconnect() {

  // console.log('(RE)CONNECT!')

  var cloud = this
    , state = cloud.state
    // , sets = state.sets.list.raw
    , subs = state.subs.map


  cloud._timeTries = 0
  cloud._timeTravel = Infinity
  cloud.timeSync()


  // clean data
  cloud.stamp = 'cleanup'
  if(cloud.data.rooms)
    cloud.data.set('rooms', {clear:true}, void 0, cloud.stamp)
  if(cloud.data.clients)
    cloud.data.set('clients', {clear:true}, void 0, cloud.stamp)

  // clean subscriptions
  cloud.unsubscribe(['rooms'], true)
  cloud.unsubscribe(['clients'], true)

  // if(sets.length){
  //   sets.sort(byTs)
  //   for(var i = 0, set ; set = sets[i++];){
  //     if(set[1] === '$$null')
  //       set[1] = null
  //   }
  //   cloud.write({sets:sets})
  //   // would be nicer to insert them into current batch
  // }

  var resubs = []
  subs.each(function(f){
    // console.log('resub?', f)
    var cached = this
      , active = cached.active
      , cleared = cached.cleared

      if(active._val === 1) {
        active.val = true
        cleared.val = true
      } else if(active._val){
        // active._val = false

        active.val = false
        //dit wordt niet in ls opgelsagen

        if(cleared._val === 1)
          cleared.val = true
        else if(cleared._val)
          cleared.val = false
        resubs.push(cached)
      }else if(cleared._val){
        if(cleared._val === 1)
          cleared.val = true
        else
          cleared.val = false
      }

  })
  for(var i = 0, resub; resub = resubs[i] ; i++){
    // console.error('resubscribe!!', resub.subsobj.raw)
    cloud.subscribe(resub)
  }
  // console.error('done resubscribin')


  for(var j in cloud._joins){
    cloud.join(cloud._joins[j], true)
  }

}

DataCloud.prototype.timeStamp = function(){
  var ts = timestamp()
  if(this._timeOffset)
    ts += this._timeOffset
  return ts
}

function insertLeaf(tree, subsobj, cached){
  subsobj.each(function(f) {
    if(f === '*') {
      if(!tree.$)
        tree.set('$',{})
      subsobj['*'].each(function(s){
        subsobj['*'][s][1].each(function(ss){
          insertLeaf(tree.$, subsobj['*'][s][1][ss], cached)
        })
      })
      return
    }
    if(!tree[f])
      tree.set(f, {})
    if(subsobj[f].val === true){
      if(!tree[f]._subs)
        tree[f].set('_subs', [cached])
      else
        tree[f]._subs.push(cached)
    }else{
      insertLeaf(tree[f], subsobj[f], cached)
    }
  })
}

function moveToEnd(arr, i){
  var tmp = arr[i]
  while(arr[i+1])
    arr[i] = arr[++i]
  arr[i] = tmp
}

function removeIndex(arr, i){
  while(arr[i+1])
    arr[i] = arr[++i]
  arr.pop()
}

function byTs(a, b){
  return a[2] - b[2]
}
