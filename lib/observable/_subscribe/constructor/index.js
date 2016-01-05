'use strict'
var merge = require('../../../util/merge')
var Emitter = require('../../../emitter')
var Base = require('../../../base')
var setKey = Base.prototype.setKey
var _isExecutable = Emitter.prototype.isExecutable

var pattern = new Base({
  properties: {
    _stamp: true,
    _ignore: true,
    $condition: true,
    $any: true
  },
  define: {
    serialize () {
      var obj = {}
      var property
      for (var i in this) {
        if (i[0] !== '_') {
          if (i !== 'key') {
            property = this[i]
            let value = property._input
            obj[i] = property.serialize
              ? property.serialize()
              : property
            if (value && obj[i] !== true) {
              obj[i].val = value
            }
          }
        } else if (i === '_childSub') {
          let merged = {}
          this[i].each(function (prop) {
            property = prop._input
            var part = property.serialize
              ? property.serialize()
              : property
            merged = merge(merged, part)
          })
          obj.$any = merged
          obj._emitProperty = true
        }
      }
      return property ? obj : true
    },
    setKey (key, val, event, nocontext, escape) {
      if (key === 'parent') {
        return setKey.call(this, '$parent', val, event, nocontext, escape)
      } else if (key === 'key') {
        return setKey.call(this, '$key', val, event, nocontext, escape)
      }
      return setKey.apply(this, arguments)
    }
  },
  ChildConstructor: 'Constructor'
})

pattern.set({
  ChildConstructor: new pattern.Constructor({
    define: {
      patternPath: {
        get () {
          let path = this._patternPath
          if (!path) {
            let parentPath = this.parent.patternPath
            path = this._patternPath = parentPath ? parentPath + '.' + this.key : this.key
          }
          return path
        }
      }
    }
  })
})

module.exports = new Emitter({
  emitInstances: false,
  properties: {
    pattern: pattern
  },
  inject: [
    require('../run'),
    require('../field'),
    require('../object'),
    require('../upward'),
    require('../findemit'),
    require('../condition')
  ],
  define: {
    // similair shit voor base checks (niet last stamp)
    isExecutable (property, key, base, stamp) {
      return base.hasOwnProperty(key) && _isExecutable.apply(this, arguments)
    },
    generateConstructor () {
      return function derivedBase (val, event, parent, key) {
        Base.apply(this, arguments)
        if (parent && !parent[key]) {
          this.subField(false, void 0, parent.parent, this.pattern, 1, { val: true }, {})
        }
      }
    },
    emitInternal (data, event, bind, key, trigger, ignore) {
      var dataStorage
      if (data && bind) {
        let bound = this.getBound(event, bind)
        dataStorage = bound && bound.data
        if (!dataStorage) {
          this.setBind(event, bind, (dataStorage = []), true)
        }
        dataStorage.push(data)
      }
      return Emitter.prototype
        .emitInternal.call(this, dataStorage, event, bind, key, trigger, ignore)
    }
  }
}).Constructor
