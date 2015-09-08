var Observable = require('../observable')

var _$parseValue = Observable.prototype.$parseValue

var pattern = /{(.*?)}/g

var plural = {
  service: 'services',
  component: 'components'
}

exports.$parseValue = function parseConfigValue(){
  var val = this._$val

  if( typeof val === 'string') {
    var found
    var newValue = ''
    while(found = pattern.exec(val)) {
      var key = found[1]
      var replacement
      replacement = this[key] || this.lookUp(key)

      if(replacement) {
        replacement = replacement.$val
      }

      if(!replacement) {
        // console.log('could not find replacement for', key)
        replacement = found[0]
      }

      var length = found[0].length
      var pre = val.slice(0, found.index)
      var post = val.slice(found.index + length)

      val = pre + replacement + post
      pattern.lastIndex = found.index + replacement.length
      // console.log('-- val is now', val)

    }
    return val
  } else {
    return _$parseValue.apply(this, arguments)
  }


}


/*
[ '{name}',
  'name',
  index: 19,
  input: '{service}.{region}.{name}' ]
*/
