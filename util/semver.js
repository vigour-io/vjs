module.exports = function(x, y) {
  var re = /^\d+\.\d+\.\d+$/
    , xParts
    , yParts
  if (!x.match(re) || !y.match(re)) {
    return x !== y
  } else {
    xParts = x.split('.')
    yParts = y.split('.')
    if (xParts[0] === yParts[0]) {
      if (xParts[1] === yParts[1]) {
        if (xParts[2] === yParts[2]) {
          return false
        } else {
          return parseInt(xParts[2], 10) > parseInt(yParts[2], 10)
        }
      } else {
        return parseInt(xParts[1], 10) > parseInt(yParts[1], 10)
      }
    } else {
      return parseInt(xParts[0], 10) > parseInt(yParts[0], 10)
    }
  }
}
