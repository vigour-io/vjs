'use strict'
var Operator = require('./')
var objectCache = require('./cache/object')
exports.inject = [
  require('./val')
]

exports.properties = {
  $: {
    val: new Operator({
      key: '$',
      define: {
        set: function (pattern) {
          if (typeof pattern === 'string') {
            var keys = pattern.split('.')
            var value = true
            for (var i = keys.length - 1; i >= 0; i--) {
              pattern = {}
              pattern[keys[i]] = value
              value = pattern
            }
          }
          console.log('HAHAHA',this)
          this._parent.subscribe(pattern, function (data, event) {
            if(!data){
              console.warn('something fishy going on, why am I fired? Do data.')
              return
            }

            // if (this._$._output !== data.origin) {
              // console.log(data.origin.path,'------>',this.path)
              // console.log('!!!!',this._$._context)
              // // if (!this.hasOwnProperty('_$') && this._$._context) {
              // if (this._$._context) {
              //   this._$.resolveContext({}, event)
              // }

              // var path = []
              // var parent = this
              // while(parent){
              //   path.unshift(parent.key)
              //   parent = parent.parent
              // }
            if (!this.hasOwnProperty('_$') && this._$._context) {
              // console.error('!')
              this._$.resolveContext({}, event)
            }

            console.log(this.path,'<--',data.origin.path)

            this._$.output = data.origin
            this._$.emit('data',event)
            // }
          }).run()
        }
      },
      operator: function (val, operator, origin) {
        var parsed = operator.parseValue(val, origin)
        var cached = objectCache.call(this, parsed)
        if (cached) {
          // events etc to these sets!
          cached.clear()
          cached.set(parsed)
          return cached
        } else {
          return parsed
        }
      }
    }),
    override: '_$'
  }
}
