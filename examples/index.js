//-------------------------------------------------------------

var log = require('../lib/util/log')

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

//-------------------------------------------------------------

var perf = require('../lib/util/perf')

log('OBJECTS','a:',a.$toString(),'\n\nb:',b.$toString(),'\n\nc:',c.$toString())

log('THIS SHOULD BE C!'
  , c.deep.level1.level2.level3.$parent.$parent.$parent.$parent.name._$val)

var Class = c.$Constructor

var n = 100000

perf({
  log:log,
  name:'perf test n='+n,
  method:function() {
    var arr = []

    for(var i = 0; i < n; i++) {
      
      var content = {
        name:i,
        birthDay: '10-20-'+i,
        img:'http://kittens.com?'+i,
        pass:'xxxxx'+i,
        email:'james@james.com'+i
        // _gurken:true
      }

      var c = new Class( content )

      //if you need to run stuff optimized do it like this
      
      // var c = new Class()

      // c.$setKeyInternal( '_name', i, c._name)
      // c.$setKeyInternal( '_birthDay', '10-20-'+i, c._birthDay)
      // c.$setKeyInternal( '_img', 'http://kittens.com?'+i, c._img )
      // c.$setKeyInternal( '_pass', 'xxxxx'+i, c._pass)
      // c.$setKeyInternal( '_email', 'james@james.com'+i, c._email)

      // c.$setKeyInternal( 'gurken', i )

      // var c = { gurken: i }
      // c.gruken = i

      arr.push( c )

    }

  }
})

//-------------------------------------------------------------
