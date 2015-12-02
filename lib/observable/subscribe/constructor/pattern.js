'use strict'
var Base = require('../../../../lib/base')
var setKey = Base.prototype.setKey

exports.properties = {
  // pattern: new Base()
  // pattern: new Base({
  //   // define: {
  //   //   setKey () {
  //   //     return setKey.apply(this, arguments)
  //   //   }
  //   // },
  //   // ChildConstructor: 'Constructor'
  // }).Constructor
  // pattern (val, event) {
  //   var parent = this._parent
  //   if (parent) {
  //     let obs = parent._parent
  //     obs.setKey('pattern')
  //     obs.pattern.set(val, void 0, void 0, 'sub_')
  //     this.subField(false, event, obs, obs.pattern, 0, true, {})
  //   }
  //   this._pattern = val
  // }
}
