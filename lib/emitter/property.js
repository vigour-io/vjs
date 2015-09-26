'use strict'
var Emitter = require('./index.js')
var include = require('../util/include')
var ADDED = 'added'
var REMOVED = 'removed'

module.exports = new Emitter({
  define: {
    executeQueue: true,
    // executeInstances: true,
    emit: function (event, bind, force, addedKey, removedKey, metaOverwrite) {
      if (this.lastStamp !== event.stamp || !this.hasOwnProperty('lastStamp')) {
        var meta = this.meta
        if (addedKey) {
      
          if (typeof addedKey === 'object') {
            if (meta) {
              // unify added and removed
              unify(meta, ADDED, addedKey)
              unify(meta, REMOVED, addedKey)
              // unify moved
              if (meta.moved && addedKey.moved) {
                // TODO: resolve stacked moves
                throw new Error('wow you are stacking moves on moves! what a bawler.')
              }
            } else {
              this.meta = meta = addedKey
            }
          } else {
            if (!meta) {
              this.meta = meta = {}
            }
            if (!meta.added) {
              meta.added = []
            }
            meta.added.push(addedKey)
        
          }
        } else if (removedKey) {
          if (!meta) {
            this.meta = meta = {}
          }
          if (!meta.removed) {
            meta.removed = []
          }
          meta.removed.push(removedKey)
        }

        if (!force) {
          this.queue(bind, event)
        } else {
          if (bind) {
            this.bind(bind, event)
          }
          this.exec(event)
        }
      } else if (this.meta) {
        console.warn(JSON.stringify(this.meta, false, 2), 'remove meta from property emitter double check if this ok!')
        this.meta = null
      }
    }
  }
}).Constructor

function unify (to, key, from) {
  var toval = to[key]
  var fromval = from[key]
  if (toval !== void 0) {
    if (fromval && fromval !== toval) {
      if (!(toval instanceof Array)) {
        to[key] = [ toval ]
      }
      include(toval, fromval)
    }
  } else if (fromval) {
    console.error('wrong do not have meta!')
  // meta[key] = fromval
  }
}
