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
          } catch(err) {}
        }
      }
      setobj[param] = val
    }
  }

  return setobj
}
