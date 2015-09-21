exports.$define = {
  merge: merge
}

function merge (pkg) {
  var config = this
  var subconfig = pkg[config._nameSpace && config._nameSpace.$val]

  if (subconfig) {
    pkg = subconfig
  }

  var category = config.category && config.category.$val
  var name = config.name && config.name.$val
  var myConfig = category && pkg[category] && pkg[category][name]

  var setobj = myConfig || {}

  for (var key in pkg) {
    if (key !== category && !setobj[key] && !config[key]) {
      setobj[key] = pkg[key]
    }
  }
  config.set(setobj)

  return config
}
