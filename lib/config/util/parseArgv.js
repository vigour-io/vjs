module.exports = function parseArgv() {
  var setobj = {}
  var args = process.argv

  var check = /^--./

  for(var i = 0, param; param = args[i]; i++) {
    if(check.test(param)) {
      param = param.slice(2)
      var val = args[i+1]
      if(check.test(val)) {
        val = true
      } else {
        i++
        try{
          val = JSON.parse(val)
        } catch(err) {
          // console.log(val, 'is not JSON.parse-able')
        }
      }
      setobj[param] = val
    }
  }
  
  return setobj
}
