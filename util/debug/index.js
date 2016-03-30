var debug = exports

DEBUG$ = debug

/*
  console.log('util/test \n\nif you want to check memory usage start chrome using: \n\n open -a Google\\ Chrome --args --enable-memory-info \n')
*/
var util = require('../')
  , isNode = util.isNode //has to become part of util
  , V = require('../../')
  , log = debug.log = require('./log')
  , debuglog = log.logger('DEBUG$', 'rainbow')

debug.perf = require('./performance')

//------------------------------------------------------------------------------

if(!isNode) {
  debug.cases = require('../../browser/cases/')
  exports.body = document.body.base
  Object.defineProperty(module.exports, 'domain', {
    get: function() {
      //debugger --- can go away with a transform
      return String(window.location)
        .match(/https?:\/\/([^\/]+)/)[1]
        .replace(/:.+/, '')
    }
  })

} else {
  var DEBUG = process.env.DEBUG
  if(DEBUG){
    var levels = DEBUG.split(',')
    for(var l in levels){
      var two = levels[l].split(':')
      DEBUG$.level[two[0]] = two[1] ? Number(two[1]) : 3
    }
  }
}

//------------------------------------------------------------------------------

exports.int = function(rand, fn) {
  function func() {
    rand = rand||1000
    return ~~(Math.floor(Math.random()*rand))
  }
  return fn ? func() : func
}

exports.text = function (length, fn, str, nolines, strict) {
  if (fn) {
    return function() {
      return exports.text(
        Math.round(Math.random() * length) + 1, false, str, nolines, strict
      )
    }
  }
  else {
    var s = ['.', '.', '.', ';', ',']
      , b = ['ab', 'able', 'zo', 'x', 'lax', 'bur', 'rem', 'lur', 'fur', 'jur', 'lex', 'rex', 'wurd',
        'shur', 'burn', 'heps', 'a', 'i', 'y', 'u', 'e', 'p', 'l', 'splurf']
      , output = ''
      , nospace = 0

    if (str) b = str

    str = function () {
      return b[Math.round(Math.random() * (b.length - 1))]
    }
    if (!length) length = ~~ (Math.random() * 101)
    for (var i = 0, g; i < length; i++) {
      if ( !strict && (!output[output.length - 1]
        || output[output.length - 2] === '.'
        || output[output.length - 2] === '\n')
      ) {
        g = str()
        output += g[0].toUpperCase() + g.slice(1)
      }
      else {
        output += str()
      }
      nospace++
      if (!strict && ~~(Math.random() * (nospace / 2))) {
        var br = false
          , v
        if (!nolines && ~~(Math.random() * 21) > 17) {
          v = s[~~(Math.random() * (s.length - 1))]
          output += v
          if (v === '.' && ~~(Math.random() * 11) > 6) {
            br = true
            output += '\n'
            if (~~(Math.random() * 11) > 7) output += '\n';
          }
        }
        if (!br) output += ' '
        nospace = 0
      }
    }
    return output
  }
}

exports.data = function (populate, level, obj, cnt, prev) {
  if (!obj) obj = {}
  if (!cnt) cnt = 0
  if (!level) level = 0
  for (var i in populate) {
    if ((populate[i] instanceof Object)
      && populate[i].length && populate[i].val
    ) {
      if (populate && populate[i]) {
        obj[i] = []
        for (var j = 0; j < populate[i].length; j++) {
          obj[i][j] = typeof populate[i].val === 'function'
            ? populate[i].val()
            : exports.data(populate[i].val, (level + 1), false, j + 1, obj)
        }
      }
    }
    else if ((populate[i] instanceof Object)
      && (typeof populate[i] !== 'function')
    ) {
      obj[i] = exports.data(populate[i], (level + 1), obj[i], false, cnt, obj)
    }
    else if (populate && populate[i]) {
      obj[i] = (typeof populate[i] === 'function')
      ? populate[i].call(obj, cnt, prev)
      : populate[i];
    }
  }
  return obj;
};

//------------------------------------------------------------------------------
debug.download = function(filename, text) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);
  pom.click();
}

//------------------------------------------------------------------------------
debug.remote = function(id) {
  var fileref = document.createElement('script')
  fileref.setAttribute("type", "text/javascript")
  fileref.setAttribute("src", 'http://jsconsole.com/remote.js?'+id)
  document.getElementsByTagName("head")[0].appendChild(fileref)
}

debug.findScript = function(node,name,strict) {
  var children = node.childNodes
    , extension = name.match(/\.([a-zA-Z0-9]{1,30})$/)[1]
    , regExp = !strict && new RegExp(name+'$')
    , field = extension === 'js' ? 'src' : 'href'

  for(var i in children) {
    if(strict ? children[i][field]===name : regExp.test(children[i][field]))
      return children[i]
  }
}

function prompty(msg, value, cb) {
    var dialog = document.createElement("div")
        , p = document.createElement("p")
        , input = document.createElement("input")
        , ok = document.createElement("button")
        , cancel = document.createElement("button")
    p.appendChild(document.createTextNode(msg))
    input.type = "text"
    input.value = value
    input.style.display = "block"
    ok.appendChild(document.createTextNode("OK"))
    cancel.appendChild(document.createTextNode("Cancel"))
    ok.addEventListener('click', function () {
        hideDialog()
        cb(input.value)
    })
    cancel.addEventListener('click', function () {
        hideDialog()
        cb(null)
    })
    dialog.appendChild(p)
    dialog.appendChild(input)
    dialog.appendChild(ok)
    dialog.appendChild(cancel)
    dialog.style.position = "absolute"
    dialog.style.top = 25 + "px"
    dialog.style.left = 50 + "px"
    dialog.style.zIndex = 1000
    dialog.style.backgroundColor = "white"
    document.body.appendChild(dialog)
    function hideDialog() {
        dialog.parentNode.removeChild(dialog)
    }
}

debug.native = function(def, parse, cb) {
  if(!document.getElementById('dev')) {
    var elem = document.createElement('div')
    elem.id = 'dev'
    elem.style.zIndex = 9999999
    elem.style.position = 'absolute'
    elem.style.left = '2px'
    elem.style.top = '80px'
    elem.style.padding = '15px'
    elem.style.backgroundColor = 'rgba(50,50,50,0.8)'
    elem.style.borderRadius = '50%'
    elem.addEventListener('click',function() {
      prompty('IP', localStorage.getItem('devip') || def || 'http://10.0.1.2:8080', function (ip) {
        if (ip) {
          localStorage.setItem('devip',ip)
           window.location.reload()
        } else {
          // alert('x')
          localStorage.removeItem('devip')
          window.location.reload()
        }
      })
    })
    document.body.appendChild(elem)
  }

  if(localStorage.getItem('devip')) {
    DEBUG$.remoteResource(localStorage.getItem('devip')+'/bundle.css','build.css',false)

    if(DEBUG$.remoteResource(localStorage.getItem('devip')+'/bundle.js','build.js',false)) {
      document.getElementById('dev').style.backgroundColor = 'rgba(0,255,0,0.8)'
      console.log('devip:', localStorage.getItem('devip'))
      if(cb) cb(localStorage.getItem('devip'))
      return true
    } 
  }
}

//hier remoteresource gebruiken
debug.remoteResource = function(src, replace, strict) {
  console.log('remote resource',src)
  var strict = strict !== void 0 ? strict : true
    , extension = src.match(/\.([a-zA-Z0-9]{1,30})$/)[1]
    , fileref = document.createElement(extension==='js' ? 'script' : 'link')
    , head =  document.getElementsByTagName("head")[0]
    , body = document.body
    , found
    , fileSrc

  console.log('remote resource',extension)

  if(!replace) {
    strict = false
    replace = src.match(extension==='js'
      ? /(\/)([a-zA-Z0-9-_+$]){0,30}\.js$/
      : /(\/)([a-zA-Z0-9-_+$]){0,30}\.css$/
    )[0].slice(1)
  }

  fileSrc = src+'?'+ ~~(Math.random()*9999999)

  if(extension==='js') {
    fileref.setAttribute("type", "text/javascript")
    fileref.setAttribute("src", fileSrc)
  } else {
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("href", fileSrc)
    fileref.setAttribute("id", fileSrc)
  }

  found = debug.findScript(head,replace,strict)
  if(!found) found = debug.findScript(body,replace,strict)
  if(found) {

    console.log('remote resource found:',found, found.src , fileSrc, src)

    var parent = found.parentNode
    if(String(found.src).indexOf(src)>-1) {
      return
    }

    parent.removeChild(found)
    parent.appendChild(fileref)
    return true
  }
}
