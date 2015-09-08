var flatten = require('./util/flatten')

var singular = {
  services: 'service',
  components: 'component'
}

exports.merge = function merge(package) {
  var config = this



  var subconfig = package[config._nameSpace && config._nameSpace.$val]

  if(subconfig) {
    // subconfig.name = package.name
    package = subconfig
  }

  var category = config.category && config.category.$val
  var name = config.name && config.name.$val
  var myConfig = category && package[category] && package[category][name]

  if(myConfig) {
    // var type = singular[category]
    // if(type) {
    //   myConfig[type] = name
    // }

    config.set(myConfig)
  }


  var setobj = {}
  for(var key in package) {
    if(key !== category) {
      setobj[key] = package[key]
    }
  }
  console.log('setting from merge', setobj)
  config.set(setobj)

  return config
}
