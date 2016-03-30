module.exports = function match(a, b, flex, isflex){

  // var astr = JSON.stringify(a)
  //   , bstr = JSON.stringify(b)
  //   , alog = astr.length < 250 ? a : astr.slice(0,150) + '...'
  //   , blog = bstr.length < 250 ? b : bstr.slice(0,150) + '...'

  // console.log('match:\n', alog, '\nto:\n', blog, '\nisflex:\n',isflex)

  var flexfields, flexvalues
  if(flex){
    if(flex instanceof Array){
      flexfields = flex
    }else{
      flexfields = flex.flexfields
      flexvalues = flex.flexvalues  
    } 
  } 

  var a_obj = a instanceof Object
    , b_obj = b instanceof Object

  if(a_obj !== b_obj)
    return false

  var a_arr = a instanceof Array
    , b_arr = b instanceof Array

  if(a_arr !== b_arr)
    return false

  if(a_arr && b_arr){
    if(a.length !== b.length)
      return false
    for(var i = 0 ; i < a.length ; i++){
      if(!match(a[i], b[i], flex))
        return false
    }
  } else if(a_obj && b_obj){
    if(Object.keys(a).length !== Object.keys(b).length)
      return false

    if(isflex){
      for(var af in a){
        var foundmatch
        for(var bf in b){
          if(match(a[af], b[bf], flex))
            foundmatch = true
        }
        if(!foundmatch)
          return false
      }
    }else{
      for(var f in a){
        if(!match( a[f], b[f], flex, isFlex(flexfields, f)))
          return false
      }  
    } 
  } else {
    // console.log('primitive!', a === b)

    return isflex 
        || (flexvalues && isFlex(flexvalues, a, b))
        || a === b
  }
  return true
}

function isFlex(flex, a, b){
  // console.log('check for flex', a, b, flex)

  if( !flex 
   || typeof a !== 'string' 
   || b && typeof b !== 'string'
    )
    return false
  for(var i = 0, f ; f = flex[i] ; i++){
    // console.log('wex find', f, f.indexOf(a) !== -1)
    if(a.indexOf(f) !== -1 || b && b.indexOf(f) !== -1)
      return true
  }
  // console.log('no but got flex')
}
