/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Youri Daamen, youri@vigour.io
 */
var object = require('./')
  , util = require('../util')

object.decay = exports

var list = [ [], [] ]
  , batchCleaner = function(time, remover) {
      // console.log('batchCleaner!')
      if (!remover) remover = 'remove'
      for (var batch = list[0], i = batch.length - 1, object; i >= 0; i--) {
        object = batch[i]
        if (!object._listeners) {
          object[remover]() //this also removes listeners again!
        } else {
          object._decay = false
        }
      }

      list.shift()
      list.push([])
      if (list[0].length) //if there are items in next batch set timer to clear batch
        setTimeout(function(){
          batchCleaner(time, remover)
        }, time)
    }

exports.extend = function(object, time, remover) {
  var _removeListener = object.prototype.removeListener
  util.define(object,
    'removeListener', function(val, mark, remove) {
      _removeListener.call(this, val, mark, remove)
      if (!(this.listeners || this._decay || this._removed)) { //checks if there are no listeners/ is not in decay list already / is not removed
        this._decay = true
        list[1].push(this)
        if (!list[0].length) //activate batchcleaner!
          batchCleaner(time, remover)
      }
    })
}