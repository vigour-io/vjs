var SubsEmitter = require('../../../../lib/observable/subscribe/constructor')
var getId = require('../../../../lib/observable/subscribe/current/get/id')
var getLateral = require('../../../../lib/observable/subscribe/current/get/level')
var getDepth = require('../../../../lib/observable/subscribe/current/get/depth')

module.exports = function testListeners(obj) {
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
    for(let i in storage){
      var property = storage[i]
      if(!property.attach){
        continue
      }
      if (property.key === 'data') {
        property.attach.each((prop, key) => {
          listeners.push(property.key)
          let current = prop[3]
          let id = key
          console.info(hash, '-', property.key, ':', current, '- id:', id, '- lateral:', getLateral(current), '- depth:', getDepth(current))
          // expect(typeof current).equals('number')
          expect(id).ok
          expect(ids).not.contains(id)
          ids.push(id)
        })
      }
      if (property.key === 'property') {
        property.attach.each((prop) => {
          listeners.push(property.key)
          let current = prop[3]
          console.info(hash, '-', property.key, ':', current, '- id:', getId(current), '- lateral:', getLateral(current), '- depth:', getDepth(current))
        })
      }
      if (property.key === 'parentEmitter') {
        property.attach.each((prop) => {
          listeners.push(property.key)
          let current = prop[3]
          console.info(hash, '-', property.key, ':', current, '- id:', getId(current), '- lateral:', getLateral(current), '- depth:', getDepth(current))
        })
      }
      if (property.key === 'reference') {
        property.attach.each((prop) => {
          listeners.push(property.key)
          let current = prop[3]
          console.info(hash, '-', property.key, ':', current, '- id:', getId(current), '- lateral:', getLateral(current), '- depth:', getDepth(current))
        })
      }
    }
  }
  console.info('--listeners:', listeners)
  return listeners
}
