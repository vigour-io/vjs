module.exports = RecordCloud

var timestamp = require('monotonic-timestamp')
  , util = require('../../../util/object')
  , match = require('../../../util/match')
  , makeHash = require('../../../util/hash')

function RecordCloud(){
  this.record = new Record(this)
  this.record.addEntry('outgoing',{event:'connect', data:true})
}


RecordCloud.prototype.timedEmit = function timedEmit(out){
  var cloud = this
    , emit = out.emit
  setTimeout(function(){
    // console.log('timedEmit!!'
    //   // , emit
    //   )
    cloud.emit(emit.event, emit.data, emit.ack)
    if(out.onEmitted)
      out.onEmitted(out)
    if(cloud.emitted)
      cloud.emitted.push(out)
  }, out.time)
}

function Record(cloud){
  var record = this
  record.cloud = cloud
  cloud.recordings = record.recordings = {_active:{}}

  var socket = cloud.socket

  var _onevent = socket.onevent
  socket.onevent = function(packet){
    record.addEntry('incoming', packet.data)
    // console.log('burk incoming',packet.data)
    if(record.playing && !ignored(packet.data)){
      // console.log('resolve incoming!')
      
      if( record.resolve(util.clone(packet.data))
       && record.playing.waitingfor.length === 0
        )
        record.playBack()
      else{
        // console.error('not done still waiting for'
        //   , record.playing.waitingfor.length
        //   // , record.playing.waitingfor
        // )
      }
        
    }
      
    _onevent.apply(this, arguments)
  }

  var _emit = cloud.emit
  cloud.emit = function(event, data){
    if(event !== 'time')
      record.addEntry('outgoing', {event: event, data: data})
    _emit.apply(this, arguments)
  }

  cloud.on('connect', function(){
    record.addEntry('incoming', ['connect', true])
  })

  record.start('init')

}

Record.prototype.addEntry = function addEntry(type, entry){
  var record = this

  for(var r in record.recordings._active){

      var recording = record.recordings._active[r]
      if( recording.filter 
       && recording.filter.outgoing 
       && recording.filter.outgoing(entry) === false
       )
        continue

      recording[type][timestamp()] = util.clone(entry)
    }
}

Record.prototype.start = function start(label, filter){
  var date = new Date().toString()
  if(!label)
    label = date

  var recordings = this.recordings

  if(recordings[label])
    console.warn('already have recording', label)

  var recording = recordings[label] = recordings._active[label] = 
    { label: label
    , incoming: {}
    , outgoing: {}
    , filter: filter
    , startdate: date
    , start: Date.now()
    }

  var cloud = this.cloud
  cloud.whenReady(function(){
    recording.clientid = cloud.clientid
  })

}

Record.prototype.stop = function stop(label){
  var recordings = this.recordings
    , now = Date.now()
  if(label){
    if(!recordings[label])
      console.error('no such recording', label)
    else if(!recordings._active[label])
      console.error('already stopped recording', label)
    else
      delete recordings._active[label]
  }else{
    recordings._active = {}
  }
}

Record.prototype.play = function play(recording, options){

  // console.log('play recurding!')

  if(typeof recording === 'string')
    recording = record.recordings[recording]

  var record = this
    , list = []

  for(var o in recording.outgoing){
    list.push({type:'outgoing', ts: Number(o), msg:recording.outgoing[o]})
  }
  for(var i in recording.incoming){
    list.push({type:'incoming', ts: Number(i), msg:recording.incoming[i]})
  }

  list.sort(byTs)
  record.playing = 
    { playlist: list
    , at: 0
    , ts: list[0].ts
    , waitingfor: []
    , unresolved: []
    , done: options.done
    , parseOut: options.parseOut
    }

  // console.log('play recording', recording)

 
  // console.log('playlist', list.length, list)
  setTimeout(function(){
    record.playBack()
  }, options.wait || 0)
  
}

Record.prototype.playBack = function playBack(){
  // console.log('PLAYBACK START')
  var record = this
    , cloud = record.cloud
    , playing = record.playing
    , playlist = playing.playlist
    , at = playing.at
    , ts = playing.ts
    , waitingfor = playing.waitingfor
    , outlist = []
    , entry
    , isignored

  if(playing.timeout)
    clearTimeout(playing.timeout)

  while( (entry = playlist[at]) 
      && ((isignored = ignored(entry.msg)) || entry.type === 'outgoing')
       ){
    // console.log('outgoing', entry.msg.event, isignored)
    if(!isignored){
      outlist.push(
        { time: (1000*entry.ts - 1000*ts) / 1000
        , emit: util.clone(entry.msg)
        }
      )
    }
    at++
  }
  // console.log('have outlist', outlist)
  while( (entry = playlist[at]) 
      && ((isignored = ignored(entry.msg)) || entry.type === 'incoming')
       ){
    var msg = entry.msg
    // console.log('expecting incoming', msg, 'check if not ignored or got it already')
    if(!isignored && !record.resolve(msg, 'unresolved'))
      waitingfor.push(msg)
    ts = entry.ts
    at++
  }

  // console.log('have waitingfor', waitingfor)

  // console.log('okeee ', at, entry)

  if(!outlist.length)
    return playing.done ? playing.done() : true

  if(!waitingfor.length){
    // console.log('gonna send out but no response expected..')
    outlist[outlist.length-1].onEmitted = playing.done
  }


  playing.at = at
  playing.ts = ts

  for(var o = 0, out; out = outlist[o] ; o++ ){

    // console.log('outgoing', out)
    
    if(out.emit.event === 'authenticate')
      out.emit.ack = doNothing

    if(playing.parseOut)
      playing.parseOut(out)

    if(!out.cancel)
      cloud.timedEmit(out)

  }
  
  
}



function doNothing(){}

function byTs(a,b){
  return (1000*a.ts - 1000*b.ts) / 1000
}

Record.prototype.resolve = function resolve(packet, listname){
  if(!listname) listname = 'waitingfor'

  var list = this.playing[listname]
    , matched

  for(var i = 0, entry ; entry = list[i] ; i++){
    if(matchIncoming(packet, entry)){
      matched = true
      list.splice(i,1)
      break
    }
  }
  if(!matched && listname === 'waitingfor'){
    // console.log('did not manage to match, must be too soon.. add to unresolved')
    this.playing.unresolved.push(packet)
    if(this.onUnresolved)
      this.onUnresolved(packet, list)
    else{
      // console.log('NO onUnresolved its not there fwak!')
    }
  }
  
  return matched
}

var flex = ['users', 'clients', 'activity', 'paired', 'mainid']

function matchIncoming(a, b, fieldblind){
  // console.log('wut match a\n', a, '\nwith b\n',b)
  var event_a = a[0]
    , event_b = b[0]
    , data_a = a[1]
    , data_b = b[1]

  if(event_a !== event_b)
    return false

  
  if(event_a === 'set'){
    data_a = data_a.s
    data_b = data_b.s
  }

  // console.log('ok same events, check if data matches \nPACKET:\n',data_a,'\nINLIST:\n',data_b)
  return match(data_a, data_b, flex)

}

function ignored(msg){
  var e = msg instanceof Array ? msg[0] : msg.event
  switch(e){
    case 'connect':
    case 'welcome':
      return true
    break;
  }  
}

RecordCloud.getSubs = function getSubs(outgoing){
  var result = {}
  for(var t in outgoing){
    var out = outgoing[t]
    if(out.event === 'batch'){
      var subs = out.data.subs
      if(subs){
        for(var i = 0, sub ; sub = out.data.subs[i] ; i++){
          // console.log('SUB\n', sub)
          result[makeHash(JSON.stringify(sub))] = sub
        }
      }
    }
  }
  return result
}