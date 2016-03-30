module.exports = replace

function replace(map, thing){

  var isarray = thing instanceof Array
    , isobj = !isarray && thing instanceof Object


  for(var f in thing){
    var val = thing[f]

    if(val instanceof Object){
      replace(map, val)
    }else if(typeof val === 'string'){
      var valrep = check(val)
      if(valrep)
        thing[f] = valrep
    }

    if(isobj){
      var fieldrep = check(f)
      if(fieldrep){
        thing[fieldrep] = val
        delete thing[f]
      }
    }
  }

  function check(string){
    for(var s in map){
      if(string === s)
        return map[s]
    }
  }
}