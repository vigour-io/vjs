'use strict'
var trackingEmitter = require('./emitter')
  /**
   * @function defaultTracking
   * passes information to datalayer to be send to tracking plugins
   * @param {Boolean | Object | Array | String}
   * @example
   */

function track (data, event, type, object = data) {
  let listener = this._on[event.type]
  if (listener) {
    if (data === null) { listener.key = event.type = 'remove' }
    let id = typeof type === 'string' ? type : listener.path.join('.')
    trackingEmitter.emit(object, event, this, listener.key, false, id)
  }
}

exports.properties = {
 track: function (val) {
   if (val instanceof Array) {
     for (let i = 0, length    = val.length; i < length; i++) {
       this.on(val[i], [track, true])
     }
   } else if (typeof val === 'object') {
     for (let i in val) {
       this.on(i, [track, val[i], val[i]])
     }
   } else {
     this.on('data', [track, val])
     for (let key in this._on) {
       if (key.charAt(0) !== '_' && key !== 'data' && key !== 'key') {
         this.on(key,[track, val])
       }
     }
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
