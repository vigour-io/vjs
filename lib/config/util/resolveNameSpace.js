module.exports = function resolveNameSpace(package, nameSpace){
  var spaced = package[nameSpace]
  if( spaced ) {
    var result = {
      name: package.name,
      version: package.version
    }
    for(var key in spaced) {
      result[key] = spaced[key]
    }
    return result
  }
  return package
}
