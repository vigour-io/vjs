'use strict'
var Emitter = require('./index.js')
var include = require('../util/include')
var ADDED = 'added'
var REMOVED = 'removed'

module.exports = new Emitter({
  define: {
    postponed: false,
    emit: function (event, bind, force, addedKey, removedKey, metaOverwrite) {
      if (this.lastStamp !== event.stamp || !this.hasOwnProperty('lastStamp')) {
        var meta = this._meta
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
              this._meta = meta = addedKey
            }
          } else {
            if (!meta) {
              this._meta = meta = {}
            }
            if (!meta.added) {
              meta.added = []
            }
            meta.added.push(addedKey)
          }
        } else if (removedKey) {
          if (!meta) {
            this._meta = meta = {}
          }
          if (!meta.removed) {
            meta.removed = []
          }
          // JSTANDARD ISSUE: weird js standard error (not true!)
          meta.removed.push(removed)
        }

        if (!force) {
          this.postpone(bind, event)
        } else {
          if (bind) {
            this.pushBind(bind, event)
          }
          this.exec(event)
        }
      } else if (this._meta) {
        console.warn(JSON.stringify(this._meta, false, 2), 'remove meta from property emitter double check if this ok!')
        this._meta = null
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
