'use strict'
var merge = require('lodash/object/merge')
var Base = require('vigour-js/lib/base')
var isPlain = require('vigour-util/is/plainobj')
var _child = Base.prototype.properties.Child

function lookUpComponent (target, type, val, Element) {
  var result
  while (target) {
    if (target.components && target.components[type]) {
      result = target.components[type]
      if (isPlain(result)) {
        let check = result.type !== type && result.type && type && lookUpComponent(target, result.type || type, val, Element)
        if (check) {
          result = target.components[type] = new check.Constructor(result, false, target)
        } else {
          result = target.components[type] = new Element(result, false, target)
        }
      }
      return result
    }
    target = target._parent
  }
}

module.exports = function (element) {
  var Element = element.Constructor
  exports.define = {
    getType (val, event, key, nocontext, escape) {
      // console.error('get type!', this.path, this.type, val)
      var type = val.type
      if (!type) {
        return val
      }
      // console.log('do type lookups', type)
      let result = lookUpComponent(this, type, val, Element)
      // console.log('ok result?', result, type)
      if (result) {
        // console.log(val)
        let r = new result.Constructor(val, event, this, key) //, this, key, escape)
        return r
      }
      return val
    }
  }

  exports.properties = {
    Child (val, event) {
      if (isPlain(val)) {
        // for (var i in val) {
        //   if (val[i] && val[i].type) {
        //     console.info('now do something special', i)
        //     val[i] = this.getType(val[i], event)
        //     console.log('!', val)
        //   }
        // }
        // need to do somethign like resolved or something
        val = this.getType(val, event)
      }
      _child.call(this, val, event)
    },
    components (val, event) {
      if (!this.hasOwnProperty('components')) {
        this.components = {}
      }
      if (val instanceof Array) {
        for (var i = 0, len = val.length; i < len; i++) {
          setComponent.call(this, val[i], event)
        }
      } else {
        setComponent.call(this, val, event)
      }
    }
  }
  element.inject(exports)
}

function setComponent (val, event) {
  var comp = this.components
  for (var key in val) {
    if (val[key].type) {
      comp[key] = val[key]
    } else if (!comp[key]) {
      comp[key] = val[key]
    } else if (isPlain(comp[key])) {
      merge(comp[key], val[key])
    } else if (comp[key] instanceof Base) {
      comp[key].inject(val[key], event)
    }
  }
}
