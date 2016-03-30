var a = 
    {
      users: {u_1: {name:'burk'}}
    }
  , b = 
    {
      users: {u_2: {name:'burk'}}
    }

console.log('matches:', match(a, b, ['users']))

console.log('we', match({a:3,b:4}, {a:3, b:4}))
console.log('we', match({a:3,b:4, fe:1}, {a:3, b:4, fe:111}, ['fe']))

module.exports = match

function match(a, b, exempt, isexempt){

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
      if(!match(a[i], b[i], exempt))
        return false
    }
  } else if(a_obj && b_obj){
    if(Object.keys(a).length !== Object.keys(b).length)
      return false

    if(isexempt){
      for(var af in a){
        var foundmatch
        for(var bf in b){
          if(match(a[af], b[bf], exempt))
            foundmatch = true
        }
        if(!foundmatch)
          return false
      }
    }else{
      for(var f in a){
        if(!match(a[f], b[f], exempt, exempt && exempt.indexOf(f) !== -1))
          return false
      }  
    } 
  } else {
    return isexempt || a === b
  }
  return true
}
