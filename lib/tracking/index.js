'use strict'
var trackingEmitter = require('./emitter')
var Emitter = require('../emitter')
  /**
   * @function defaultTracking
   * passes information to datalayer to be send to tracking plugins
   * @param {Boolean | Object | Array | String}
   * @example
   */

// make exclude like this if true then its ok
// makes it easy to use these kind of type checks
// exclude will be called condition then
// @todo replace exclude with include
function isEmitter(emitter) {
  return (emitter instanceof Emitter)
}

function addTrackingListener(emitter, key, base, data, id = emitter.path.join('.')) {
  base = base._parent
  emitter.on(function(data, event) {
    trackingEmitter.emit(data, event, base, key, false, id)
  }, 'track')
}

function addMultipleListeners(key, event) {
  var keyValue = key
  var base = this._parent

  if (key === 'parent' || key === 'remove') {
    key = key + 'Emitter'
  }
  this.on(key, function(data, event) {
    var id = this._on[key].path.join('.')
    data = keyValue
    trackingEmitter.emit(data, event, base, key, false, id)
  }, 'track')
}

function defaultTracking(event, val) {
  var observable = this
  var on = observable._on
    // TODO also track listeners that are added later
  if (on) {
    on.each(addTrackingListener, isEmitter)
  }
}

function arrayTracking(event, val) {
  let length = val.length
  for (let i = 0; i < length; i++) {
    addMultipleListeners.call(this, val[i], event, void 0)
  }
}

function objectTracking(event, val) {
  for (let key in val) {
    addMultipleListeners.call(this, key, event, void 0, val[key])
  }
}

/*
  'string'
  // fires correct amount of times (extend the test plugin function)
  // test plugin per it
  // dont forget to clear the plugin!
  // fires with the correct id if string
  // fires with correct function transformation with function
  // fires for the correct listeners for object and array
  // fires with correct function result per field in object
  // fires with correct id per field in object
  // fires using defualt per field in object (when using true)

  - object
   - array


    //addListener functie

    //object en array
    // iterator functie
    // calls track for each field with correct type -- array just calls true (default)

    // loop trough object and array
    this._on[key].path.join('.')
    */

// string, fn, true set call track(type)

function track(data, event, type) {
  var listener = this._on[event.type]
  if(!listener){
    return
  }
  //why
  if (typeof type === 'string') {
    var id = type
  }
  trackingEmitter.emit(data, event, this, event.type, false, id = listener.path.join('.'))
}

exports.properties = {
 track: function (val) {
   var type = typeof val
   if (type === 'array') {
     for (let i = 0, length    = val.length; i < length; i++) {
       this.on(val[i], [track, true])
     }
   } else if (type === 'object') {
     for (let i in val) {
       this.on(i, [track, val[i]])
     }
   } else {
     this.on('data', [track, val])

     console.log(this._on)
    //  console.log(key,emitter)
     this._on.each((emitter, key) => {
       console.log('yes')
       if (key !== 'data') {
         emitter.on([track, val])
       }
     })
   }
 }
}
