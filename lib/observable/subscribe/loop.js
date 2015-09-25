'use strict'
var Base = require('../../base')

exports.define = {
  count: {
    value: 0,
    writable: true
  },
  loop: function (event, meta, obj, pattern, depth, lateral, map, newMap) {
    var addedPropertyListener
    var addedParentListener
    var any = pattern['*']
    var emitter

    if (!map) {
      map = true
      depth = 0
      lateral = 0
    }

    if (!newMap) {
      newMap = {}
    }

    if (any) {
      emitter = this
      newMap['parent'] = map
      obj.each(function (property, key) {
        emitter.subscribe(event, meta, property, any, key, depth + 1, lateral, newMap)
      })
      obj.on('property', [onAny, this, pattern, depth, lateral, map, newMap])
      addedPropertyListener = true
    }

    for (var key in pattern) {
      if (key === 'upward') {
        this.upward(event, meta, obj, pattern.upward, depth, lateral, map, newMap)
        continue
      }
      if (key === '&') {
        continue
      }
      if (key === '*') {
        continue
      }
      var property = prop(obj, key)
      if (property) {
        if (key === 'parent') {
          newMap[obj.key] = map
        } else if (!newMap.parent) {
          newMap.parent = map
        }
        console.log('---', property, key)
        this.subscribe(event, meta, property, pattern, key, depth + 1, lateral, newMap)
      } else if (key === 'parent') {
        obj.on('addToParent', [onParent, this, pattern, depth, lateral, map, newMap])
        addedParentListener = true
      } else if (!addedPropertyListener) {
        obj.on('property', [onProperty, this, pattern, depth, lateral, map, newMap])
        addedPropertyListener = true
      }
    }

    if (!addedPropertyListener && !addedParentListener) {
      return pattern
    }

    var referenced = ref(obj)
    console.log('referenced', referenced)
    console.log('..obj', obj)
    if (referenced) {
      obj.on('reference', [onReference, this, pattern, depth, lateral + 1, map, newMap])
      return this.loop(event, meta, referenced, pattern, depth, lateral + 1, map, newMap)
    }
  },
  subscribe: function (event, meta, obj, pattern, key, depth, lateral, map) {
    var value = pattern[key]
    if (value === true) {
      pattern[key] = encode(++this.count, depth, lateral)
      obj.on('change', [onChange, this, pattern, depth, lateral, map], this.count)
      if (meta) {
        if (lateral > 0) {
          this._parent._parent.emit(this.key, event)
        } else {
          emit(event, meta, obj, map, this.key, event.type === 'addToParent')
        }
      }

      return value
    }
    // endpoint that has a listener
    if (typeof value === 'number') {
      // if our position is closer then the current listener
      if (isCloserOrSame(value, depth, lateral)) {
        var foundId = getId(value)
        // remove the old change listener
        this.listensOnAttach.each(function (property) {
          if (property.key === 'change') {
            property.attach.each(function (prop, id) {
              if (id == foundId) {
                property.attach.removeProperty(prop, id)
              }
            })
          }
        })

        // update pattern value
        pattern[key] = setLocation(value, depth, lateral)
        // add the new change listener
        obj.on('change', [onChange, this, pattern, depth, lateral, map], foundId)
        // emit!
        if (meta) {
          if (lateral > 0) {
            this._parent._parent.emit(this.key, event)
          } else {
            emit(event, meta, obj, map, this.key, event.type === 'addToParent')
          }
        }
      }

      return value
    }
    return this.loop(event, meta, obj, value, depth, lateral, map)
  },
  upward: function (event, meta, obj, pattern, depth, lateral, map, newMap) {
    var fulfilled = this.loop(event, meta, obj, pattern, depth, lateral, map, newMap)
    var parent
    if (!fulfilled) {
      parent = obj.parent
      if (parent) {
        newMap[obj.key] = map
        return this.upward(event, meta, obj, pattern, depth + 1, lateral, newMap, {})
      }
      obj.on('addToParent', [onUpward, this, pattern, depth, lateral, map, newMap || {}])
      return true
    }
  }
}

function onAny (event, meta, emitter, pattern, depth, lateral, map, newMap) {
  var added = meta && meta.added
  var key
  var i
  if (added) {
    newMap.parent = map
    for (i = added.length - 1; i >= 0; i--) {
      key = added[i]
      emitter.subscribe(event, meta, this[key], pattern, key, depth + 1, lateral, newMap)
    }
  }
}

function onChange (event, meta, emitter, pattern, depth, lateral, map) {
  console.error('--------', this.path, meta)
  if (meta) {
    var subsOrigin = emitter._parent._parent
    if (subsOrigin._input || map['parent']) {
      pattern[this.key] = true
      emitter.loop(event, meta, subsOrigin, emitter._pattern)
    }
  }

  if (lateral > 0) {
    emitter._parent._parent.emit(emitter.key, event)
  } else {
    emit(event, meta, this, map, emitter.key)
  }
}

function emit (event, meta, property, map, key, noinstances) {
  var next = property
  var value
  for (var i in map) {
    value = map[i]
    if (value) {
      next = property[i]
      if (next) {
        // true means has never been fired,
        // 1 means has been fired (don't fire with noinstances === true)
        if (value === true) {
          next.emit(key, event)
          map[i] = 1
        } else if (value === 1) {
          if (!noinstances) {
            next.emit(key, event)
          }
        } else {
          emit(event, meta, next, value, key, noinstances)
        }
      } else {
        map[i] = null
      }
    }
  }
}

function onParent (event, meta, emitter, pattern, depth, lateral, map, newMap) {
  newMap[this.key] = map
  emitter.subscribe(event, {}, this.parent, pattern, 'parent', depth + 1, lateral, newMap)
// should I remove the parent listener now? Perhaps keep it for the instances
}

function onUpward (event, meta, emitter, pattern, depth, lateral, map, newMap) {
  newMap[this.key] = map
  emitter.upward(event, {}, this.parent, pattern, depth + 1, lateral, newMap)
// should I remove the parent listener now? Perhaps keep it for the instances
}

function onProperty (event, meta, emitter, pattern, depth, lateral, map, newMap) {
  var added = meta && meta.added
  var foundSomething
  var key
  var i
  if (added) {
    for (i = added.length - 1; i >= 0; i--) {
      key = added[i]
      if (pattern[key]) {
        newMap.parent = map
        emitter.subscribe(event, meta, this[key], pattern, key, depth + 1, lateral, newMap)
        foundSomething = true
      }
    }
    if (foundSomething) {
      for (i in pattern) {
        var value = pattern[i]
        if (i === 'parent' || i === 'upward') {
          continue
        }
        if (!isFulfilled(value, depth + 1, lateral)) {
          return
        }
      }
    }
    var attach = this._on.property.attach
    console.log('>', attach)
    attach.each(function (prop, key) {
      if (prop[0] === onProperty) {
        attach.removeProperty(prop, key)
      }
    })
  }
}

function unfindReferenced (pattern, lateral) {
  for (var i in pattern) {
    var value = pattern[i]
    if (typeof value === 'number') {
      if (getLateral(value) >= lateral) {
        pattern[i] = true
      }
    } else if (value !== true) {
      unfindReferenced(value, lateral)
    }
  }
}

function onReference (event, meta, emitter, pattern, depth, lateral, map, newMap) {
  emitter.listensOnAttach.each(function (property) {
    property.attach.each(function (prop, key) {
      if (prop[4] >= lateral) {
        property.attach.removeProperty(prop, key)
      }
    })
  })

  unfindReferenced(pattern, lateral)

  var referenced = ref(this)
  if (referenced) {
    emitter.loop(event, meta, referenced, pattern, depth, lateral, map, newMap)
  }
}

function prop (obj, key) {
  var property = obj[key]
  return property && property._input !== null && property
}

function ref (obj) {
  var referenced = obj._input
  return referenced && referenced instanceof Base && referenced
}

function encode (id, depth, lateral) {
  return (((lateral << 8) | depth) << 16) | id
}

function setLocation (code, depth, lateral) {
  code &= 0xffff
  return (code |= ((lateral << 8) | depth) << 16)
}

function getId (code) {
  return code & 0xffff
}

function getDepth (code) {
  return (code >> 16) & 0xff
}

function getLateral (code) {
  return (code >> 24) & 0xff
}

function isCloserOrSame (code, depth, lateral) {
  var founddepth = getDepth(code)
  if (founddepth > depth) {
    return true
  }
  if (founddepth === depth) {
    if (getLateral(code) >= lateral) {
      return true
    }
  }
}

function isFulfilled (value, depth, lateral) {
  if (typeof value === 'number') {
    var founddepth = getDepth(value)
    if (founddepth < depth) {
      return true
    }
    if (founddepth === depth) {
      if (getLateral(value) <= lateral) {
        return true
      }
    }
  }
}
