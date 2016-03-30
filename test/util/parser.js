exports.phantomTests = function (text) { 
  text = text.replace(/CONSOLE:/g,'')
  var arr = text.split('|||||||')
    , returnObj = {}
  for (var i in arr) {
    var m = arr[i].match(/([\s\S]+)parse time([\s\S]*?)([\d\.]+)([\s\S]*?)sec/);
    if (m && m[1] && m[3]) {
      m[1] = m[1].replace(/\n/g,'')
      if (m[1][0]===' ') m[1] = m[1].slice(1)
      if (m[1][m[1].length-1]===' ') m[1] = m[1].slice(0,m[1].length-1)  
      returnObj[m[1]] = m[3]
    }
  }
  return returnObj
}

exports.phantomErrors = function (text) {
  var arr = text.split('|||||||')
  for (var i in arr) {
    if (arr[i].indexOf('ERROR:')===0) {
      return arr[i]
    }
  }  
}
