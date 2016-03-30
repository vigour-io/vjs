var g = typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
          ? global
          : false
  , hasLS = typeof localStorage !== 'undefined'
  , hasPR = typeof process !== 'undefined'

var G = module.exports = 
  { session: function(key, val){
      return getSet(g, key, val)
    }
  , env: function(key, val){
      if(hasLS)
        return getSet(localStorage, key, val, 'getItem', 'setItem')
      else if(hasPR)
        return getSet(process.env, key, val)
    }
  }

function getSet(thing, key, val, getter, setter){
  if(!thing)
    return

  if(val === void 0){
    if(getter)
      return thing[getter](key)
    else
      return thing[key]
  }else{
    if(setter){
      thing[setter](key, val)
      return val
    }else{
      return thing[key] = val
    }
  }
}