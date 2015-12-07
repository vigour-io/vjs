'use strict'

function Bind () {}
Bind.prototype.data = void 0
Bind.prototype.val = void 0
Bind.prototype.context = void 0

// and uuids
exports.define = {
  getBind (event, bind, key) {
    var stamp = event.stamp
    var bound = this.hasOwnProperty('binds') &&
      this.binds &&
      this.binds[stamp] &&
      this.binds[stamp][bind.uid]
    return key
      ? bound && bound[key] ? bound : void 0
      : bound
  },
  setBind (event, bind, data, noval) {
    var stamp = event.stamp
    var bound
    if (!this.binds) {
      this.binds = {}
    } else if (!this.hasOwnProperty('binds')) {
      this.binds = {}
    }
    if (!this.binds[stamp]) {
      this.binds[stamp] = {}
    }
    if (!this.binds[stamp][bind.uid]) {
      bound = this.binds[stamp][bind.uid] = new Bind()
    } else {
      bound = this.binds[stamp][bind.uid]
    }
    if (!noval) {
      bound.val = bind
    }
    if (data !== void 0) {
      bound.data = data
    }
    return bound
  },
  getContextBind (event, bind, chain) {
    var bound = this.getBind(event, bind)
    if (!bound) {
      return
    }
    for (let i = 0, length = chain.length; i < length; i++) {
      // console.log('GET', bind.uid, chain[i].context.uid, bound)
      bound = bound[chain[i].context.uid]
      if (!bound) {
        // console.log('GET FAIL!', chainlogger(chain))
        return
      }
    }
    // console.log('GET OK', chainlogger(bound.chain))
    return bound.chain
  },
  setContextBind (event, bind, data, chain) {
    var bound = this.getBind(event, bind)
    if (!bound) {
      bound = this.setBind(event, bind, data, true)
    }
    var boundchain = bound
    // make chain better -- dont return an array when its length is 1
    for (let i = 0, length = chain.length; i < length; i++) {
      // console.log(chain[i].context.uid, i, chain, bound, '"' + bind.uid + '"')
      if (boundchain[chain[i].context.uid]) {
        boundchain = boundchain[chain[i].context.uid]
      } else {
        boundchain = boundchain[chain[i].context.uid] = {}
      }
    }
    boundchain.chain = chain
    return bound
  }
}

function chainlogger (chain) {
  var str = chain[0].bind.uid
  for (var i in chain) {
    str += '.' + chain[i].context.uid
  }
  return str
}
