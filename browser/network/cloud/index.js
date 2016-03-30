/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Marcus Besjes, marcus@vigour.io
 */

var util = require('../../../util')
  , io = util.isNode 
    ? require('socket.io-client')
    : require('./socket.io.js')
  , G = require('../../../util/global')
  , id = require('../../../util/id')
  , urlEncode = require('../ajax').encode

var Cloud = module.exports = function Cloud(url, params){
  if(!params)
    params = {}

  var cloud = this
  cloud.params = params
  cloud.url = url
  cloud.VID = params.VID = fixVID(params.VID)
  // var HID = params.HID || G.env('HID')
  // if(HID)
  //   cloud.HID = params.HID = HID

  var socket = cloud.connect(url, params)

  socket.on('welcome', function(address){

    address = address.split('@')
    var clientid = cloud.clientid = address[0]
      , hubid = address[1]
      , state = cloud.state
    
    cloud.hub = params.h = hubid //G.env('h', hubid)

    cloud.socket.io.uri = fixUrl(cloud.socket.io.uri, params)
  })

  socket.on('hop', function(newhub){
    cloud.hop(newhub)
  })

  // socket.on('connect', logit('connect'))
  socket.on('error', logit('error'))
  // socket.on('disconnect', logit('disconnect'))
  socket.on('reconnect', logit('reconnect'))
  socket.on('reconnect_attempt', logit('reconnect_attempt'))
  socket.on('reconnecting', logit('reconnecting'))
  socket.on('reconnect_failed', logit('reconnect_failed'))

  socket.on('test', function(){
    console.error('TEST!')
    alert('TEST!')
  })

  // var _onevent = socket.onevent
  // socket.onevent = function(packet){
  //   console.log('incoming cloud message!', JSON.stringify(packet.data, false, 2))
  //   _onevent.apply(this, arguments)
  // }

}

Cloud.inject = require('../../../util/inject')

Cloud.prototype.connect = function(url, params){

  var cloud = this

  if(!url)
    url = cloud.url
  if(!params)
    params = cloud.params

  url = fixUrl(url, params)
  
  var oldsocket = cloud.socket

  // if(oldsocket)
  //   url = fixUrl('ws://localhost:10002', params)

  if(oldsocket)
    oldsocket.disconnect()

  if(oldsocket)
    // url='funky?watfs=rere'

  console.log('CONNECTING!', url)

  var socket = cloud.socket = new io(url, 
    { forceNew: true
    , timeout: 5e3
    }
  )
  
  if(oldsocket)
    passOn(oldsocket, socket)

  return socket
  
}

Cloud.prototype.hop = function hop(newhub){

  console.log('GOT ORDER TO HOP TO', newhub)

  var cloud = this
    , params = cloud.params
  // --------------- dev
  if(newhub.indexOf('@') !== -1)
    cloud.url = 'ws://' + newhub.split('@')[1]
  // --------------- /dev
  cloud.hub = params.h = newhub
  cloud.connect()
}

Cloud.prototype.whenReady = function whenReady(fn){
  if(this.clientid)
    fn()
  else
    this.once('welcome', fn)
}

Cloud.prototype.kickPing = function kickPing(time){
  var e = this.socket.io.engine
  e.ping()
  e.onHeartbeat(time || e.pingTimeout)
  e.setPing()
}

delegateList(Cloud.prototype, 'socket', ['on', 'once', 'emit'])

function delegateList(obj, target, list){
  for(var i = list.length -1 ; i >= 0 ; i--){
    delegate(obj, target, list[i]) 
  }
}

function delegate(obj, target, field){
  obj[field] = function delegated(){
    var thing = this[target]
    thing[field].apply(thing, arguments)
  }
}

function logit(flag){
  return function logger(){
    console.log('::', flag, arguments)
  }
}

function fixVID(VID){
  VID = VID || G.session('VID') || id('V_')
  return G.session('VID', VID)
}

function passOn(from, to){
  for(var e in from._callbacks){
    var fromlist = from._callbacks[e]
    for(var i=0, fn; fn = fromlist[i] ; i++){
      if(fn.name === 'on' && fn.fn){
        to.once(e, fn.fn)
      }else{
        to.on(e,fn)
      }
    }
  }
  from.off()
}

function fixUrl(url, params){
  var cutoff = url.indexOf('?')
  if(cutoff > -1)
    url = url.slice(0, cutoff)
  return url + '?' + urlEncode(params, 'GET', 'uri')
}


