'use strict'
var trackingEmitter = require('./emitter')
var Emitter = require('../emitter')
  /**
   * @function defaultTracking
   * passes information to datalayer to be send to tracking plugins
   * @param {Boolean | Object | Array | String}
   * @example
   */

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
     this.on('error', [track, val])
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
