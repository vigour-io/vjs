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

        // can be shared over instances ofcourse --- this is dangerous sometimes you dont need? (if the internals are exactly the same)
        // as a check when creating cache you need to check if each prop that you want ot copy is the same
        // what about including properties ? thats pretty problematic!!!
        // add an option to operators to parse this kinde of stuff?
        if (!cache) {
          this._cache = cache = new Cache(this)
        }
        // cache should add listeners? make refs for each field on the orginal object?
        // thats probably best
        cache.set(parsed) //as a merge ofcourse
        // resolving context??? prob not smart...
        return cache
      }
      // also use it for static cache

      //if object is reurned from operator create a result?
      return val + parsed
    }
  })
}
