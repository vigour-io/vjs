//index.js
var isNode = (typeof window === 'undefined')

if(!isNode) {
  document.body.style.fontFamily = 'andale mono'
  document.body.style.fontSize = '12px'
  document.body.style.lineHeight = '11px'
  window.gc()
  console.log = function() {
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
    document.scrollTop = document.scrollHeight;
  }
  // document.body.appendChild(arg)
}

//-------------------------------------------------------------

var Base = require('../lib/base')

var constructors = []
// for(var i = 0 ; i < 100; i++) {
//   var obj = {
//     name:i,
//   }
//   var Class = constructors[i-1] && constructors[i-1].$Constructor || Base 
//   constructors.push(new Class(obj))
// }

//-------------------------------------------------------------

var a = new Base({
  name:'a',
  a:'a',
  a2:'a',
  deep: {
    level1: {
      name:'a',
      level2: {
        name:'a',
        level3: {
          name:'a',
          blurf:'a'
        }
      }
    }
  }
})

var b = new a.$Constructor({
  name:'b',
  b:'b',
  a:'b',
  deep: {
    level1: {
      name:'b'
    }
  }
})

b._$name = 'b'



console.log('lets make C!')

var c = new b.$Constructor({
  name:'c',
  b:'c',
  c:'c',
  birthDay:'',
  img:'',
  pass:'',
  email:'',
  deep: {
    level1: {
      level2: {
         name:'c'
      }
    }
  }
})

c._$name = 'c'


// console.log('--check for enums...')
// for(var i in c.c) {
//   //this is fucked --- how to do non-enum???
//   console.log('field:',i)
// }

/*
  some standards --- $field is very important
  just like operators and getters this all comes from the basic Fibre (no value, data, object)
  only cloud-Fibre for example that rly does stuff dirrently
*/

var perf = require('../lib/util/perf')

//new Array()

console.log('OBJECTS','a:',a.$toString(),'\n\nb:',b.$toString(),'\n\nc:',c.$toString())
//need to add a reset!

document.body.innerHTML = ''


console.log('THIS SHOULD BE C!', c.deep.level1.level2.level3.$path)


var Class = c.$Constructor

// var Class = constructors[constructors.length-1].$Constructor
//deeper lookup (e.g. 100 nested things make it a lot slower (obvioursly))
//till 10 levels its only a very small amount extra (what we will use in the elements etc)
// var Class = constructors[0].$Constructor
// window.constructors = constructors
// console.error('?xxx')

var n = 100000

perf({
  name:'perf test n='+n,
  method:function() {
    var arr = []

    window.arr = arr

    for(var i = 0; i < n; i++) {
      
      var content = {
        name:i,
        birthDay: '10-20-'+i,
        img:'http://kittens.com?'+i,
        pass:'xxxxx'+i,
        email:'james@james.com'+i
      }
      var c = new Class(content)

      //if you need to run stuff optimized do it like this
      // var c = new Class()
      // c.$setKeyInternal( '_name', i, c._name)
      // c.$setKeyInternal( '_birthDay', '10-20-'+i, c._birthDay)
      // c.$setKeyInternal( '_img', 'http://kittens.com?'+i, c._img )
      // c.$setKeyInternal( '_pass', 'xxxxx'+i, c._pass)
      // c.$setKeyInternal( '_email', 'james@james.com'+i, c._email)

      arr.push( c )

    }

    console.log('CNTS!', window.cnt, window.setCnts)

  
    // for(var i in arr) {
    //   console.log(arr[i].$toString())
    // }

  }
})