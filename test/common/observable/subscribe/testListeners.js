var info = require('../../../../lib/observable/subscribe/emitter/info')
var SubsEmitter = require('../../../../lib/observable/subscribe/emitter')
var getId = info.getId
var getLateral = info.getLateral
var getDepth = info.getDepth

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
        property.attach.each((prop) => {
          listeners.push(property.key)
          let info = prop[3]
          let id = getId(info)
          console.info(hash, '-', property.key, ':', info, '- id:', getId(info), '- lateral:', getLateral(info), '- depth:', getDepth(info))
          expect(typeof info).equals('number')
          expect(id).ok
          expect(ids).not.contains(id)
          ids.push(id)
        })
      }
      if (property.key === 'property') {
        property.attach.each((prop) => {
          listeners.push(property.key)
          let info = prop[3]
          console.info(hash, '-', property.key, ':', info, '- id:', getId(info), '- lateral:', getLateral(info), '- depth:', getDepth(info))
        })
      }
      if (property.key === 'parentEmitter') {
        property.attach.each((prop) => {
          listeners.push(property.key)
          let info = prop[3]
          console.info(hash, '-', property.key, ':', info, '- id:', getId(info), '- lateral:', getLateral(info), '- depth:', getDepth(info))
        })
      }
      if (property.key === 'reference') {
        property.attach.each((prop) => {
          listeners.push(property.key)
          let info = prop[3]
          console.info(hash, '-', property.key, ':', info, '- id:', getId(info), '- lateral:', getLateral(info), '- depth:', getDepth(info))
        })
      }
    }
  }
  console.info('--listeners:', listeners)
  return listeners
}
