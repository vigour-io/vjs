module.exports = function id(pre, level){
  var r = rnd()
  if(level) 
    while(level--){
      r += rnd()
    }
  return pre ? pre + r : r
}

function rnd(){
  return Number(String(Math.random()).slice(2)).toString(36)
}