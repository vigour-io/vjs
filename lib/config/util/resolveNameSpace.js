'use strict'

module.exports = function resolveNameSpace (pckg, nameSpace) {
  if (!pckg) {
    return pckg
  }
  var spaced = pckg[nameSpace]
  if (spaced) {
    var result = {
      name: pckg.name,
      version: pckg.version
    }
    for (var key in spaced) {
      result[key] = spaced[key]
    }
    return result
  }
  return pckg
}
