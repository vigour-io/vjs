'use strict'

module.exports = function parseArgv (config) {
  var setobj = {}
  var args = process.argv

  var check = /^--./

  for (var i = 0, param; param = args[i]; i++) {
    if (check.test(param)) {
      param = param.slice(2)
      var val = args[i + 1]
      if (check.test(val)) {
        val = true
      } else {
        i++
        var def = config[param] && config[param].$val
        if (!def || typeof def !== 'string') {
          try {
            val = JSON.parse(val)
          } catch (err) {}
        }
      }
      setobj[param] = val
    }
  }

  var configSet = setobj.config
  if (configSet) {
    var decoded
    var parsed
    try {
      decoded = decodeURIComponent(configSet)
      parsed = JSON.parse(decoded)
      configSet = parsed
      delete setobj.config
      // console.log('configset is', configSet)
      for (var s in setobj) {
        // console.log('set dat field', s, 'to\n', setobj[s])
        configSet[s] = setobj[s]
      }
      setobj = configSet
    } catch (err) {
      console.log('CONFIG ERROR! could not parse --config:\n',
        setobj.config,
        '\ngot from decodeURIComponent:', decoded,
        '\nerror: ', err
      )
    }
  }

  return setobj
}
