module.exports = function isEmpty (obj) {
  var found
  if (obj.each) {
    obj.each(function (key) {
      return (found = true)
    })
  } else {
    // JSstandard: wrong warning need this here
    for (var key in obj) {
      return false
    }
  }
  return !found
}
