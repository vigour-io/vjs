'use strict'

function Bind () {}
Bind.prototype.data = void 0
Bind.prototype.val = void 0
Bind.prototype.context = void 0

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
  setBindInternal (event, uid) {
    var stamp = event.stamp
    var bound
    if (!this.binds) {
      this.binds = {}
    } else if (!this.hasOwnProperty('binds')) {
      // needs ckeanup
      // console.warn('danger mode!', this.binds && this.binds[stamp] && this.binds[stamp][uid])
      this.binds = {}
    }
    if (!this.binds[stamp]) {
      this.binds[stamp] = {}
    }
    if (!this.binds[stamp][uid]) {
      bound = this.binds[stamp][uid] = new Bind()
    } else {
      bound = this.binds[stamp][uid]
    }
    return bound
  },
  setBind (event, bind, data, noval) {
    var bound = this.setBindInternal(event, bind.uid)
    if (!noval) {
      bound.val = bind
    }
    // make efficieny here (ref to other map!) make those shared values smart if empoty delete it
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
      bound = bound[chain[i].context.uid]
      if (!bound) {
        return
      }
    }
    return bound.chain
  },
  setContextBind (event, bind, data, chain) {
    var bound = this.getBind(event, bind)
    if (!bound) {
      bound = this.setBind(event, bind, data, true)
    }
    var boundchain = bound // these chains nex optmization
    for (let i = 0, length = chain.length; i < length; i++) {
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

// function chainlogger (chain) {
//   var str = chain[0].bind.uid
//   for (var i in chain) {
//     str += '.' + chain[i].context.uid
//   }
//   return str
// }
