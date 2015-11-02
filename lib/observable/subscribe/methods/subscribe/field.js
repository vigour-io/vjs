'use strict'
var onDataReference = require('../../on/data/reference')
var onDataDirect = require('../../on/data/direct')
var getData = require('../../util/data')
var emit = require('../../util/emit')
var info = require('../../info')

var isCloserOrSame = info.isCloserOrSame
var getLateral = info.getLateral
var setId = info.setId
var getId = info.getId

module.exports = function subscribeField (data, event, obj, pattern, key, info, mapValue) {
  if (key === 'parent') {
    key = 'sub_parent'
  }
  var patternValue = pattern[key].val
  var id

  if (typeof patternValue === 'object') {
    return this.subscribeObject(data, event, obj, patternValue, info, mapValue, {})
  }

  if (patternValue === true) {
    id = this.generateId()
    info = setId(info, id)
  } else if (isCloserOrSame(patternValue, info)) {
    id = getId(patternValue)
    info = setId(info, id)
    removeChangeListener(this, id)
  }

  if (id) {
    let subscriber = this._parent.parent
    let onData

    if (getLateral(info)) {
      onData = onDataReference
      data && this.emit(getData(obj, data), event, subscriber)
    } else {
      onData = onDataDirect
      data && emit(getData(obj, data), event, obj, mapValue, this.key, event && event.type === 'parent')
    }

    pattern[key].val = info
    removeReferenceListeners(this, pattern)
    this.addSubListener(obj, 'data', [onData, this, pattern, mapValue, subscriber], id)
  }

  return true
}

function removeChangeListener (emitter, id) {
  emitter.listensOnAttach.each(function (property) {
    if (property.key === 'data') {
      property.attach.each(function (prop, key) {
        if (key == id) {
          property.attach.removeProperty(prop, key)
        }
      })
    }
  })
}

function removeReferenceListeners (emitter) {
  var listeners = emitter.listensOnAttach
  if (listeners) {
    listeners.each(function (property) {
      if (property.key === 'reference') {
        let attach = property.attach
        attach.each(function (prop, key) {
          if (!keepRefListener(prop[2][1], prop[3])) {
            attach.removeProperty(prop, key)
          }
        })
      }
    })
  }
}

function keepRefListener (pattern, info) {
  return pattern.each((property, key) => {
    let patternValue = property.val
    if (typeof patternValue === 'object') {
      return keepRefListener(patternValue, info)
    }
    if (patternValue === true) {
      return true
    }
    if (isCloserOrSame(patternValue, info)) {
      return true
    }
  })
}
