var SubsEmitter = require('../../../../lib/observable/subscribe/constructor')
var getId = require('../../../../lib/observable/subscribe/current/get/id')
var getLateral = require('../../../../lib/observable/subscribe/current/get/level')
var getDepth = require('../../../../lib/observable/subscribe/current/get/depth')
var Emitter = require('../../../../lib/emitter')
module.exports = exports = function testListeners(obj, subs) {
  var hash = obj.key
  var listeners = []
  listeners.numberOf = function (value) {
    var count = 0
    for (var i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i] === value) {
        count++
      }
    }
    return count
  }
  var ids = []
  var storage = obj instanceof SubsEmitter ? obj.listensOnAttach : obj._on
  if (storage) {
    for (let i in storage) {
      let property = storage[i]
      if (subs) {
        if (property instanceof SubsEmitter) {
          console.log('---->',property.key)
          listeners.push(property.key)
        }
        continue
      }
      if (property instanceof Emitter) {
        if (!property.attach) {

        } else if (property.key === 'data') {
          property.attach.each((prop, key) => {
            listeners.push(property.key)
            let current = prop[3]
            let id = key
            console.info(hash, '-', property.key, ':', current, '- id:', id, '- lateral:', getLateral(current), '- depth:', getDepth(current))
            expect(id).ok
            expect(ids).not.contains(id)
            ids.push(id)
          })
        } else if (property.key === 'property') {
          property.attach.each((prop) => {
            listeners.push(property.key)
            let current = prop[3]
            console.info(hash, '-', property.key, ':', current, '- id:', getId(current), '- lateral:', getLateral(current), '- depth:', getDepth(current))
          })
        } else if (property.key === 'parentEmitter') {
          property.attach.each((prop) => {
            listeners.push(property.key)
            let current = prop[3]
            console.info(hash, '-', property.key, ':', current, '- id:', getId(current), '- lateral:', getLateral(current), '- depth:', getDepth(current))
          })
        } else if (property.key === 'reference') {
          property.attach.each((prop) => {
            listeners.push(property.key)
            let current = prop[3]
            console.info(hash, '-', property.key, ':', current, '- id:', getId(current), '- lateral:', getLateral(current), '- depth:', getDepth(current))
          })
        }
      }
    }
  }
  return listeners
}

exports.subs = function (obj) {
  return exports(obj, true)
}
