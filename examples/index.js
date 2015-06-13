//index.js
var isNode = (typeof window === 'undefined')

if(!isNode) {
  document.body.style.fontFamily = 'andale mono'
  document.body.style.fontSize = '12px'
  document.body.style.lineHeight = '11px'
  window.gc()
  console.log = function() {
    document.scrollTop = -document.scrollHeight;
    var line = document.createElement('hr')
    document.body.appendChild(line)
    for(var i in arguments) {
      var arg = document.createElement('div')
      arg.style.backgroundColor = '#eee'
      arg.style.padding = '5px'

      arg.innerHTML = typeof arguments[i] === 'string' 
        ? arguments[i].replace(/(\r)|(\n)/g,'<br/>').replace(/ /g,'&nbsp;')
        : arguments[i]
      document.body.appendChild(arg)
    }
  }

   // document.body.appendChild(arg)
}


var Base = require('../lib/base')

var constructors = []
for(var i = 0 ; i < 100; i++) {
  var obj = {
    name:i,
  }
  var Class = constructors[i-1] && constructors[i-1].$Constructor || Base 
  constructors.push(new Class(obj))
}

var a = new Base({
  name:'a',
  a:'a',
  a2:'a'
})

var b = new a.$Constructor({
  name:'b',
  b:'b',
  a:'b'
})

var c = new b.$Constructor({
  name:'c',
  b:'c',
  c:'c'
})

console.log('a:',a.toString(),'\n\nb:',b.toString(),'\n\nc:',c.toString())


console.log('--check for enums...')
for(var i in c.c) {
  //this is fucked --- how to do non-enum???
  console.log('field:',i)
}


/*
  some standards --- $field is very important
  just like operators and getters this all comes from the basic Fibre (no value, data, object)
  only cloud-Fibre for example that rly does stuff dirrently
*/

var perf = require('../lib/util/perf')

 //new Array()

var obj = {}

var Class = c.$Constructor

// var Class = constructors[constructors.length-1].$Constructor
//deeper lookup (e.g. 100 nested things make it a lot slower (obvioursly))
//till 10 levels its only a very small amount extra (what we will use in the elements etc)

// var Class = constructors[0].$Constructor

// window.constructors = constructors

// console.error('?xxx')

var n = 1000000

perf({
  name:'perf test n='+n,
  method:function() {
    var arr = []
    for(var i = 0; i < n; i++) {
      // obj[i] = new Class()

      //fields in vjs are ofc a lot slower then normal objects (an object is made for them)
      arr.push(new Class({name:i}))
      // arr.push({name:i})
      // constructors[0][i] = i
      // arr.push({i:i}) //way more memory -- faster cpu (100% faster , requires 40% more mem)
      //caching the getter saves a lot of speed .... (arround 40% in this case)
      // arr.push(new Class({name:i, i:i}))
    }
  }
})