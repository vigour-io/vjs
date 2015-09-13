exports.$define = {
  resolve: resolve
}

function resolve(path, options) {
  var config = this
  var skipVal = options && options.skipVal
  var found = config.find(path)

  var deep = path instanceof Array && path.length

  for(var i = 0, target; target = found[i] ; i++) {
    var setTarget = target.$parent
    if(deep) {
      var up = deep - 1
      while(up--){
        setTarget = setTarget.$parent
      }
    }
    var setobj = target.convert({ exclude: excludeKey })
    if(skipVal) {
      delete setobj.$val
    }
    setTarget.set(setobj)
  }

  if(!deep && path[0] === '#') {
    config.set({
      branch: path.slice(1)
    })
  }

  return config
}

function excludeKey(key) {
  return key[0] === '$'
}
