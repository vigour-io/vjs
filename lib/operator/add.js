'use strict'
var Operator = require('./')
var Cache = require('./cache')

exports.inject = require('./val')

exports.properties = {
  $add: new Operator({
    key: '$add',
    operator: function (val, operator, origin) {
      // think about these arguments
      // console.log(arguments)
      var parsed = operator.parseValue(val, origin)

      //what to do to the original??? parse it as well
      //cache the added stuff
      //make one cache per target?

      if(parsed instanceof Object) {
        let cache = this._cache
        console.error('this is parsed and its object!!! lets go', parsed)
        if (!cache) {
          this._cache = cache = new Cache()
        }

        return cache
      }
      // also use it for static cache

      //if object is reurned from operator create a result?
      return val + parsed
    }
  })
}
