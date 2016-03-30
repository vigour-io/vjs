var loaded = []
  , util = require('../../util')

module.exports = function( files, cb ) {
  var recur = function( src, nestedcb ) {
    if(util.checkArray( loaded, src )) nestedcb()
    var extension = src.match(/\.([a-zA-Z0-9]{1,30})$/)[1]
      , fileref = document.createElement(extension==='js' ? 'script' : 'link')
      , head =  document.getElementsByTagName("head")[0]
      , found
    if(extension==='js') {
      fileref.setAttribute("type", "text/javascript")
      fileref.setAttribute("src", src)
    } else {
      fileref.setAttribute("type", "text/css")
      fileref.setAttribute("rel", "stylesheet")
      fileref.setAttribute("href", src)
      fileref.setAttribute("id", src)
    }
    fileref.onload = nestedcb
    head.appendChild(fileref)
  }
  if(files instanceof Array) {
    var cntr=0
      , len = files.length
      , rdyCnt = function() {
      cntr++
      if(cntr===len && cb) cb()
    }
    for(var i = 0 ; i < len; i++) {
      recur(files[i], rdyCnt)
    }
  } else {
    recur(files, cb)
  }
}