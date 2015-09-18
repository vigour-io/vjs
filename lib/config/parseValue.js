var Observable = require('../observable')
var _$parseValue = Observable.prototype.$parseValue

var pattern = /{(.*?)}/g

exports.$define = {
  $parseValue: parseConfigValue
}

function parseConfigValue(){
  // console.log('parseConfigValue on', this.$path)
  var val = this._$input

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
        // console.error('could not find replacement for ' + key)
        return null
      }

      var length = found[0].length
      var pre = val.slice(0, found.index)
      var post = val.slice(found.index + length)

      val = pre + replacement + post
      pattern.lastIndex = found.index + replacement.length

    }
    return val
  } else {
    return _$parseValue.apply(this, arguments)
  }
}
