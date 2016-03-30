module.exports = function(f) {
  var g = function() {
        for (var i = 0, len = befores.length; i < len; i++){
          befores[i].apply(this, arguments)
        }
        f.apply(this, arguments)
        for (var i = 0, len = afters.length; i < len; i++){
          afters[i].apply(this, arguments)
        }
      }
    , befores = g.befores = []
    , afters = g.afters = []
  g.unshift = function() {
    [].unshift.apply(befores, arguments)
  }
  g.push = function() {
    [].push.apply(afters, arguments)
  }
  g.prototype = f.prototype
  return g
}