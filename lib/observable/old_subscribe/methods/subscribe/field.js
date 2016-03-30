'use strict'
var onDataReference = require('../../on/data/reference')
var onDataContext = require('../../on/data/context')
var onDataDirect = require('../../on/data/direct')
var getData = require('../../util/data')
var emit = require('../../util/emit')
var info = require('../../info')

var isCloserOrSame = info.isCloserOrSame
var getLateral = info.getLateral
var setId = info.setId
var getId = info.getId

// var getData = require('../../util/pattern')

module.exports = function subscribeField(data, event, obj, pattern, key, info, mapValue) {
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
  // console.info('field!',id, data.context, getLateral(info))
  // TODO change this block!!!
  // id || data
  if (id || data) {
    let subscriber = this._parent.parent
    console.info(obj.path,id, data.context)
    if (data.context) {
      let contextmap = data.map
      let context = data.context
      let getSubscriber = function () {
        let map = contextmap
        let next = context
        while (typeof map === 'object') {
          for (let i in map) {
            if (next) {
              next = next[i]
              map = map[i]
            } else {
              console.warn('no next, this should not happen', key, context._input, contextmap, map, i, next)
              return
            }
          }
        }
        return next
      }
      data && this.emit(getData(obj, data), event, getSubscriber())
      this.addSubListener(obj, 'data', [onDataContext, this, pattern, mapValue, getSubscriber], id)
    } else if (getLateral(info)) {
      data && this.emit(getData(obj, data), event, subscriber)
      this.addSubListener(obj, 'data', [onDataReference, this, pattern, mapValue, subscriber], id)
    } else {
      data && emit(getData(obj, data), event, obj, mapValue, this.key, event && event.type === 'parent')
      this.addSubListener(obj, 'data', [onDataDirect, this, pattern, mapValue, subscriber], id)
    }

    pattern[key].val = info
    removeReferenceListeners(this, pattern)
  }

  return true
}

function removeChangeListener(emitter, id) {
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

function removeReferenceListeners(emitter) {
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

function keepRefListener(pattern, info) {
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
