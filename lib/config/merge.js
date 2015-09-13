var singular = {
  services: 'service',
  components: 'component'
}

exports.$define = {
  merge: merge
}

function merge(package) {
  var config = this
  var subconfig = package[config._nameSpace && config._nameSpace.$val]

  if(subconfig) {
    package = subconfig
  }

  var category = config.category && config.category.$val
  var name = config.name && config.name.$val
  var myConfig = category && package[category] && package[category][name]

  var setobj = myConfig || {}

  for(var key in package) {
    if(key !== category && !setobj[key] && !config[key]) {
      setobj[key] = package[key]
    }
  }
  config.set(setobj)

  return config
}
