var debug = require('./') 
  , util = require('../') 
  , isNode = util.isNode //has to become part of util
  , V = require('../../')
  , repl
  , colors
  , origConsole = console
  , colors = {
      green:'#56db68',
      red:'#ff0000',
      grey:'#ccc',
      yellow:'#e0e67c',
      cyan:'#00ffff',
      magenta:'#ff00ff',
      blue:'#1111ff',
      white:'#fff'
    }
  , styles = {
      bold:'font-weight:bold;font-size:16px;line-height:15px',
      underline:'border-bottom:1px solid',
      italic:'font-style:italic',
      inverse:function(color) {
        if(color) {
          return color+';background-color:#333;padding:5px;line-height:20px'
        } else {
          return 'color:'+colors.white+';background-color:#333;padding:5px;line-height:20px'
        }
      }
    }

debug.level = 
{ DEBUG$: Infinity
, test:2
}



/*
bold
italic
underline
inverse
yellow
cyan
white
magenta
green
red
grey
blue
rainbow
zebra
random
*/

//------------------------------------------------------------------------------

var logObject
  , parseObject
  , LOG
  , INFO
  , ERROR
  , DETAIL



if (!isNode) { 

  LOG = ':'
  INFO = '::'
  ERROR = 'ERREX!'
  DETAIL = ':::'

  console = {}
  function loglink(i) {
    return function() {
      // console.log(i, arguments)
      // console.log(new Error().stack)

      origConsole[i].apply(origConsole, arguments)
    }
  }

  for(var i in origConsole) {
    if(i !== 'log') console[i] = loglink(i)
  }

  var Color = function(val,code,s) {
    this.color =  (s ? code : 'color: '+code)+';'
    this.val = new String('%c'+val)
  }
  
  console.log = function() {

    var next = false

    for(var i=0, arg, rargs=[], args = arguments,len = args.length;i<len;i++) {
      arg = args[i]
      if(arg instanceof Color) {
        if(rargs.length){
          next = util.arg(args, i)
          break
        }else{
          rargs.push(arg.val.valueOf(), arg.color)
        }
        // logger(arg.val.valueOf(), arg.color)
      } else {
        rargs.push(arg)
      }
    }
    // logger('now log', rargs)
    if(rargs.length) logger.apply(origConsole,rargs)
    // logger('next', next)
    if(next.length) console.log.apply(null,next)

  }

  function color(i, Class, style) {
    util.define(Class || String,i,{
      get:function() {
        if(Class) {
          if(typeof style === 'function') {
            this.color = style(this.color)
          } else {
            this.color+=(style||('color:'+colors[i]))+';'
          }
          return this
        } else {
          var s = colors[i]
          if(style) {
            if(typeof style === 'function') {
              s = style()
            } else {
              s=style
            }
          }
          return new Color(this,s,style)
        }
      }
    })
  }

  function logger() {


    origConsole.log.apply(origConsole,arguments)


  }

  for(var i in colors) { color(i) }
  for(var i in styles) { color(i, false, styles[i]) }  
  for(var i in colors) { color(i, Color) }
  for(var i in styles) { color(i, Color, styles[i]) }  

  parseObject = function(obj) {
    if(typeof obj === 'string') return obj
    var str = ''
    for(var i in obj) {
      str += i + ' : ' + (typeof obj[i] === 'string' 
        ?  obj[i] 
        : JSON.stringify(obj[i],false,2)) 
      + '\n'
    }
    return str.inverse.green
  }
  
  logObject = function(obj) {
    console.log(parseObject(obj))
  }
  
} else {
  repl = require('repl')
  colors = require('colors')

  LOG = 'log  '.grey
  INFO = 'info '.green
  ERROR = 'error'.red
  DETAIL = '-----'.grey

  debug.repl = function() {
    repl.start('>')
    return debug
  }
  if(repl.context) repl.context.DEBUG$ = DEBUG$

  console.group = function() {
    console.log('\n____________________________________________________'.grey)
  }      
  console.groupEnd = function() {
    console.log('____________________________________________________\n'.grey)
  }
  var n_util = require('util')
  parseObject = function(obj){
    return n_util.inspect(obj,{colors:true, depth: 50})
  }
  logObject = function(obj){
    console.log(parseObject(obj))
  }
}

//------------------------------------------------------------------------------

util.define(Object,'DEBUG$log', function(msg,s) {
  if(console.group) console.group()
  if(typeof msg === 'string') {
    msg = msg
  } else {
    msg = false
  }
  var h = 'JSON '+(msg||' normal')
  debug.log.header(h)
  if(debug.level.test>1) console.log(JSON.stringify(this,false,2))
  if(s) {
    console.log('\n')
    debug.log.fn.apply(this,util.arg(arguments,1)) 
  }
  // debug.log.end(h)
  if(console.group) console.groupEnd()
  return JSON.stringify(this,false,2)
})

if(!isNode && localStorage) {
  util.define(localStorage,'DEBUG$log', function(msg,s) {
    if(console.group) console.group()
    if(typeof msg === 'string') {
      msg = msg
    } else {
      msg = false
    }
    var h = 'localStorage '+(msg||' normal')
    debug.log.header(h)

    var obj = {}
    for(var i in this) {
      // console.log(i, this)
       try { obj[i] =JSON.parse(this[i]) } catch(e){
        obj[i] = this[i]
       }
    }

    // console.log()

    if(debug.level.test>1) console.log(JSON.stringify(obj,false,2))
    if(s) {
      console.log('\n')
      debug.log.fn.apply(this,util.arg(arguments,1)) 
    }
    // debug.log.end(h)
    if(console.group) console.groupEnd()
    return obj
  })
}

//------------------------------------------------------------------------------

var log = module.exports = exports = {
  stack: false,
  i:function(nr) {
    nr = this.indent
    var str = ''
    for(var i in nr) {
      str+='  '
    }
    return str
  },
  parse: parseObject,
  object: logObject,
  default: function(label, level){
    if(label instanceof Object)
      for(var l in label)
        setDefault(l, label[l])
    else
      setDefault(label, level)
  },
  logger:function(label, color, level){
    log.default(label, level || 1)
    
    function logger(){
      var level = debug.level.global !== undefined ? debug.level.global : debug.level[label]
      if(level > 2) {
        console.log.apply(null, [label[color].bold, LOG].concat(util.arg(arguments)))
        if(log.stack) console.log(smallStack(log.stack).grey)
      }
    }

    logger.info = function(){
      var level = debug.level.global !== undefined ? debug.level.global : debug.level[label]
      if(level > 1) {
        console.log.apply(null, [label[color].bold, INFO].concat(util.arg(arguments)))
        if(log.stack) console.log(smallStack(log.stack).grey)
      }
        
    }
    logger.error = function(){
      var level = debug.level.global !== undefined ? debug.level.global : debug.level[label]
      if(level > 0) {
        console.log.apply(null, [label[color].bold, ERROR].concat(util.arg(arguments)))
        if(log.stack) console.log(smallStack(log.stack).grey)
      }
    }
    logger.detail = function(){
      var level = debug.level.global !== undefined ? debug.level.global : debug.level[label]
      if(level > 3) {
        console.log.apply(null, [label[color].bold, DETAIL].concat(util.arg(arguments)))
        if(log.stack) console.log(smallStack(log.stack).grey)
      }      
    }
    logger.parse = parseObject
    return logger
  },
  label: function(label, style, log){
      if(isNode) {
        console.log.apply(null, log)
      } else {
        console.log.apply( null
          , ['%c '+label+' ', style].concat(log)
        )
      }
  },
  header:function(msg) {
    this._lh = msg
    console.log(msg.inverse)
  },
  header2:function(msg) {
    this._lh = msg
    console.log(msg.grey.inverse)
  },
  end:function(msg) {
    console.log(('end ['+msg+']').grey.inverse)
  },
  level:function(level,field) {
    if(level >= debug.level.test 
      ||  debug.level[level] 
      || field && debug.level[level]>=field ) 
      console.log.apply(this,util.arg(arguments,1))
  },
  fn:function(arg) {
    debug.log.indent++
    if(typeof arg === 'function') {
      arg.call(this,util.arg(arguments,1))
    } else {
      console.log.apply(this,arguments)
    }
    debug.log.indent--
  },
  indent:0
}

//------------------------------------------------------------------------------
function smallStack(lines){
  if(!lines) lines = 1
  var stack = new Error().stack.split('\n')
    , l = 3
    , result = []
    , end

  while(lines--){
    line = stack[l++]
    end = line[line.length-1] === ')' ? line.length-1 : line.length
    result.push(line.slice(line.indexOf('/'), end))
  }

  return result.join('\n').grey
  
}

function setDefault(label, level){
  if(debug.level[label] === void 0) debug.level[label] = level
}

setTimeout(function() {
  console.log('log levels:\n', log.parse(debug.level))
},0)

//Localstorage

/*
var localStorageSpace = function(){
        var allStrings = '';
        for(var key in window.localStorage){
            if(window.localStorage.hasOwnProperty(key)){
                allStrings += window.localStorage[key];
            }
        }
        return allStrings ? 3 + ((allStrings.length*16)/(8*1024)) + ' KB' : 'Empty (0 KB)';
    };

*/

util.define(debug,'localStorageSize', {
  get:function() {
  var total = 0
  for(var x in localStorage) {
    var kbytes = (((x.length+localStorage[x].length))/(1024))
    total+=kbytes
    // console.log((x+":"+kbytes.toFixed(10)+" KB").grey)
  }
  console.log('LOCAL STORAGE SIZE TOTAL'.inverse.green, (total/1024).toFixed(5)+' MB')
  return total*1024
}
})

util.define(debug,'localStorageKeysSize', {
  get:function() {
  var total = 0
  for(var x in localStorage) {
    var kbytes = (((x.length))/(1024))
    total+=kbytes
    // console.log((x+":"+kbytes.toFixed(10)+" KB").grey)
  }
  console.log('LOCAL STORAGE KEY SIZE TOTAL'.inverse.green, (total/1024).toFixed(5)+' MB')
  return total*1024
}
})


